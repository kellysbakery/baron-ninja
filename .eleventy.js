const fs = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");

  eleventyConfig.addFilter("formatDate", function (dateString) {
    if (!dateString) {
      return "";
    }

    const [year, month, day] = dateString.split("-");
    return `${month}-${day}-${year}`;
  });

  eleventyConfig.addFilter("json", function (value) {
    return JSON.stringify(value).replace(/</g, "\\u003c");
  });

  eleventyConfig.addFilter("assetExists", function (assetPath) {
    if (!assetPath || typeof assetPath !== "string") {
      return false;
    }

    const normalizedPath = assetPath.replace(/^\/+/, "");
    const fullPath = path.join(__dirname, "src", normalizedPath);
    const inputDir = path.join(__dirname, "src");

    return fullPath.startsWith(inputDir) && fs.existsSync(fullPath);
  });

  eleventyConfig.addFilter("includesAny", function (values, candidates) {
    if (!Array.isArray(values) || !Array.isArray(candidates)) {
      return false;
    }

    return candidates.some((candidate) => values.includes(candidate));
  });

  return {
    dir: {
      input: "src",
      output: "_site",
    },
  };
};
