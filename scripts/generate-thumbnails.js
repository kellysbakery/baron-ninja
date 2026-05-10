const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const thumbnailJobs = [
  {
    name: "comic",
    inputDir: "src/images/comics/full",
    outputDir: "src/images/comics/thumb",
    width: 384,
    height: 288,
    fit: "cover",
  },
  {
    name: "character",
    inputDir: "src/images/characters",
    outputDir: "src/images/characters/thumb",
    width: 320,
    height: 320,
    fit: "cover",
  },
];

async function createThumbnails(job) {
  if (!fs.existsSync(job.inputDir)) {
    console.error(`Input folder not found: ${job.inputDir}`);
    process.exit(1);
  }

  fs.mkdirSync(job.outputDir, { recursive: true });

  const files = fs
    .readdirSync(job.inputDir, { withFileTypes: true })
    .filter((item) => item.isFile() && item.name.toLowerCase().endsWith(".png"))
    .map((item) => item.name)
    .sort();

  for (const file of files) {
    const inputPath = path.join(job.inputDir, file);
    const outputFile = file.replace(/\.png$/i, ".webp");
    const outputPath = path.join(job.outputDir, outputFile);

    console.log(`Creating ${job.name} thumbnail: ${outputFile}`);

    await sharp(inputPath)
      .resize(job.width, job.height, {
        fit: job.fit,
        position: "center",
      })
      .webp({ quality: 80 })
      .toFile(outputPath);
  }

  console.log(`Done. Created ${files.length} ${job.name} thumbnails.`);
}

(async () => {
  for (const job of thumbnailJobs) {
    await createThumbnails(job);
  }
})();
