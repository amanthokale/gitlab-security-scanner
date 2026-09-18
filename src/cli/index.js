const { Command } = require("commander");
const scannerService = require("../services/scanner/scanner.service");
const gitlabService = require("../services/gitlab/gitlab.service");
const { buildReport } = require("../utils/report");
const { printReport } = require("./report.cli");

const program = new Command();

program
  .name("gitlab-scanner")
  .description("GitLab public repository security scanner")
  .version("1.0.0");

program
  .command("scan")
  .description("Scan all public repositories for a GitLab user")
  .requiredOption("-u, --username <username>", "GitLab username")
  .action(async ({ username }) => {
    try {
      console.log(`Scanning GitLab user: ${username}\n`);

      const user = await gitlabService.findUser(username);

      if (!user) {
        console.error(`GitLab user '${username}' not found.`);
        process.exitCode = 1;
        return;
      }

      const projects = await gitlabService.getUserProjects(user.id);

      const results = [];

      for (const project of projects) {
        try {
          console.log(`Scanning: ${project.name}`);

          const result = await scannerService.scanRepository({
            id: project.id,
            name: project.name,
            webUrl: project.web_url,
            defaultBranch: project.default_branch,
          });

          results.push(result);
        } catch (error) {
          results.push({
            project: {
              id: project.id,
              name: project.name,
              webUrl: project.web_url,
            },
            error: {
              message: error.message,
            },
            findings: [],
          });
        }
      }

      const report = buildReport(results);

      printReport(report);
    } catch (error) {
      console.error("Scan failed:", error.message);
      process.exitCode = 1;
    }
  });

program.parseAsync(process.argv);