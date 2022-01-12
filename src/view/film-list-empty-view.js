import AbstractView from './abstract-view.js';

const TitleNames = {
  ALL: 'There are no movies in our database',
  WATCHLIST: 'There are no movies to watch now',
  HISTORY: 'There are no watched movies now',
  FAVORITES: 'There are no favorite movies now'
};

export const findActiveTitleName = (activeFilterElement) => {
  const elementIndex = activeFilterElement.textContent.indexOf(' ');
  const activeFilterName = activeFilterElement.textContent.slice(0,elementIndex);
  return activeFilterName;
};

const createTitleName = (activeFilterElement) => TitleNames(findActiveTitleName(activeFilterElement).toUpperCase());

const createEmptyFilmListTemplate = (activeFilterElement) => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">${createTitleName(activeFilterElement)}</h2>
    </section>
  </section>`
);

export default class EmptyFilmList extends AbstractView {
  #filterElement = null;

  constructor(filterElement) {
    super();
    this.#filterElement = filterElement;
  }

  get template() {
    return createEmptyFilmListTemplate(this.#filterElement);
  }
}
