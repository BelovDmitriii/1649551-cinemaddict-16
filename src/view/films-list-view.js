import { createElement } from '../render.js';

const createFilmListTemplate = () => (
  `<section class="films-list">
    <h2 class="films-list__title">There are no movies in our database</h2>
  </section>`
);

export default class FilmListView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmListTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
