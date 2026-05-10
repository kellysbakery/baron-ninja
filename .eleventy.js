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

  return {
    dir: {
      input: "src",
      output: "_site",
    },
  };
};
