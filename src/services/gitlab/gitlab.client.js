const axios = require("axios");

const { env } = require("../../config/env");

const gitlabClient = axios.create({
  baseURL: env.gitlab.baseUrl,
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

if (env.gitlab.token) {
  gitlabClient.defaults.headers.common.Authorization =
    `Bearer ${env.gitlab.token}`;
}

module.exports = gitlabClient;