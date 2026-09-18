const {
  sensitiveFilesRule,
} = require("./sensitive-files.rule");

const {
  metadataRule,
} = require("./metadata.rule");

const {
  secretsRule,
} = require("./secrets.rule");

const rules = [
  sensitiveFilesRule,
  secretsRule,
  metadataRule,
];

module.exports = {
  rules,
};