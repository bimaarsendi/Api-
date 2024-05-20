const axios = require('axios')
const puppeteer = require('puppeteer')
const iPhone = puppeteer.devices['iPhone 12']

class Proto {
   async _post(url, payload, options = {}) {
      const result = await (await axios.post(url, payload, options)).data
      return result
   }
}

module.exports = class Scraper extends Proto {
   constructor() {
      super()
   }
   
   shorten = url => new Promise(async resolve => {
      try {
         const json = await this._post('https://dr-api.encurtador.dev/encurtamentos', {
            url
         }, {
            headers: {
               origin: 'https://www.urlshort.dev',
               referer: 'https://www.urlshort.dev/',
               'user-agent': 'Mozilla/5.0 (Linux; Android 8.1.0; CPH1803) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Mobile Safari/537.36'
            }
         })
         if (!json.urlEncurtada) return resolve({
            creator: global.creator,
            status: false,
            msg: `Sorry, we couldn't process your URL!`
         })
         resolve({
            creator: global.creator,
            status: true,
            data: {
               original: url,
               short_url: 'https://' + json.urlEncurtada
            }
         })
      } catch (e) {
         resolve({
            creator: global.creator,
            status: false,
            msg: e.message
         })
      }
   })
      
   ytmp3 = async url => {
      const browser = await puppeteer.launch({
         headless: 'new',
         args: [
            "--fast-start",
            "--disable-extensions", 
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--no-gpu",
            "--disable-background-timer-throttling",
            "--disable-renderer-backgrounding",
            "--override-plugin-power-saver-for-testing=never",
            "--disable-extensions-http-throttling",
            "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.3"
         ]
      })
   try {
      const page = await browser.newPage()
      await page.emulate(iPhone)
      await page.goto('https://ytmp3s.nu', {
         waitUntil: 'networkidle2',
         timeout: 0
      })
      await page.type('input#url', url)
      await page.click('input[value="Convert"]')
      await page.waitForSelector('#progress', {
         hidden: true
      })
      const fileName = await page.evaluate(() => {
         const el = document.querySelector('form > div')
         return el ? el.innerText: ''
      })
      const fileUrl = await page.evaluate(() => {
         const el = document.querySelector('form > div > a[rel="nofollow"]')
         return el ? el.href: ''
      })
      await browser.close()
      if (!fileUrl) return ({
         status: false,
         msg: `Can't contvert file!`
      })
      return ({
         status: true,
         data: {
            filename: fileName + '.mp3',
            url: fileUrl
         }
      })
   } catch (e) {
      await browser.close()
      return ({
         status: false,
         msg: e.message
      })
   }
  }
}
