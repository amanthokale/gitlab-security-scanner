const pLimit = require("p-limit");

const gitlabService = require("../gitlab/gitlab.service");
const repositoryScanner = require("./repository.scanner");

const MAX_CONCURRENT_REQUESTS = 5;
const MAX_FILE_SIZE = 1024 * 1024; // 1 MB

const IGNORED_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".ico",
  ".bmp",
  ".svg",

  ".mp3",
  ".mp4",
  ".avi",
  ".mov",

  ".zip",
  ".tar",
  ".gz",
  ".rar",
  ".7z",

  ".pdf",

  ".woff",
  ".woff2",
  ".ttf",
  ".eot",

  ".exe",
  ".dll",
  ".so",
  ".dylib",
]);

const shouldScanFile = (file) => {
  const extension = file.path
    .substring(file.path.lastIndexOf("."))
    .toLowerCase();

  return !IGNORED_EXTENSIONS.has(extension);
};

class ScannerService {
  async scanRepository(project) {
    const files = await gitlabService.getRepositoryTree(
      project.id,
      project.defaultBranch
    );

    const repositoryFiles = files
      .filter((file) => file.type === "blob")
      .filter(shouldScanFile);

    const limit = pLimit(MAX_CONCURRENT_REQUESTS);

    const fileTasks = repositoryFiles.map((file) =>
      limit(async () => {
        try {
          const content = await gitlabService.getFileContent(
            project.id,
            file.path,
            project.defaultBranch
          );

          if (Buffer.byteLength(content, "utf8") > MAX_FILE_SIZE) {
            return null;
          }

          return {
            path: file.path,
            type: file.type,
            content,
          };
        } catch (error) {
          console.error(
            `Failed to read file: ${file.path}`,
            error.message
          );

          return null;
        }
      })
    );

    const results = await Promise.all(fileTasks);

    const filesWithContent = results.filter(Boolean);

    const findings = repositoryScanner.scan(
      filesWithContent
    );

    return {
      project: {
        id: project.id,
        name: project.name,
        webUrl: project.webUrl,
      },

      scannedFiles: filesWithContent.length,

      findings,

      totalFindings: findings.length,
    };
  }
}

module.exports = new ScannerService();