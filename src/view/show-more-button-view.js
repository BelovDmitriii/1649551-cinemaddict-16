import AbstractView from './abstract-view.js';

const createShowMoreButtonTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class ShowMoreButtonView extends AbstractView {
  get template() {
    return createShowMoreButtonTemplate();
  }

  setShowMoreButtonClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.addEventListener('click', this.#clickHandler);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  }
}
