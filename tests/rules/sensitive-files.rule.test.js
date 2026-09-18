const {
  isSensitiveFile,
} = require("../../src/rules/sensitive-files.rule");

describe("Sensitive Files Rule", () => {
  test("detects .env", () => {
    expect(isSensitiveFile(".env")).toBe(true);
  });

  test("detects .env.production", () => {
    expect(isSensitiveFile(".env.production")).toBe(true);
  });

  test("detects private key", () => {
    expect(isSensitiveFile("keys/id_rsa")).toBe(true);
  });

  test("detects PEM file", () => {
    expect(isSensitiveFile("certificates/server.pem")).toBe(true);
  });

  test("detects secrets.yml", () => {
    expect(isSensitiveFile("config/secrets.yml")).toBe(true);
  });

  test("does not detect normal JavaScript file", () => {
    expect(isSensitiveFile("src/index.js")).toBe(false);
  });
});