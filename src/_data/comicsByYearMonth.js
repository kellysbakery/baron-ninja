// Group comics by year, then by month
// Used to structure archive pages like:
// 2026 → May → comics

const getComics = require("./comics");

module.exports = function () {
  const comics = getComics();

  const grouped = {};

  comics.forEach((comic) => {
    const year = comic.date.slice(0, 4);
    const month = comic.date.slice(5, 7);

    if (!grouped[year]) {
      grouped[year] = {};
    }

    if (!grouped[year][month]) {
      grouped[year][month] = [];
    }

    grouped[year][month].push(comic);
  });

  // Convert to array structure for templates
  return Object.keys(grouped)
    .sort((a, b) => Number(b) - Number(a)) // newest year first
    .map((year) => ({
      year,
      months: Object.keys(grouped[year])
        .sort((a, b) => Number(b) - Number(a)) // newest month first
        .map((month) => {
          const monthNames = {
            "01": "January",
            "02": "February",
            "03": "March",
            "04": "April",
            "05": "May",
            "06": "June",
            "07": "July",
            "08": "August",
            "09": "September",
            10: "October",
            11: "November",
            12: "December",
          };

          return {
            month,
            monthName: monthNames[month],
            comics: grouped[year][month].sort(
              (a, b) => new Date(b.date) - new Date(a.date),
            ),
          };
        }),
    }));
};
