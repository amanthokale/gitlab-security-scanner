require("dotenv").config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",

  port: Number(process.env.PORT) || 5000,

  gitlab: {
    baseUrl:
      process.env.GITLAB_BASE_URL || "https://gitlab.com/api/v4",
    token: process.env.GITLAB_TOKEN || null,
  },

  corsOrigin: process.env.CORS_ORIGIN || "*",
};

module.exports = {
  env,
};