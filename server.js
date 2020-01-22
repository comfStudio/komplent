const express = require('express')
const next = require('next')
const cors = require('cors')
const gitApi = require('@tinacms/api-git')

const port = parseInt(process.env.PORT, 10) || 3510
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const whitelist = ['http://localhost:3500', 'http://localhost:3000']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.prepare().then(() => {
  const server = express()

  server.use(cors(corsOptions))
  server.use('/___tina', gitApi.router())

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
