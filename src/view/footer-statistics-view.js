import { createElement } from '../render.js';

const createFooterStatisticsTemplate = () => (
  `<section class="footer__statistics">
    <p>130 291 movies inside</p>
  </section>`
);

export default class FooterStatisticView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFooterStatisticsTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
