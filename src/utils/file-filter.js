const IGNORED_EXTENSIONS = new Set([
  // Images
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".ico",
  ".bmp",
  ".svg",

  // Videos / audio
  ".mp3",
  ".mp4",
  ".avi",
  ".mov",
  ".wav",
  ".mkv",

  // Archives
  ".zip",
  ".tar",
  ".gz",
  ".rar",
  ".7z",

  // Documents
  ".pdf",

  // Fonts
  ".woff",
  ".woff2",
  ".ttf",
  ".eot",
  ".otf",

  // Binaries
  ".exe",
  ".dll",
  ".so",
  ".dylib",
]);

const IGNORED_DIRECTORIES = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  "coverage",
]);

const shouldScanFile = (filePath) => {
  const parts = filePath.split("/");

  // Skip ignored directories
  const hasIgnoredDirectory = parts.some((part) =>
    IGNORED_DIRECTORIES.has(part)
  );

  if (hasIgnoredDirectory) {
    return false;
  }

  // Files without extensions are still scanned
  const lastDot = filePath.lastIndexOf(".");

  if (lastDot === -1) {
    return true;
  }

  const extension = filePath
    .substring(lastDot)
    .toLowerCase();

  return !IGNORED_EXTENSIONS.has(extension);
};

module.exports = {
  shouldScanFile,
};