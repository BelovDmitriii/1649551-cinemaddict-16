import FilmCardView from '../view/film-card-view.js';
import FilmInfoView from '../view/popup-film-info-view';
import { RenderPosition, render, remove, replace } from '../utils/render.js';
import { EvtKey, Mode, UserAction, UpdateType } from '../utils/const.js';
import { FilterType } from '../utils/const.js';
import CommentsModel from '../model/comments-model.js';
import AbstractView from '../view/abstract-view.js';

export default class MovieCardPresenter {
  #filmListComponent = null;
  #filmCardComponent = null;
  #filmPopupComponent = null;

  #changeCardData = null;
  #currentFilter = null;
  #changeWatchedFilms = null;

  #filmCard = null;
  #commentsModel = null;
  #mode = null;

  constructor(filmListComponent, comments, changeCardData, currentFilter, changeWatchedFilms) {
    this.#filmListComponent = filmListComponent;
    this.#changeCardData = changeCardData;
    this.#currentFilter = currentFilter;
    this.#changeWatchedFilms = changeWatchedFilms;

    this.#mode = Mode.CARD;

    this.#commentsModel = new CommentsModel();
    this.#commentsModel.comments = comments;
    this.#commentsModel.addObserver(this.#handleModelEvent);
  }

  init (filmCard) {
    this.#filmCard = filmCard;

    const prevfilmCardComponent = this.#filmCardComponent;
    const prevfilmPopupComponent = this.#filmPopupComponent;

    this.#filmCardComponent = new FilmCardView(filmCard);
    this.#filmPopupComponent = new FilmInfoView(filmCard, this.#commentsModel.comments, this.#handleViewAction);

    this.#filmCardComponent.setOpenCardClickHandler(this.#handleFilmCardClick);
    this.#filmCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmCardComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmCardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);

    if (prevfilmCardComponent === null) {
      render(this.#filmListComponent.container, this.#filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#filmListComponent.element.contains(prevfilmCardComponent.element)) {
      replace(this.#filmCardComponent, prevfilmCardComponent);
    }

    this.#initPopup(this.#filmCard);
    if (document.body.contains(prevfilmPopupComponent.element)) {
      const scrollPosition = prevfilmPopupComponent.element.scrollTop;

      replace(this.#filmPopupComponent, prevfilmPopupComponent);
      this.#filmPopupComponent.renderCommentInfo();

      this.#filmPopupComponent.element.scrollTop = scrollPosition;

      this.#setPopupHandlers();

      remove(prevfilmPopupComponent);
    }

    remove(prevfilmCardComponent);
  }

  destroy = () => {
    remove(this.#filmCardComponent);
    remove(this.#filmPopupComponent);
  };

  #initPopup = (filmCard) => {
    this.#filmCard = filmCard;

    const prevfilmPopupComponent = this.#filmPopupComponent;

    this.#filmPopupComponent = new FilmInfoView(filmCard, this.#commentsModel.comments, this.#handleViewAction);

    if (document.body.contains(prevfilmPopupComponent.element)) {
      const scrollPosition = prevfilmPopupComponent.element.scrollTop;

      replace(this.#filmPopupComponent, prevfilmPopupComponent);
      this.#filmPopupComponent.renderCommentInfo();

      this.#filmPopupComponent.element.scrollTop = scrollPosition;

      this.#setPopupHandlers();
      remove(prevfilmPopupComponent);
    }
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === EvtKey.ESCAPE || evt.key === EvtKey.ESC) {
      evt.preventDefault();
      this.#removePopup();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  }

  #renderPopup = () => {
    const popup = this.#filmPopupComponent instanceof AbstractView ? this.#filmPopupComponent.element : this.#filmPopupComponent;
    document.body.appendChild(popup);
    this.#filmPopupComponent.renderCommentInfo();
    document.body.classList.add('hide-overflow');

    this.#setPopupHandlers();

    this.#mode = Mode.POPUP;
  };

  #setPopupHandlers = () => {
    this.#filmPopupComponent.setHideCardClickHandler(() => {
      this.#removePopup();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    });

    this.#filmPopupComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmPopupComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmPopupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
  };

  #removePopup = () => {
    remove(this.#filmPopupComponent);
    document.body.classList.remove('hide-overflow');
    this.#mode = Mode.CARD;
  };

  #removePrevPopup = () => {
    if (document.body.querySelector('.film-details')) {
      document.body.querySelector('.film-details').remove();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #handleFilmCardClick = () => {
    if (!document.body.contains(this.#filmPopupComponent.element)) {
      document.addEventListener('keydown', this.#onEscKeyDown);
      this.#removePrevPopup();
      this.#renderPopup();
    }
  }

  #handleViewAction = (actionType, update) => {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(actionType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(actionType, update);
        break;
    }
  };

  #handleModelEvent = (actionType, data) => {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this.#changeCardData(UserAction.ADD_COMMENT, UpdateType.PATCH, { ...this.#filmCard, comments: this.#filmCard.comments.concat([data]) });
        break;
      case UserAction.DELETE_COMMENT:
        this.#changeCardData(UserAction.DELETE_COMMENT, UpdateType.PATCH, { ...this.#filmCard, comments: this.#filmCard.comments.filter((comment) => comment.id !== data)});
        break;
    }
  };

  #handleFavoriteClick = () => {
    this.#changeCardData(
      UserAction.UPDATE_FILM,
      this.#currentFilter !== FilterType.FAVORITES ? UpdateType.PATCH : UpdateType.MINOR, {
        ...this.#filmCard,
        userDetails: {
          isWatchlist: this.#filmCard.userDetails.watchlist,
          isWatched: this.#filmCard.userDetails.alreadyWatched,
          watchingDate: this.#filmCard.userDetails.watchingDate,
          isFavorite: !this.#filmCard.userDetails.favorite
        },
      });
  }

  #handleWatchedClick = () => {
    this.#changeCardData(
      UserAction.UPDATE_FILM,
      this.#currentFilter !== FilterType.WATCHLIST ? UpdateType.PATCH : UpdateType.MINOR, {
        ...this.#filmCard,
        userDetails: {
          isWatchlist: this.#filmCard.userDetails.watchlist,
          isWatched: !this.#filmCard.userDetails.alreadyWatched,
          watchingDate: this.#filmCard.userDetails.watchingDate,
          isFavorite: this.#filmCard.userDetails.favorite
        },
      });

    if (this.#mode === Mode.POPUP) {
      this.#initPopup(this.#filmCard);
    }

    this.#changeWatchedFilms();
  }

  #handleWatchlistClick = () => {
    this.#changeCardData(
      UserAction.UPDATE_FILM,
      this.#currentFilter !== FilterType.HISTORY ? UpdateType.PATCH : UpdateType.MINOR, {
        ...this.#filmCard,
        userDetails: {
          isWatchlist: !this.#filmCard.userDetails.watchlist,
          isWatched: this.#filmCard.userDetails.alreadyWatched,
          watchingDate: this.#filmCard.userDetails.watchingDate,
          isFavorite: this.#filmCard.userDetails.favorite
        },
      });
  }

}
