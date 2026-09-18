const SENSITIVE_FILE_PATTERNS = [
  /^\.env$/,
  /^\.env\..+$/,
  /\.pem$/i,
  /^id_rsa$/,
  /^id_dsa$/,
  /^id_ecdsa$/,
  /^id_ed25519$/,
  /^config\.json$/i,
  /^secrets?\.ya?ml$/i,
];

const getFileName = (path) => {
  return path.split("/").pop();
};

const isSensitiveFile = (filePath) => {
  const fileName = getFileName(filePath);

  return SENSITIVE_FILE_PATTERNS.some((pattern) =>
    pattern.test(fileName)
  );
};

const sensitiveFilesRule = {
  id: "sensitive-files",
  name: "Sensitive Files Detection",
  category: "sensitive_files",

  scan(files) {
    const findings = [];

    for (const file of files) {
      if (!isSensitiveFile(file.path)) {
        continue;
      }

      findings.push({
        ruleId: this.id,
        category: this.category,
        issue: "Sensitive file committed to repository",
        severity: "HIGH",
        file: file.path,
      });
    }

    return findings;
  },
};

module.exports = {
  sensitiveFilesRule,
  isSensitiveFile,
};