const Table = require("cli-table3");
const chalk = require("chalk");

const printReport = (report) => {
  console.log("\n" + chalk.bold("GitLab Security Scan Report"));
  console.log("=".repeat(80));

  console.log(`Projects Scanned : ${report.summary.scannedProjects}`);
  console.log(`Total Findings   : ${report.summary.totalFindings}`);
  console.log(`High             : ${report.summary.severity.HIGH}`);
  console.log(`Medium           : ${report.summary.severity.MEDIUM}`);
  console.log(`Low              : ${report.summary.severity.LOW}`);

  if (!report.findings.length) {
    console.log("\nNo security findings detected.");
    return;
  }

  const table = new Table({
    head: [
      "Project",
      "Issue",
      "Severity",
      "File",
    ],
    colWidths: [25, 35, 12, 45],
    wordWrap: true,
  });

  for (const finding of report.findings) {
    let severity = finding.severity;

    if (severity === "HIGH") {
      severity = chalk.red.bold(severity);
    } else if (severity === "MEDIUM") {
      severity = chalk.yellow.bold(severity);
    } else {
      severity = chalk.blue(severity);
    }

    table.push([
      finding.project,
      finding.issue,
      severity,
      finding.file || "-",
    ]);
  }

  console.log("\n" + table.toString());
};

module.exports = { printReport };