const { rules } = require("../../rules");

class RepositoryScanner {
  scan(files) {
    const findings = [];

    for (const rule of rules) {
      const ruleFindings = rule.scan(files);

      findings.push(...ruleFindings);
    }

    return findings;
  }
}

module.exports = new RepositoryScanner();