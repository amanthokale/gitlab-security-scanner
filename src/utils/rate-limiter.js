class RateLimiter {
  constructor({ maxRequests, intervalMs }) {
    this.maxRequests = maxRequests;
    this.intervalMs = intervalMs;
    this.timestamps = [];
  }

  async acquire() {
    while (true) {
      const now = Date.now();

      // Remove requests outside the current time window
      this.timestamps = this.timestamps.filter(
        (timestamp) => now - timestamp < this.intervalMs
      );

      // Slot available
      if (this.timestamps.length < this.maxRequests) {
        this.timestamps.push(now);
        return;
      }

      // Wait until the oldest request leaves the window
      const oldestRequest = this.timestamps[0];

      const waitTime =
        this.intervalMs - (now - oldestRequest);

      await this.sleep(waitTime);
    }
  }

  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}

module.exports = {
  RateLimiter,
};