const scannerConfig = {
  concurrency: 5,

  rateLimit: {
    maxRequests: 20,
    intervalMs: 60 * 1000,
  },
};

module.exports = {
  scannerConfig,
};