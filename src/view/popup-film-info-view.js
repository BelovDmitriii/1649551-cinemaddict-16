import SmartView from './smart-view.js';
import { getPopupFilmReleaseDateFormat, getFilmDurationFormat } from '../utils/date.js';
import { UserAction } from '../utils/const.js';
import { render, RenderPosition} from '../utils/render.js';
import CommentDetails from './comment-details-view.js';
import PostCommentView from './post-comment-view.js';

const createFilmInfoTemplate = (filmCard) => {
  const {
    filmInfo,
    userDetails
  } = filmCard;

  const genresName = filmInfo.genre.length > 1 ? 'Genres' : 'Genre';
  const createGenreTemplate = (genre) => `<span class="film-details__genre">${genre}</span>`;
  const getGenres = (genresList) => genresList.map(createGenreTemplate).join('');

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
              <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">3</span></h3>
              <ul class="film-details__comments-list">

              </ul>
            </section>
          </div>
        </form>
      </section>`;
};

export default class FilmInfoView extends SmartView {
  #films = null;
  #container = null;
  #filmComments = [];
  #changeCommentData = null;

  constructor(films, filmComments, changeCommentData) {
    super();

    this.#films = films;
    this.#filmComments = [...filmComments];
    this.#changeCommentData = changeCommentData;
  }

  get template() {
    return createFilmInfoTemplate(this.#films, this. filmComments);
  }

  get container() {
    this.#container = this.element.querySelector('.film-details__comments-list');

    return this.#container;
  }

  renderCommentInfo = () => {
    this.#renderComments();
    this.#renderPostComment();
  };

  #renderComments = () => {
    for (const comment of this.#filmComments) {
      const commentComponent = new CommentDetails(comment);
      commentComponent.setDeleteClickHandler(this.#handleDeleteCommentClick);
      render(this.container, commentComponent, RenderPosition.BEFOREEND);
    }
  };

  #handleDeleteCommentClick = (update) => {
    this.#changeCommentData(UserAction.DELETE_COMMENT, update);
  };


  #renderPostComment = () => {
    const postCommentComponent = new PostCommentView();
    postCommentComponent.setCommentKeydownHandler(this.#handleCommentKeydown);
    render(this.container, postCommentComponent, RenderPosition.AFTEREND);
  };

  #handleCommentKeydown = (update) => {
    this.#changeCommentData(UserAction.ADD_COMMENT, update);
  };

  reset = (film) => {
    this.updateData(FilmInfoView.parseFilmToData(film));
  };

  restoreHandlers = () => {
    this.setHideCardClickHandler(this._callback.editClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
  };

  setHideCardClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#hideClickHandler);
  }

  #hideClickHandler = (evt) => {
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
}
