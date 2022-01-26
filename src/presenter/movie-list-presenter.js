import FilmsView from '../view/films-view.js';
import FilmListView from '../view/films-list-view.js';
import FilmListContainerView from '../view/films-list-container-view.js';
import SortView from '../view/sort-view.js';
import { SortType } from '../view/sort-view.js';
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

  #filmsComponent = new FilmsView();
  #filmListComponent = new FilmListView();
  #filmsListContainer = new FilmListContainerView();
  #filmSortComponent = new SortView();
  #emptyFilmList = new EmptyFilmList();
  #showMoreButtonComponent = new ShowMoreButtonView();

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
    //console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#cardPresenterMap.get(data.id).init(data);
        if (this.#cardPresenterMap.has(data.id)) {
          this.#cardPresenterMap.get(data.id).init(data);
        }
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        break;
    }
    //console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearFilmCardsList();
    this.#renderFilmList();
  }

  #renderSort = () => {
    render (this.#filmsComponent, this.#filmSortComponent, RenderPosition.BEFOREBEGIN);
    this.#filmSortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
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
    render(this.#filmListComponent,this.#showMoreButtonComponent, RenderPosition.BEFOREEND);
    this.#showMoreButtonComponent.setShowMoreButtonClickHandler(this.#handleLoadMoreButtonClick);
  }

  #clearFilmCardsList = () => {
    this.#cardPresenterMap.forEach((presenter) => presenter.destroy());
    this.#cardPresenterMap.clear();
    this.#renderedMovieCount = MOVIE_COUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
  }

  #renderFilmCardList = () => {
    const cards = this.films;
    const cardsCount = cards.length;
    this.#renderFilmCards(cards.slice(0, Math.min(cardsCount, this.#renderedMovieCount)));

    if (cardsCount > this.#renderedMovieCount) {
      this.#renderShowMoreButton();
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
    this.#renderFilmCardList();
  }
}
