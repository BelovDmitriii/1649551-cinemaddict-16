import AbstractView from './abstract-view.js';

const createFilmCountTemplate = (cards) => {
  const filmCount = cards.length;
  return `<p>${filmCount} movies inside</p>`;
};

export default class FooterStatisticView extends AbstractView {
  #card = null;

  constructor(card) {
    super();
    this.#card = card;
  }

  get template() {
    return createFilmCountTemplate(this.#card);
  }
}
