import FilmCardView from '../view/film-card-view.js';
import FilmInfoView from '../view/popup-film-info-view';
import { RenderPosition, render, remove, replace } from '../utils/render.js';
import { EvtKey } from '../utils/const.js';

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
  #changeMode = null;

  #filmCard = null;
  #mode = Mode.DEFAULT;

  constructor(filmsListContainer, mainContainer, changeCardData, changeMode) {
    this.#filmsListContainer = filmsListContainer;
    this.#mainContainer = mainContainer;
    this.#changeCardData = changeCardData;
    this.#changeMode = changeMode;
  }

  init (filmCard) {
    this.#filmCard = filmCard;

    const prevfilmCardComponent = this.#filmCardComponent;
    const prevfilmPopupComponent = this.#filmPopupComponent;

    this.#filmCardComponent = new FilmCardView(filmCard);
    this.#filmPopupComponent = new FilmInfoView(filmCard);
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
      const scrollPosition = prevfilmPopupComponent.element.scrollTop;
      replace(this.#filmCardComponent, prevfilmCardComponent);
      replace(this.#filmPopupComponent, prevfilmPopupComponent);
      this.#filmPopupComponent.element.scrollTop = scrollPosition;
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
      this.#filmPopupComponent.reset(this.#filmCard);
      this.#closeCardPopup();
    }
  }

  #showCardPopup = () => {
    render(this.#mainContainer, this.#filmPopupComponent, RenderPosition.BEFOREEND);
    this.#bodyElement.classList.add('hide-overflow');
    this.#changeMode();
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#mode = Mode.EDITING;
  }

  #closeCardPopup = () => {
    this.#bodyElement.classList.remove('hide-overflow');
    this.#filmPopupComponent.element.remove();
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#mode = Mode.DEFAULT;
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === EvtKey.ESCAPE || evt.key === EvtKey.ESC) {
      evt.preventDefault();
      this.#filmPopupComponent.reset(this.#filmCard);
      this.#closeCardPopup();
    }
  }

  #handleFilmCardClick = () => {
    if (!document.body.contains(this.#filmPopupComponent.element)) {
      this.#closeCardPopup();
      this.#showCardPopup();
    }
  }

  #handleCloseButtonClick = () => {
    this.#closeCardPopup();
    document.removeEventListener('keydown', this.#onEscKeyDown);
  }

  #handleFavoriteClick = () => {
    this.#changeCardData(Object.assign(
      {},
      this.#filmCard,
      {
        userDetails: {
          isWatchlist: this.#filmCard.userDetails.isWatchlist,
          isWatched: this.#filmCard.userDetails.isWatched,
          watchingDate: this.#filmCard.userDetails.watchingDate,
          isFavorite: !this.#filmCard.userDetails.isFavorite
        }
      }
    ));
  }

  #handleWatchedClick = () => {
    this.#changeCardData(Object.assign(
      {},
      this.#filmCard,
      {
        userDetails: {
          isWatchlist: this.#filmCard.userDetails.isWatchlist,
          isWatched: !this.#filmCard.userDetails.isWatched,
          watchingDate: this.#filmCard.userDetails.watchingDate,
          isFavorite: this.#filmCard.userDetails.isFavorite,
        }
      }
    ));
  }

  #handleWatchlistClick = () => {
    this.#changeCardData(Object.assign(
      {},
      this.#filmCard,
      {
        userDetails: {
          isWatchlist: !this.#filmCard.userDetails.isWatchlist,
          isWatched: this.#filmCard.userDetails.isWatched,
          watchingDate: this.#filmCard.userDetails.watchingDate,
          isFavorite: this.#filmCard.userDetails.isFavorite,
        }
      }
    ));
  }

}
