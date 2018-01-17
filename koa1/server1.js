const http = require('http')
const Instrument = require('shimo-opentracing-auto')
const jaeger = require('jaeger-client')
const UDPSender = require('jaeger-client/dist/src/reporters/udp_sender').default

const sampler = new jaeger.RateLimitingSampler(1)
const reporter = new jaeger.RemoteReporter(new UDPSender())
const tracer = new jaeger.Tracer('serviceA', reporter, sampler, {
  tags: {
    gitTag: 'foo'
  }
})

const instrument = new Instrument({
  tracers: [tracer]
})

const koa = require('koa')
const app = koa()
const rp = require('request-promise')

app.use(function * () {
  yield rp('http://localhost:3001')

  this.body = { success: true }
})

app.listen(3000)

