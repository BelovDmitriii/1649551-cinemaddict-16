import FilmsView from '../view/films-view.js';
import FilmListView from '../view/films-list-view.js';
import ProfileView from '../view/profile-view.js';
import SortView from '../view/sort-view.js';
import { SortType } from '../utils/const.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import EmptyFilmList from '../view/film-list-empty-view.js';
import { render, RenderPosition, remove, replace } from '../utils/render.js';
import MovieCardPresenter from './movie-card-presenter.js';
import { sortFilmsByRating } from '../utils/common.js';
import { sortFilmsByDate } from '../utils/date.js';
import { UpdateType, UserAction, FilterType } from '../utils/const.js';
import { filter } from '../utils/filter.js';

const MOVIE_COUNT_PER_STEP = 5;

export default class MovieListPresenter {
  #mainContainer = null;
  #profileContainer = null;
  #filmsModel = null;
  #filterModel = null;
  #filmSortComponent = null;
  #showMoreButtonComponent = null;
  #emptyFilmList = null;
  #profileComponent = null;

  #filmsComponent = new FilmsView();
  #filmListComponent = new FilmListView();

  #renderedMovieCount = MOVIE_COUNT_PER_STEP;
  #cardPresenterMap = new Map();
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;

  constructor (profileContainer, mainContainer, filmsModel, filterModel) {
    this.#profileContainer = profileContainer;
    this.#mainContainer = mainContainer;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get films ()  {
    this.#filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortFilmsByDate);
      case SortType.RATING:
        return filteredFilms.sort(sortFilmsByRating);
    }
    return filteredFilms;
  }

  get watchedFilms() {
    return this.#filmsModel.films.filter((film) => film.userDetails.alreadyWatched);
  }

  init = () => {
    render(this.#mainContainer, this.#filmsComponent, RenderPosition.BEFOREEND);

    this.#renderFilmList();
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
        if (this.#cardPresenterMap.has(data.id)) {
          this.#cardPresenterMap.get(data.id).init(data);
        }
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

  #renderProfile = () => {
    const prevProfileComponent = this.#profileComponent;

    this.#profileComponent = new ProfileView(this.watchedFilms.length);

    if (prevProfileComponent === null) {
      render(this.#profileContainer, this.#profileComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#profileContainer.contains(prevProfileComponent.element)) {
      replace(this.#profileComponent, prevProfileComponent);
    }
  };

  #renderSort = () => {
    this.#filmSortComponent = new SortView(this.#currentSortType);
    this.#filmSortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render (this.#filmsComponent, this.#filmSortComponent, RenderPosition.BEFOREBEGIN);
  }

  #renderCard = (card) => {
    const filmComments = card.comments;
    const cardPresenter = new MovieCardPresenter(this.#filmListComponent, filmComments, this.#handleViewAction, this.#filterType, this.#renderProfile);

    cardPresenter.init(card);
    this.#cardPresenterMap.set(card.id, cardPresenter);
  }

  #renderFilmsList = () => {
    render(this.#filmsComponent, this.#filmListComponent, RenderPosition.BEFOREEND);
  };

  #renderFilmCards = (films) => {
    films.forEach((card) => this.#renderCard(card));
  }

  #renderEmptyFilms = () => {
    this.#emptyFilmList = new EmptyFilmList(this.#filterType);
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
    remove(this.#showMoreButtonComponent);

    if (this.#emptyFilmList) {
      remove(this.#emptyFilmList);
    }

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
    if (this.#profileComponent === null) {
      this.#renderProfile();
    }

    this.#renderSort();
    this.#renderFilmsList();
    this.#renderFilmCards(cards.slice(0, Math.min(cardsCount, this.#renderedMovieCount)));

    if (cardsCount > this.#renderedMovieCount) {
      this.#renderShowMoreButton();
    }
  }
}
