const {
  isLikelySecret,
} = require("../../src/rules/secrets.rule");

describe("Secrets Detection Rule", () => {
  test("detects API key", () => {
    const content = `
      API_KEY="sk_test_1234567890123456"
    `;

    const findings = isLikelySecret(content);

    expect(findings.length).toBeGreaterThan(0);
  });

  test("detects password", () => {
    const content = `
      password="MySuperSecretPassword123"
    `;

    const findings = isLikelySecret(content);

    expect(findings.length).toBeGreaterThan(0);
  });

  test("detects AWS access key", () => {
    const content = `
      AWS_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE
    `;

    const findings = isLikelySecret(content);

    expect(
      findings.some(
        (finding) => finding.id === "aws-access-key"
      )
    ).toBe(true);
  });

  test("detects private key", () => {
    const content = `
      -----BEGIN RSA PRIVATE KEY-----
      something
    `;

    const findings = isLikelySecret(content);

    expect(
      findings.some(
        (finding) => finding.id === "private-key"
      )
    ).toBe(true);
  });

  test("does not detect normal code", () => {
    const content = `
      const username = "john";
      console.log(username);
    `;

    const findings = isLikelySecret(content);

    expect(findings.length).toBe(0);
  });
});