import {createElement} from '../render.js';

const TitleNames = {
  ALL: 'There are no movies in our database',
  WATCHLIST: 'There are no movies to watch now',
  HISTORY: 'There are no watched movies now',
  FAVORITES: 'There are no favorite movies now'
};

const findActiveTitleName = (activeFilterElement) => {
  const elementIndex = activeFilterElement.textContent.indexOf(' ');
  const activeFilterName = activeFilterElement.textContent.slice(0,elementIndex);
  return activeFilterName;
};

const createTitleName = (activeFilterElement)=> TitleNames[findActiveTitleName(activeFilterElement).toUpperCase()];

const createEmptyFilmListTemplate = (activeFilterElement) => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">${createTitleName(activeFilterElement)}</h2>
    </section>
  </section>`
);

export default class EmptyFilmList {
  #element = null;
  #filterElement = null;

  constructor(filterElement) {
    this.#filterElement = filterElement;
  }

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return createEmptyFilmListTemplate(this.#filterElement);
  }

  removeElement(){
    this.#element = null;
  }
}