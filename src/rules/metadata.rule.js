const REQUIRED_FILES = {
  README: "README.md",
  LICENSE: "LICENSE",
};

const metadataRule = {
  id: "missing-metadata",
  name: "Missing Repository Metadata",
  category: "metadata",

  scan(files) {
    const filePaths = new Set(
      files.map((file) => file.path.toLowerCase())
    );

    const findings = [];

    if (!filePaths.has(REQUIRED_FILES.README.toLowerCase())) {
      findings.push({
        ruleId: this.id,
        category: this.category,
        issue: "Missing README.md",
        severity: "LOW",
        file: null,
      });
    }

    if (!filePaths.has(REQUIRED_FILES.LICENSE.toLowerCase())) {
      findings.push({
        ruleId: this.id,
        category: this.category,
        issue: "Missing LICENSE",
        severity: "LOW",
        file: null,
      });
    }

    return findings;
  },
};

module.exports = {
  metadataRule,
};