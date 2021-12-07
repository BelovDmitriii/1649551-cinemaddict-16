const filterName = {
  watchList: {
    hrefName: '#watchlist',
    displayName: 'Watchlist'
  },
  history: {
    hrefName: '#history',
    displayName: 'History'
  },
  favorites: {
    hrefName: '#favorites',
    displayName: 'Favorites'
  }
};

const createFilterItemTemplate = ({ name, count }) => {
  const { hrefName, displayName } = filterName[name];

  return `<a href=${hrefName}
       class="main-navigation__item">${displayName}
       <span class="main-navigation__item-count">${count}</span>
    </a>`;
};

const createAllMoviesTemplate = () =>
  '<a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>';

export const createFilterTemplate = (filters) => {

  const filterItemsTemplate = filters
    .map((filter) => createFilterItemTemplate(filter))
    .join('');

  return `<div class="main-navigation__items">
      ${createAllMoviesTemplate()}
      ${filterItemsTemplate}
    </div>`;
};
