import { createElement } from '../render.js';

const createFilmInfoTemplate = (filmCard) => {
  const {
    filmInfo,
    comments,
    userDetails
  } = filmCard;

  return `<section class="film-details">
          <form class="film-details__inner" action="" method="get">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./images/posters/${filmInfo.poster}" alt="${filmInfo.title}">

              <p class="film-details__age">${filmInfo.ageRating}</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${filmInfo.title}</h3>
                  <p class="film-details__title-original">Original: ${filmInfo.title}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${filmInfo.totalRating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${filmInfo.director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${filmInfo.writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${filmInfo.actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${filmInfo.release.date}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${filmInfo.runtime}h ${filmInfo.runtime}m</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${filmInfo.release.releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genres</td>
                  <td class="film-details__cell">
                    <span class="film-details__genre">${filmInfo.genre}</span>
                </tr>
              </table>

              <p class="film-details__film-description">
                ${filmInfo.description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <button type="button" class="film-details__control-button ${userDetails.isWatchlist ? 'film-details__control-button--active' : ''} film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
            <button type="button" class="film-details__control-button ${userDetails.isWatched ? 'film-details__control-button--active' : ''} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
            <button type="button" class="film-details__control-button ${userDetails.isFavorite ? 'film-details__control-button--active' : ''} film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
          </section>

          <div class="film-details__bottom-container">
            <section class="film-details__comments-wrap">
              <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

              <ul class="film-details__comments-list"></ul>

              <div class="film-details__new-comment">
                <div class="film-details__add-emoji-label">
                  <img src="images/emoji/${comments.emotion}.png" width="55" height="55" alt="emoji-${comments.emotion}">
                </div>

                <label class="film-details__comment-label">
                  <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${comments.comment}</textarea>
                </label>
                </div>
              </div>
            </section>
          </div>
        </form>
      </section>`;
};

export default class FilmInfoView {
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
    return createFilmInfoTemplate(this.#films);
  }

  removeElement() {
    this.#element = null;
  }
}
