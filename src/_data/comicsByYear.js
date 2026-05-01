// Import the existing comics data loader.
// This is the same source used for the global `comics` data.
const getComics = require("./comics");

module.exports = function () {
  // Get the full list of comics.
  const comics = getComics();

  // Group comics by year.
  // Example:
  // {
  //   "2026": [comic1, comic2],
  //   "2025": [comic3, comic4]
  // }
  const grouped = {};

  comics.forEach((comic) => {
    // Extract year from ISO date string: YYYY-MM-DD
    const year = comic.date.slice(0, 4);

    // Create the year bucket if needed.
    if (!grouped[year]) {
      grouped[year] = [];
    }

    // Add this comic to its year bucket.
    grouped[year].push(comic);
  });

  // Convert grouped object into an array sorted newest year first.
  const years = Object.keys(grouped)
    .sort((a, b) => Number(b) - Number(a))
    .map((year) => ({
      year,

      // Sort comics inside each year newest first.
      comics: grouped[year].sort((a, b) => new Date(b.date) - new Date(a.date)),
    }));

  // Add previous/next year navigation helpers.
  // Because years are sorted newest → oldest:
  // - previousYear means newer year
  // - nextYear means older year
  return years.map((yearGroup, index) => ({
    ...yearGroup,
    previousYear: years[index - 1]?.year,
    nextYear: years[index + 1]?.year,
  }));
};
