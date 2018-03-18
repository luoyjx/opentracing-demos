
module.exports = {
  enable: true,
  serviceName: 'default',
  options: {
    enables: ['http'],
    rateLimit: 20,
    sender: {
      host: 'localhost'
    }
  }
}
