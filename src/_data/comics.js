const fs = require("fs");
const path = require("path");

const comicsDir = path.join(__dirname, "..", "comics");

function getJsonFiles(dir) {
  let files = [];

  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      files = files.concat(getJsonFiles(fullPath));
    } else if (item.name.endsWith(".json")) {
      files.push(fullPath);
    }
  }

  return files;
}

module.exports = function () {
  return getJsonFiles(comicsDir)
    .map((file) => {
      const comic = JSON.parse(fs.readFileSync(file, "utf8"));
      const year = comic.date.slice(0, 4);

      return {
        ...comic,
        year,
        url: `/comics/${year}/${comic.slug}/`,
      };
    })
    .filter((comic) => comic.status === "published")
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};
