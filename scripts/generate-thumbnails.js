const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const inputDir = "src/images/comics/full";
const outputDir = "src/images/comics/thumb";

const WIDTH = 384;
const HEIGHT = 288;

if (!fs.existsSync(inputDir)) {
  console.error(`Input folder not found: ${inputDir}`);
  process.exit(1);
}

fs.mkdirSync(outputDir, { recursive: true });

const files = fs
  .readdirSync(inputDir)
  .filter((file) => file.toLowerCase().endsWith(".png"))
  .sort();

(async () => {
  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputFile = file.replace(/\.png$/i, ".webp");
    const outputPath = path.join(outputDir, outputFile);

    console.log(`Creating thumbnail: ${outputFile}`);

    await sharp(inputPath)
      .resize(WIDTH, HEIGHT, {
        fit: "cover",
        position: "center",
      })
      .webp({ quality: 80 })
      .toFile(outputPath);
  }

  console.log(`Done. Created ${files.length} thumbnails.`);
})();
