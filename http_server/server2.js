const config = require('./config')
config.serviceName = 'server2'
const Tracer = require('shimo-jaeger')

const tracer = new Tracer(config)

const http = require('http')
const rp = require('request-promise')
const server = http.createServer(async (req, res) => {
  await rp('https://shimo.im')
  
  res.end('ok')
})

server.listen(3001)
