const config = require('./config')
config.serviceName = 'server1'
const Tracer = require('shimo-jaeger')

const tracer = new Tracer(config)

const http = require('http')
const rp = require('request-promise')
const server = http.createServer(async (req, res) => {
  await rp('http://localhost:3001')
  
  res.end('ok')
})

server.listen(3000)

