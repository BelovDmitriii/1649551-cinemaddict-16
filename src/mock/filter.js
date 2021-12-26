const filmToFilterMap = {
  watchList: (cards) => cards.filter((card) => card.userDetails.isWatchlist).length,
  history: (cards) => cards.filter((card) => card.userDetails.isWatched).length,
  favorites: (cards) => cards.filter((card) => card.userDetails.isFavorite).length,
};

const generateFilters = (cards) => Object.entries(filmToFilterMap)
  .map(([filterName, countFilms]) => ({
    name: filterName,
    count: countFilms(cards),
  }),
  );

export { generateFilters };
