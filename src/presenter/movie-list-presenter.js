import FilmsView from '../view/films-view.js';
import FilmListView from '../view/films-list-view.js';
import FilmListContainerView from '../view/films-list-container-view.js';
import SortView from '../view/sort-view.js';
import { SortType } from '../utils/const.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import EmptyFilmList from '../view/film-list-empty-view.js';
import { render, RenderPosition, remove } from '../utils/render.js';
import MovieCardPresenter from './movie-card-presenter.js';
import { sortFilmsByRating } from '../utils/common.js';
import { sortFilmsByDate } from '../utils/date.js';
import { UpdateType, UserAction } from '../utils/const.js';

const MOVIE_COUNT_PER_STEP = 5;

export default class MovieListPresenter {
  #mainContainer = null;
  #filmsModel = null;
  #filmSortComponent = null;
  #showMoreButtonComponent = null;

  #filmsComponent = new FilmsView();
  #filmListComponent = new FilmListView();
  #filmsListContainer = new FilmListContainerView();
  #emptyFilmList = new EmptyFilmList();

  #renderedMovieCount = MOVIE_COUNT_PER_STEP;
  #cardPresenterMap = new Map();
  #currentSortType = SortType.DEFAULT;

  constructor (mainContainer, filmsModel) {
    this.#mainContainer = mainContainer;
    this.#filmsModel = filmsModel;
    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  get films ()  {
    switch (this.#currentSortType) {
      case SortType.DATE:
        return [...this.#filmsModel.films].sort(sortFilmsByDate);
      case SortType.RATING:
        return [...this.#filmsModel.films].sort(sortFilmsByRating);
    }
    return this.#filmsModel.films;
  }

  init = () => {
    render(this.#mainContainer, this.#filmsComponent, RenderPosition.BEFOREEND);
    render(this.#filmsComponent, this.#filmListComponent, RenderPosition.BEFOREEND);
    render(this.#filmListComponent, this.#filmsListContainer, RenderPosition.BEFOREEND);

    this.#renderFilmList();
  }

  #handleModeChange = () => {
    this.#cardPresenterMap.forEach((presenter) => presenter.resetView());
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#filmsModel.updateFilm(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#cardPresenterMap.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearFilmList();
        this.#renderFilmList();
        break;
      case UpdateType.MAJOR:
        this.#clearFilmList({resetRenderedMovieCount: true, resetSortType: true});
        this.#renderFilmList();
        break;
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearFilmList({resetRenderedMovieCount: true});
    this.#renderFilmList();
  }

  #renderSort = () => {
    this.#filmSortComponent = new SortView(this.#currentSortType);
    this.#filmSortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render (this.#filmsComponent, this.#filmSortComponent, RenderPosition.BEFOREBEGIN);
  }

  #renderCard = (card) => {
    const cardPresenter = new MovieCardPresenter(this.#filmsListContainer, this.#mainContainer, this.#handleViewAction, this.#handleModeChange);

    cardPresenter.init(card);
    this.#cardPresenterMap.set(card.id, cardPresenter);
  }

  #renderFilmCards = (films) => {
    films.forEach((card) => this.#renderCard(card));
  }

  #renderEmptyFilms = () => {
    render(this.#filmsComponent, this.#emptyFilmList, RenderPosition.BEFOREEND);
  }

  #handleLoadMoreButtonClick = () => {
    const cardsCount = this.films.length;
    const newRenderedCardsCount = Math.min(cardsCount, this.#renderedMovieCount + MOVIE_COUNT_PER_STEP);
    const cards = this.films.slice(this.#renderedMovieCount, newRenderedCardsCount);

    this.#renderFilmCards(cards);
    this.#renderedMovieCount = newRenderedCardsCount;

    if(this.#renderedMovieCount >= cardsCount) {
      remove(this.#showMoreButtonComponent);
    }
  }

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    this.#showMoreButtonComponent.setShowMoreButtonClickHandler(this.#handleLoadMoreButtonClick);
    render(this.#filmListComponent,this.#showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  #clearFilmList = ({resetRenderedMovieCount = false, resetSortType = false} = {}) => {
    const cardsCount = this.films.length;

    this.#cardPresenterMap.forEach((presenter) => presenter.destroy());
    this.#cardPresenterMap.clear();

    remove(this.#filmSortComponent);
    remove(this.#emptyFilmList);
    remove(this.#showMoreButtonComponent);

    if (resetRenderedMovieCount) {
      this.#renderedMovieCount = MOVIE_COUNT_PER_STEP;
    } else {
      this.#renderedMovieCount = Math.min(cardsCount, this.#renderedMovieCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderFilmList = () => {
    const cards = this.films;
    const cardsCount = cards.length;
    if (cardsCount === 0) {
      this.#renderEmptyFilms();
      return;
    }
    this.#renderSort();
    this.#renderFilmCards(cards.slice(0, Math.min(cardsCount, this.#renderedMovieCount)));

    if (cardsCount > this.#renderedMovieCount) {
      this.#renderShowMoreButton();
    }
  }
}
