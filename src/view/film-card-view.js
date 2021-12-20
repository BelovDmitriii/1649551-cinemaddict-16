import { createElement } from '../render.js';

const createFilmCardTemplate = (filmsCard) => {
  const {
    filmInfo,
    comments,
    userDetails
  } = filmsCard;

  return `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${filmInfo.title}</h3>
      <p class="film-card__rating">${filmInfo.totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${filmInfo.release.date}</span>
        <span class="film-card__duration">${filmInfo.runtime}h ${filmInfo.runtime}m</span>
        <span class="film-card__genre">${filmInfo.genre}</span>
      </p>
      <img src="./images/posters/${filmInfo.poster}" alt="${filmInfo.title}" class="film-card__poster">
      <p class="film-card__description">${filmInfo.description}</p>
      <span class="film-card__comments">Comments: ${comments.comment.length}</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item ${userDetails.isWatchlist ? 'film-card__controls-item--active' : ' '} film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
      <button class="film-card__controls-item ${userDetails.isWatched ? 'film-card__controls-item--active' : ' '} film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
      <button class="film-card__controls-item ${userDetails.isFavorite ? 'film-card__controls-item--active' : ' '} film-card__controls-item--favorite" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCardView {
  #element = null;
  #filmCards = null;

  constructor (cards) {
    this.#filmCards = cards;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmCardTemplate(this.#filmCards);
  }

  removeElement() {
    this.#element = null;
  }
}
