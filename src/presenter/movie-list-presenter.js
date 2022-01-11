import FilmListView from '../view/films-list-view.js';
import SortView from '../view/sort-view.js';
import { SortType } from '../view/sort-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import EmptyFilmList from '../view/film-list-empty-view.js';
import { render, RenderPosition, remove } from '../utils/render.js';
import MovieCardPresenter from './movie-card-presenter.js';
import { updateItem, sortFilmsByRating, sortFilmsByDate } from '../utils/common.js';

const MOVIE_COUNT_PER_STEP = 5;

export default class MovieListPresenter {
  #mainContainer = null;
  #filmsList = null;
  #filmsListContainer = null;
  #activeFilterElement = null;
  #activeFilterCount = null;

  #filmListComponent = new FilmListView();
  #filmSortComponent = new SortView();
  #emptyFilmList = new EmptyFilmList();
  #showMoreButtonComponent = new ShowMoreButtonView();

  #filmCards = [];
  #filmComments = [];

  #renderMovieCount = MOVIE_COUNT_PER_STEP;
  #cardPresenterMap = new Map();
  #currentSortType = SortType.DEFAULT;
  #sourcedFilmCards = [];

  constructor (mainContainer, activeFilterElement, activeFilterCount) {
    this.#mainContainer = mainContainer;
    this.#activeFilterElement = activeFilterElement;
    this.#activeFilterCount = activeFilterCount;
  }

  init = (filmCards) => {
    this.#filmCards = [...filmCards];
    this.#sourcedFilmCards = [...filmCards];

    this.#filmsList = this.#filmListComponent.element.querySelector('.films-list');
    this.#filmsListContainer = this.#filmListComponent.element.querySelector('.films-list__container');

    render(this.#mainContainer, this.#filmsListContainer, RenderPosition.BEFOREEND);
    render(this.#filmsListContainer, this.#filmListComponent, RenderPosition.BEFOREEND);

    this.#renderFilmList();
  }

  #handleModeChange = () => {
    this.#cardPresenterMap.forEach((presenter) => presenter.resetView());
  }

  #handleCardChange = (updatedCard) => {
    this.#filmCards = updateItem(this.#filmCards, updatedCard);
    this.#sourcedFilmCards = updateItem(this.#sourcedFilmCards, updatedCard);
    this.#cardPresenterMap.get(updatedCard.id).init(updatedCard, this.#filmComments);
  }

  #sortFilmCards = (sortType) => {
    switch(sortType) {
      case SortType.DATE:
        this.#filmCards.sort(sortFilmsByDate);
        break;

      case SortType.RATING:
        this.#filmCards.sort(sortFilmsByRating);
        break;

      default:
        this.#filmCards = [...this.#sourcedFilmCards];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortFilmCards(sortType);
    this.#clearFilmCardsList();
    this.#renderFilmCardList();
  }

  #renderSort = () => {
    render (this.#mainContainer, this.#filmSortComponent, RenderPosition.AFTERBEGIN);
    this.#filmSortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderCard = (card, comments) => {
    const cardPresenter = new MovieCardPresenter(this.#filmsListContainer, this.#mainContainer, this.#handleCardChange, this.#handleModeChange);

    cardPresenter.init(card, comments);
    this.#cardPresenterMap.set(card.id, cardPresenter);
  }

  #renderFilmCards = (from, to) => {
    this.#filmCards
      .slice(from, to)
      .forEach((card) => this.#renderCard(card, this.#filmComments));
  }

  #renderEmptyFilms = () => {
    render(this.#mainContainer, new EmptyFilmList(this.#activeFilterElement), RenderPosition.BEFOREEND);
  }

  #handleLoadMoreButtonClick = () => {
    this.#renderFilmCards(this.#renderMovieCount, this.#renderMovieCount + MOVIE_COUNT_PER_STEP);
    this.#renderMovieCount += MOVIE_COUNT_PER_STEP;

    if(this.#renderMovieCount >= this.#filmCards.length) {
      remove(this.#showMoreButtonComponent);
    }
  }

  #renderShowMoreButton = () => {
    render(this.#filmsList,this.#showMoreButtonComponent, RenderPosition.BEFOREEND);
    this.#showMoreButtonComponent.setShowMoreButtonClickHandler(this.#handleLoadMoreButtonClick);
  }

  #clearFilmCardsList = () => {
    this.#cardPresenterMap.forEach((presenter) => presenter.destroy());
    this.#cardPresenterMap.clear();
    this.#renderMovieCount = MOVIE_COUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
  }

  #renderFilmCardList = () => {
    this.#renderFilmCards(0, Math.min(this.#filmCards.length, MOVIE_COUNT_PER_STEP));

    if (this.#filmCards.length > MOVIE_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #renderFilmList = () => {
    if (this.#filmCards.length === 0) {
      this.#renderEmptyFilms();
      return;
    }else {
      render(this.#mainContainer, this.#filmListComponent, RenderPosition.BEFOREEND);
    }

    this.#renderSort();
    this.#renderFilmCardList();
  }
}
