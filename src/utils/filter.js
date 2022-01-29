import { FilterType } from './const';

export const filter = {
  [FilterType.ALL]: (films) => films.filter((filmsCard) => filmsCard),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.userDetails.isWatchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.userDetails.isWatched),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.userDetails.isFavorite)
};
