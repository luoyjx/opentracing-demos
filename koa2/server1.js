const Instrument = require('@risingstack/opentracing-auto')
const jaeger = require('jaeger-client')
const UDPSender = require('jaeger-client/dist/src/reporters/udp_sender').default

const sampler = new jaeger.RateLimitingSampler(1)
const reporter = new jaeger.RemoteReporter(new UDPSender())
const tracer = new jaeger.Tracer('koa2-serviceA', reporter, sampler, {
  tags: {
    gitTag: 'foo'
  }
})

const instrument = new Instrument({
  tracers: [tracer]
})

const Koa = require('koa');
const app = new Koa();
const rp = require('request-promise')

// response
app.use(async ctx => {
  await rp('http://localhost:3001')

  ctx.body = 'Hello Koa';
});

app.listen(3000);