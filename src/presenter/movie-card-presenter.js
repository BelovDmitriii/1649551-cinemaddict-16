import FilmCardView from '../view/film-card-view.js';
import FilmInfoView from '../view/popup-film-info-view';
import { RenderPosition, render, remove, replace } from '../utils/render.js';

const EscapeKeyDown = {
  ESC: 'Esc',
  ESCAPE: 'Escape'
};

export default class MovieCardPresenter {
  #filmCardComponent = null;
  #filmPopupComponent = null;
  #filmsListContainer = null;
  #mainContainer = null;
  #bodyElement = null;
  #changeCardData = null;
  #handleCloseOldPopup = null;

  #filmCard = null;
  #comments = null;

  constructor(filmsListContainer, mainContainer, handleCloseOldPopup) {
    this.#filmsListContainer = filmsListContainer;
    this.#mainContainer = mainContainer;
    this.#handleCloseOldPopup = handleCloseOldPopup;
  }

  init (filmCard, comments) {
    this.#filmCard = filmCard;
    this.#comments = [...comments];

    const prevfilmCardComponent = this.#filmCardComponent;
    const prevfilmPopupComponent = this.#filmPopupComponent;

    this.#filmCardComponent = new FilmCardView(filmCard);
    this.#filmPopupComponent = new FilmInfoView(filmCard, comments);
    this.#bodyElement = document.querySelector('body');

    this.#filmCardComponent.setOpenCardClickHandler(this.#handleFilmCardClick);
    this.#filmPopupComponent.setHideCardClickHandler(this.#handleCloseButtonClick);

    if (prevfilmCardComponent === null || prevfilmPopupComponent === null) {
      render(this.#filmsListContainer, this.#filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#filmsListContainer.contains(prevfilmCardComponent.element)) {
      replace(this.#filmCardComponent, prevfilmCardComponent);
    }

    if (this.#bodyElement.contains(prevfilmPopupComponent.element)) {
      replace(this.#filmPopupComponent, prevfilmPopupComponent);
    }

    remove(prevfilmCardComponent);
    remove(prevfilmPopupComponent);

    render(this.#filmsListContainer, this.#filmCardComponent, RenderPosition.BEFOREEND);
  }

  destroy = () => {
    remove(this.#filmCardComponent);
    remove(this.#filmPopupComponent);
  }

  #closePreviousPopup = () => {
    this.#handleCloseOldPopup();
  }

  #showCardPopup = () => {
    this.#closePreviousPopup();
    this.#bodyElement.classList.add('hide-overflow');
    render(this.#mainContainer, this.#filmPopupComponent, RenderPosition.AFTEREND);
  }

  #closeCardPopup = () => {
    this.#bodyElement.classList.remove('hide-overflow');
    this.#filmPopupComponent.element.remove();
    document.removeEventListener('keydown', this.#onEscKeyDown);
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === EscapeKeyDown.ESCAPE || evt.key === EscapeKeyDown.ESC) {
      evt.preventDefault();
      this.#closeCardPopup();
    }
  }

  #handleFilmCardClick = () => {
    this.#showCardPopup();
    document.addEventListener('keydown', this.#onEscKeyDown);
  }

  #handleCloseButtonClick = () => {
    this.#closeCardPopup();
    document.removeEventListener('keydown', this.#onEscKeyDown);
  }
}
