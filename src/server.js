const app = require("./app");
const { env } = require("./config/env");

const server = app.listen(env.port, () => {
  console.log(
    `GitLab Security Scanner running on http://localhost:${env.port}`
  );
});


const shutdown = (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);

  server.close(() => {
    console.log("HTTP server closed.");

    process.exit(0);
  });
};


process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));