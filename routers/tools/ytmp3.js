const Scraper = new(require('../../lib/scraper'))

exports.routes = {
   category: 'tools',
   path: '/api/ytmp3',
   parameter: ['url'],
   method: 'get',
   execution: async (req, res, next) => {
      const json = await Scraper.ytmp3(req.query.url)
      res.json(json)
   },
   error: false,
   validator: (req, res, next) => {
      const check = global.status.required(req, exports.routes.parameter)
      if (!check.status) return res.json(check)
      const { url } = req.query
      const isUrl = global.status.url(url)
      if (!isUrl.status) return res.json(isUrl)
      next()
   }
  }
