import AbstractView from './abstract-view.js';

const createFilmCardTemplate = (filmsCard) => {
  const {
    filmInfo,
    comments,
    userDetails
  } = filmsCard;

  const description = filmInfo.description.length > 140 ? filmInfo.description.slice(0, 139).concat('...') : filmInfo.description;

  return `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${filmInfo.title}</h3>
      <p class="film-card__rating">${filmInfo.totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${filmInfo.release.date}</span>
        <span class="film-card__duration">${filmInfo.runtime.hours}h ${filmInfo.runtime.minutes}m</span>
        <span class="film-card__genre">${filmInfo.genre}</span>
      </p>
      <img src="./images/posters/${filmInfo.poster}" alt="${filmInfo.title}" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <span class="film-card__comments">Comments: ${comments.length}</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item ${userDetails.isWatchlist ? 'film-card__controls-item--active' : ' '} film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
      <button class="film-card__controls-item ${userDetails.isWatched ? 'film-card__controls-item--active' : ' '} film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
      <button class="film-card__controls-item ${userDetails.isFavorite ? 'film-card__controls-item--active' : ' '} film-card__controls-item--favorite" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCardView extends AbstractView {
  #filmCards = null;

  constructor (cards) {
    super();
    this.#filmCards = cards;
  }

  get template() {
    return createFilmCardTemplate(this.#filmCards);
  }

  setOpenCardClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#clickHandler);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedClickHandler);
  }

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHandler);
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  }

}
