export const EvtKey = {
  ESCAPE: 'Escape',
  ESC: 'Esc',
  ENTER: 'Enter'
};

export const EMOJIS = ['smile', 'sleeping', 'puke', 'angry'];

export const Mode = {
  CARD: 'CARD',
  POPUP: 'POPUP'
};

export const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating'
};

export const FilterType = {
  ALL: 'All movies',
  WATCHLIST: 'Watchlist',
  FAVORITES: 'Favorites',
  HISTORY: 'History'
};

export const userRank = {
  None: {
    MIN: 0,
    MAX: 0,
  },
  Novice: {
    MIN: 1,
    MAX: 10,
  },
  Fan: {
    MIN: 11,
    MAX: 20,
  },
  'Movie Buff': {
    MIN: 21,
    MAX: Infinity,
  },
};
