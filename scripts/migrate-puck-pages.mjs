import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  unlinkSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";

const applyMode = process.argv.includes("--apply");
const root = process.cwd();
const contentDir = join(root, "content");
const pagesDir = join(contentDir, "pages");
const ignoredTopLevelDirs = new Set(["blog", "layout", "pages"]);

function parseJson(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function isPuckPage(value) {
  if (!value || typeof value !== "object") {
    return false;
  }

  const hasRoot = !!value.root && typeof value.root === "object";
  const hasContent = Array.isArray(value.content);
  return hasRoot || hasContent;
}

function walkJsonFiles(dirPath) {
  if (!existsSync(dirPath)) {
    return [];
  }

  const entries = readdirSync(dirPath);
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dirPath, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      if (dirPath === contentDir && ignoredTopLevelDirs.has(entry)) {
        continue;
      }
      files.push(...walkJsonFiles(fullPath));
      continue;
    }

    if (entry.endsWith(".json")) {
      files.push(fullPath);
    }
  }

  return files;
}

function relativeSlugFromFile(filePath) {
  return relative(contentDir, filePath)
    .replace(/\\/g, "/")
    .replace(/\.json$/, "")
    .replace(/^\/+/, "");
}

function toTargetFilePath(filePath) {
  const slug = relativeSlugFromFile(filePath);
  return join(pagesDir, `${slug}.json`);
}

function removeEmptyDirsUpward(startDir, stopDir) {
  let current = startDir;

  while (current.startsWith(stopDir) && current !== stopDir) {
    const entries = readdirSync(current);
    if (entries.length > 0) {
      break;
    }

    rmSync(current, { recursive: false, force: true });
    current = dirname(current);
  }
}

function main() {
  const legacyCandidates = walkJsonFiles(contentDir);
  const puckFiles = legacyCandidates.filter((filePath) => {
    const parsed = parseJson(readFileSync(filePath, "utf-8"));
    return isPuckPage(parsed);
  });

  if (puckFiles.length === 0) {
    console.log("No legacy Puck page files found to migrate.");
    return;
  }

  console.log(`Found ${puckFiles.length} Puck page files.`);

  for (const filePath of puckFiles) {
    const targetPath = toTargetFilePath(filePath);
    const slug = relativeSlugFromFile(filePath);

    console.log(`- ${slug} -> ${relative(root, targetPath)}`);

    if (!applyMode) {
      continue;
    }

    mkdirSync(dirname(targetPath), { recursive: true });

    if (!existsSync(targetPath)) {
      copyFileSync(filePath, targetPath);
    }

    unlinkSync(filePath);
    removeEmptyDirsUpward(dirname(filePath), contentDir);
  }

  if (!applyMode) {
    console.log("Dry run only. Re-run with --apply to perform migration.");
  } else {
    console.log("Migration complete.");
  }
}

main();
