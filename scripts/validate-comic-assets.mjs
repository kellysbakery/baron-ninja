import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const COMICS_DIR = path.join(ROOT, "src", "comics");
const SRC_DIR = path.join(ROOT, "src");

let errors = 0;

function fail(message) {
  console.error(`❌ ${message}`);
  errors++;
}

function walk(dir) {
  const results = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results.push(...walk(fullPath));
    } else {
      results.push(fullPath);
    }
  }

  return results;
}

/**
 * Verifies every path segment using exact case.
 *
 * This is deliberately stricter than fs.existsSync(), because existsSync()
 * may succeed on a case-insensitive Mac filesystem even when capitalization
 * is wrong for production.
 */
function exactCaseExists(filePath) {
  const absolutePath = path.resolve(filePath);
  const parsed = path.parse(absolutePath);

  const relativeParts = absolutePath
    .slice(parsed.root.length)
    .split(path.sep)
    .filter(Boolean);

  let current = parsed.root;

  for (const part of relativeParts) {
    if (!fs.existsSync(current)) {
      return false;
    }

    const entries = fs.readdirSync(current);

    if (!entries.includes(part)) {
      return false;
    }

    current = path.join(current, part);
  }

  return true;
}

function webPathToSourcePath(webPath) {
  return path.join(
    SRC_DIR,
    webPath.replace(/^\/+/, "")
  );
}

const jsonFiles = walk(COMICS_DIR)
  .filter(file => file.endsWith(".json"));

for (const jsonFile of jsonFiles) {
  const relativeJson = path.relative(ROOT, jsonFile);

  let comic;

  try {
    comic = JSON.parse(fs.readFileSync(jsonFile, "utf8"));
  } catch (error) {
    fail(`${relativeJson}: invalid JSON: ${error.message}`);
    continue;
  }

  if (!comic.image) {
    fail(`${relativeJson}: missing "image" property`);
    continue;
  }

  // Validate full image exactly as referenced by JSON.
  const fullImagePath = webPathToSourcePath(comic.image);

  if (!exactCaseExists(fullImagePath)) {
    fail(
      `${relativeJson}: full image missing or wrong case:\n` +
      `   ${comic.image}`
    );
  }

  // Enforce lowercase comic image filename.
  const fullBasename = path.basename(fullImagePath);

  if (fullBasename !== fullBasename.toLowerCase()) {
    fail(
      `${relativeJson}: full image filename must be lowercase:\n` +
      `   ${fullBasename}`
    );
  }

  // Derive expected thumbnail from full image basename.
  const parsedImage = path.parse(fullImagePath);

  const expectedThumbName =
    `${parsedImage.name.toLowerCase()}.webp`;

  const expectedThumbPath = path.join(
    SRC_DIR,
    "images",
    "comics",
    "thumb",
    expectedThumbName
  );

  if (!exactCaseExists(expectedThumbPath)) {
    fail(
      `${relativeJson}: thumbnail missing or wrong case:\n` +
      `   expected src/images/comics/thumb/${expectedThumbName}`
    );
  }
}

// Reject forgotten temporary assets.
const imageDir = path.join(SRC_DIR, "images", "comics");

for (const file of walk(imageDir)) {
  const basename = path.basename(file);

  if (/temp/i.test(basename)) {
    fail(
      `Temporary comic asset found:\n` +
      `   ${path.relative(ROOT, file)}`
    );
  }
}

if (errors > 0) {
  console.error(`\n🚨 Comic asset validation failed with ${errors} error(s).`);
  process.exit(1);
}

console.log(
  `✅ Comic asset validation passed for ${jsonFiles.length} comic JSON files.`
);
