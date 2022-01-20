import { createCommentDetails } from './comment-details-view.js';
import SmartView from './smart-view.js';
import { EvtKey, EMOJIS } from '../utils/const.js';
import { getPopupFilmReleaseDateFormat, getFilmDurationFormat } from '../utils/date.js';

const createFilmInfoTemplate = (filmCard) => {
  const {
    filmInfo,
    comments,
    userDetails,
    isEmoji,
    isComment,
    isEmojiChecked
  } = filmCard;

  const genresName = filmInfo.genre.length > 1 ? 'Genres' : 'Genre';
  const createGenreTemplate = (genre) => `<span class="film-details__genre">${genre}</span>`;
  const getGenres = (genresList) => genresList.map(createGenreTemplate).join('');
  const displayComments = comments.map((comment) => createCommentDetails(comment)).join('');

  const createEmojiTemplate = (emoji) => `<input class="film-details__emoji-item visually-hidden"
  name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${isEmojiChecked === `emoji-${emoji}` ? 'checked' : ''}>
<label class="film-details__emoji-label" for="emoji-${emoji}">
  <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
</label>`;

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
                  <p class="film-details__title-original">Original: ${filmInfo.alternativeTitle}</p>
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
                  <td class="film-details__cell">${filmInfo.writers.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${filmInfo.actors.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${getPopupFilmReleaseDateFormat(filmInfo.release.date)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell"> ${getFilmDurationFormat(filmInfo.runtime)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${filmInfo.release.releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${genresName}</td>
                  <td class="film-details__cell">
                    <span class="film-details__genre">${getGenres(filmInfo.genre)}</span>
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
              <ul class="film-details__comments-list">
                ${displayComments}
              </ul>

              <div class="film-details__new-comment">
                <div class="film-details__add-emoji-label">${isEmoji}
                </div>

                <label class="film-details__comment-label">
                  <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${isComment}</textarea>
                </label>

                <div class="film-details__emoji-list">
                ${EMOJIS.map((emoji) => createEmojiTemplate(emoji)).join('')}
                </div>
              </div>
            </section>
          </div>
        </form>
      </section>`;
};

export default class FilmInfoView extends SmartView {
  #films = null;
  #emoji = null;
  #comments = null;

  constructor(films) {
    super();
    this._data = FilmInfoView.parseFilmToData(films);

    this.setFormSubmitHandler(this.#commentSubmit);

    this.#setInnerHandlers();
  }

  get template() {
    return createFilmInfoTemplate(this._data);
  }


  #commentSubmit = () => {
    this.#comments.disabled = true;
  }

  reset = (film) => {
    this.updateData(FilmInfoView.parseFilmToData(film));
  };

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setHideCardClickHandler(this._callback.editClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setFormSubmitHandler(this._callback.formSubmit);
  };

  #onEnterKeyDown = (evt) => {
    if (evt.key === EvtKey.ENTER && (evt.metaKey || evt.ctrlKey)) {
      evt.preventDefault();
      this._callback.formSubmit(FilmInfoView.parseDataToFilm(this._data));
    }
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.#comments = this.element.querySelector('.film-details__comment-input');
    this.#comments.addEventListener('keydown', this.#onEnterKeyDown);
  }

  #setInnerHandlers = () => {
    const emojis = this.element.querySelectorAll('.film-details__emoji-list input[name="comment-emoji"]');
    emojis.forEach((emoji) => emoji.addEventListener('click', this.#emojiClickHandler));
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentInputHandler);
  };

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this.updateData(
      {
        isComment: evt.target.value,
      },
      true
    );
  };

  setNewCommentsSubmit = (callback) => {
    this._callback.commentsSubmit = callback;
    this.#comments = this.element.querySelector('.film-details__comment-input').addEventListener('keydown', this.#onEnterKeyDown);
  }

  #emojiClickHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      isEmoji: `<img src="images/emoji/${evt.target.value}.png" width="55" height="55" alt="emoji-${evt.target.value}">`,
      isEmojiChecked: evt.target.id,
    });
  };

  setHideCardClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#clickHandler);
    FilmInfoView.parseDataToFilm(this._data);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  }

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
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

  static parseFilmToData = (film) => ({ ...film,
    isEmoji: '',
    isComment: '',
    isEmojiChecked: ''
  });

  static parseDataToFilm = (data) => {
    const film = { ...data };

    delete film.isEmoji;
    delete film.isComment;
    delete film.emojiChecked;

    return film;
  };
}
