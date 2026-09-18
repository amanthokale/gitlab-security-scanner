const { execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);

class GitService {
  async cloneRepository(repositoryUrl, targetDirectory) {
    await execFileAsync("git", [
      "clone",
      "--depth",
      "1",
      "--single-branch",
      repositoryUrl,
      targetDirectory,
    ]);
  }

  async removeRepository(targetDirectory) {
    await execFileAsync("git", [
      "-c",
      "core.longpaths=true",
      "clean",
      "-fdx",
    ], {
      cwd: targetDirectory,
    }).catch(() => {});

    // Windows-safe deletion will be handled by the scanner.
  }
}

module.exports = new GitService();