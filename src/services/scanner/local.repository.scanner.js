const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");

const gitService = require("../git/git.service");
const repositoryScanner = require("./repository.scanner");
const { shouldScanFile } = require("../../utils/file-filter");

const MAX_FILE_SIZE = 1024 * 1024;

const createTempDirectory = () => {
  const id = crypto.randomBytes(8).toString("hex");

  const directory = path.join(
    os.tmpdir(),
    `gitlab-scanner-${id}`
  );

  fs.mkdirSync(directory, {
    recursive: true,
  });

  return directory;
};

const collectFiles = (directory, root = directory) => {
  const files = [];

  const entries = fs.readdirSync(directory, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    if (entry.name === ".git") {
      continue;
    }

    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectFiles(fullPath, root));
      continue;
    }

    const relativePath = path
      .relative(root, fullPath)
      .replace(/\\/g, "/");

    if (!shouldScanFile(relativePath)) {
      continue;
    }

    const stats = fs.statSync(fullPath);

    if (stats.size > MAX_FILE_SIZE) {
      continue;
    }

    const content = fs.readFileSync(fullPath, "utf8");

    files.push({
      path: relativePath,
      type: "blob",
      content,
    });
  }

  return files;
};

class LocalRepositoryScanner {
  async scanRepository(project) {
    const tempDirectory = createTempDirectory();

    try {
      await gitService.cloneRepository(
        project.webUrl + ".git",
        tempDirectory
      );

      const files = collectFiles(tempDirectory);

      const findings = repositoryScanner.scan(files);

      return {
        project: {
          id: project.id,
          name: project.name,
          webUrl: project.webUrl,
        },
        scannedFiles: files.length,
        findings,
        totalFindings: findings.length,
      };
    } finally {
      fs.rmSync(tempDirectory, {
        recursive: true,
        force: true,
      });
    }
  }
}

module.exports = new LocalRepositoryScanner();