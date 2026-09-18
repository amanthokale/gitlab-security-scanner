const pLimit = require("p-limit");

const scannerService = require("./local.repository.scanner");
const { RateLimiter } = require("../../utils/rate-limiter");
const { scannerConfig } = require("../../config/scanner.config");

const concurrencyLimit = pLimit(
  scannerConfig.concurrency
);

const rateLimiter = new RateLimiter(
  scannerConfig.rateLimit
);

const scanProjects = async (projects) => {
  const tasks = projects.map((project) =>
    concurrencyLimit(async () => {
      await rateLimiter.acquire();

      try {
        console.log(`Scanning: ${project.name}`);

        return await scannerService.scanRepository({
          id: project.id,
          name: project.name,
          webUrl: project.web_url,
          defaultBranch: project.default_branch,
        });
      } catch (error) {
        console.error(
          `Failed: ${project.name} - ${error.message}`
        );

        return {
          project: {
            id: project.id,
            name: project.name,
            webUrl: project.web_url,
          },
          findings: [],
          totalFindings: 0,
          error: {
            message: error.message,
            status: error.response?.status || null,
          },
        };
      }
    })
  );

  return Promise.all(tasks);
};

module.exports = {
  scanProjects,
};