module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");

  eleventyConfig.addFilter("formatDate", function (dateString) {
    if (!dateString) {
      return "";
    }

    const [year, month, day] = dateString.split("-");
    return `${month}-${day}-${year}`;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
    },
  };
}; 
