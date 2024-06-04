const axios = require('axios')

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

   tiktok = (url) => {
      return new Promise(async (resolve, reject) => {
         try {
            const json = (await axios('https://www.veed.io/video-downloader-ap/api/download-content', {
               method: 'POST',
               data: new URLSearchParams(Object.entries({ url })),
               headers: {
                  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
                  'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
               }
            })).data;
            resolve({
               creator: global.creator,
               status: true,
               data: json
            })
         } catch (e) {
            resolve({
               creator: global.creator,
               status: false,
               message: e.message
            })
         }
      })
   }
}
