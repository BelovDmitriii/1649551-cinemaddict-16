const filmToFilterMap = {
  watchList: (cards) => cards.filter((card) => card.isWatchlist).length,
  history: (cards) => cards.filter((card) => card.isWatched).length,
  favorites: (cards) => cards.filter((card) => card.isFavorite).length,
};

const generateFilters = (cards) => Object.entries(filmToFilterMap)
  .map(([filterName, countFilms]) => ({
    name: filterName,
    count: countFilms(cards),
  }),
  );

export { generateFilters };
