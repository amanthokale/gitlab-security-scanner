const SECRET_PATTERNS = [
  {
    id: "aws-access-key",
    name: "AWS Access Key",
    pattern: /\bAKIA[0-9A-Z]{16}\b/,
    severity: "HIGH",
  },
  {
    id: "github-token",
    name: "GitHub Token",
    pattern: /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/,
    severity: "HIGH",
  },
  {
    id: "jwt",
    name: "JWT Token",
    pattern:
      /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/,
    severity: "HIGH",
  },
  {
    id: "private-key",
    name: "Private Key",
    pattern:
      /-----BEGIN (RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/,
    severity: "HIGH",
  },
  {
    id: "generic-api-key",
    name: "Generic API Key",
    pattern:
      /\b(api[_-]?key|apikey)\s*[:=]\s*["']([^"']+)["']/i,
    severity: "HIGH",
  },
  {
    id: "generic-token",
    name: "Generic Token",
    pattern:
      /\b(access[_-]?token|auth[_-]?token)\s*[:=]\s*["']([^"']+)["']/i,
    severity: "HIGH",
  },
  {
    id: "password",
    name: "Hardcoded Password",
    pattern:
      /\b(password|passwd|pwd)\s*[:=]\s*["']([^"']+)["']/i,
    severity: "HIGH",
  },
];

const PLACEHOLDER_VALUES = new Set([
  "password",
  "password123",
  "your_password",
  "your-password",
  "yourpassword",
  "your_secret",
  "your-secret",
  "your_token",
  "your-token",
  "example",
  "test",
  "testing",
  "dummy",
  "changeme",
  "change_me",
  "secret",
  "your_api_key",
  "your-api-key",
  "xxx",
  "xxxx",
  "xxxxxxxx",
]);

const isPlaceholder = (value) => {
  if (!value) {
    return true;
  }

  const normalized = value
    .trim()
    .toLowerCase();

  if (PLACEHOLDER_VALUES.has(normalized)) {
    return true;
  }

  if (/^[x*_-]+$/.test(normalized)) {
    return true;
  }

  return false;
};

const isLikelySecret = (content) => {
  const findings = [];

  for (const rule of SECRET_PATTERNS) {
    const matches = content.match(
      new RegExp(rule.pattern.source, rule.pattern.flags + "g")
    );

    if (!matches) {
      continue;
    }

    for (const match of matches) {
      const secretValue = match[2];

      if (
        secretValue &&
        isPlaceholder(secretValue)
      ) {
        continue;
      }

      findings.push(rule);
    }
  }

  return findings;
};

const secretsRule = {
  id: "exposed-secrets",
  name: "Exposed Secrets Detection",
  category: "secrets",

  requiresContent: true,

  scan(files) {
    const findings = [];

    for (const file of files) {
      if (!file.content) {
        continue;
      }

      const matchedRules = isLikelySecret(
        file.content
      );

      for (const rule of matchedRules) {
        findings.push({
          ruleId: `${this.id}:${rule.id}`,
          category: this.category,
          issue: rule.name,
          severity: rule.severity,
          file: file.path,
        });
      }
    }

    return findings;
  },
};

module.exports = {
  secretsRule,
  isLikelySecret,
};