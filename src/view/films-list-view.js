import { createElement } from '../render.js';

const createFilmListTemplate = (films = []) => (
  `<section class="films-list">
    <h2 class="films-list__title">
    ${films.length > 0 ? ' ': 'There are no movies in our database'}
    </h2>
  </section>`
);

export default class FilmListView {
  #element = null;
  #films = null;

  constructor(films) {
    this.#films = films;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmListTemplate(this.#films);
  }

  removeElement() {
    this.#element = null;
  }
}
