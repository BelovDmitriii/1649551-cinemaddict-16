import FilmCardView from '../view/film-card-view.js';
import FilmInfoView from '../view/popup-film-info-view';
import { RenderPosition, render, remove, replace } from '../utils/render.js';

const EscapeKeyDown = {
  ESC: 'Esc',
  ESCAPE: 'Escape'
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class MovieCardPresenter {
  #filmCardComponent = null;
  #filmPopupComponent = null;
  #filmsListContainer = null;
  #mainContainer = null;
  #bodyElement = null;
  #changeCardData = null;
  #handleCloseOldPopup = null;
  #changeMode = null;

  #filmCard = null;
  #comments = null;
  #mode = Mode.DEFAULT;

  constructor(filmsListContainer, mainContainer, changeCardData, changeMode) {
    this.#filmsListContainer = filmsListContainer;
    this.#mainContainer = mainContainer;
    this.#changeCardData = changeCardData;
    this.#changeMode = changeMode;
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

    this.#filmCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmCardComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmCardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);

    this.#filmPopupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmPopupComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmPopupComponent.setWatchlistClickHandler(this.#handleWatchlistClick);

    if (prevfilmCardComponent === null || prevfilmPopupComponent === null) {
      render(this.#filmsListContainer, this.#filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#mode === Mode.DEFAULT){
      replace(this.#filmCardComponent, prevfilmCardComponent);
    }

    if (this.#mode === Mode.EDITING){
      replace(this.#filmCardComponent, prevfilmCardComponent);
      replace(this.#filmPopupComponent, prevfilmPopupComponent);
    }

    remove(prevfilmCardComponent);
    remove(prevfilmPopupComponent);
  }

  destroy = () => {
    remove(this.#filmCardComponent);
    remove(this.#filmPopupComponent);
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#closeCardPopup();
    }
  }

  #showCardPopup = () => {
    this.#bodyElement.classList.add('hide-overflow');
    render(this.#mainContainer, this.#filmPopupComponent, RenderPosition.BEFOREEND);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  }

  #closeCardPopup = () => {
    this.#bodyElement.classList.remove('hide-overflow');
    this.#filmPopupComponent.element.remove();
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#mode = Mode.DEFAULT;
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

  #handleFavoriteClick = () => {
    this.#changeCardData({...this.#filmCard, userDetails: {...this.#filmCard.userDetails, isFavorite: !this.#filmCard.userDetails.isFavorite}});
  }

  #handleWatchedClick = () => {
    this.#changeCardData({...this.#filmCard, userDetails: {...this.#filmCard.userDetails, isWatched: !this.#filmCard.userDetails.isWatched}});
  }

  #handleWatchlistClick = () => {
    this.#changeCardData({...this.#filmCard, userDetails: {...this.#filmCard.userDetails, isWatchlist: !this.#filmCard.userDetails.isWatchlist}});
  }
}
