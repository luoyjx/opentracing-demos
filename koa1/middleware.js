const http = require('http')
const Instrument = require('@risingstack/opentracing-auto')
const { Tags, FORMAT_HTTP_HEADERS } = require('opentracing')
const jaeger = require('jaeger-client')
const UDPSender = require('jaeger-client/dist/src/reporters/udp_sender').default
const uuid = require('uuid/v4')

module.exports = function (serviceName) {
  const OPERATION_NAME = 'http_koa'
  const sampler = new jaeger.RateLimitingSampler(1)
  const reporter = new jaeger.RemoteReporter(new UDPSender())
  const tracer = new jaeger.Tracer(serviceName, reporter, sampler, {
    tags: {
      gitTag: 'foo'
    }
  })
  tracer.__clsNamespace = uuid()
  
  const instrument = new Instrument({
    tracers: [tracer]
  })
  
  instrument.hookModule(http, 'http')

  return function * (next) {
    const url = `${this.protocol}://${this.host}${this.url}`
    const parentSpanContext = tracer.extract(FORMAT_HTTP_HEADERS, this.headers)
    const span = tracer.startSpan(OPERATION_NAME, {
      childOf: parentSpanContext,
      tags: {
        [Tags.SPAN_KIND]: Tags.SPAN_KIND_RPC_SERVER,
        [Tags.HTTP_URL]: url,
        [Tags.HTTP_METHOD]: this.method
      }
    })

    yield next

    span.setTag(Tags.HTTP_STATUS_CODE, this.status)
    if (this.status >= 400) {
      span.forEach((span) => span.setTag(Tags.ERROR, true))
    }
    span.finish()
  }
}
