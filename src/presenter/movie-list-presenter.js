import FilmsView from '../view/films-view.js';
import FilmListView from '../view/films-list-view.js';
import FilmListContainerView from '../view/films-list-container-view.js';
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

  #filmsComponent = new FilmsView();
  #filmListComponent = new FilmListView();
  #filmsListContainer = new FilmListContainerView();
  #filmSortComponent = new SortView();
  #emptyFilmList = new EmptyFilmList();
  #showMoreButtonComponent = new ShowMoreButtonView();

  #filmCards = [];

  #renderMovieCount = MOVIE_COUNT_PER_STEP;
  #cardPresenterMap = new Map();
  #currentSortType = SortType.DEFAULT;
  #sourcedFilmCards = [];

  constructor (mainContainer) {
    this.#mainContainer = mainContainer;
  }

  init = (filmCards) => {
    this.#filmCards = [...filmCards];
    this.#sourcedFilmCards = [...filmCards];

    render(this.#mainContainer, this.#filmsComponent, RenderPosition.BEFOREEND);
    render(this.#filmsComponent, this.#filmListComponent, RenderPosition.BEFOREEND);
    render(this.#filmListComponent, this.#filmsListContainer, RenderPosition.BEFOREEND);

    this.#renderFilmList();
  }

  #handleModeChange = () => {
    this.#cardPresenterMap.forEach((presenter) => presenter.resetView());
  }

  #handleCardChange = (updatedCard) => {
    this.#filmCards = updateItem(this.#filmCards, updatedCard);
    this.#sourcedFilmCards = updateItem(this.#sourcedFilmCards, updatedCard);
    this.#cardPresenterMap.get(updatedCard.id).init(updatedCard);
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
    render (this.#filmsComponent, this.#filmSortComponent, RenderPosition.BEFOREBEGIN);
    this.#filmSortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderCard = (card) => {
    const cardPresenter = new MovieCardPresenter(this.#filmsListContainer, this.#mainContainer, this.#handleCardChange, this.#handleModeChange);

    cardPresenter.init(card);
    this.#cardPresenterMap.set(card.id, cardPresenter);
  }

  #renderFilmCards = (from, to) => {
    this.#filmCards
      .slice(from, to)
      .forEach((card) => this.#renderCard(card));
  }

  #renderEmptyFilms = () => {
    render(this.#filmsComponent, this.#emptyFilmList, RenderPosition.BEFOREEND);
  }

  #handleLoadMoreButtonClick = () => {
    this.#renderFilmCards(this.#renderMovieCount, this.#renderMovieCount + MOVIE_COUNT_PER_STEP);
    this.#renderMovieCount += MOVIE_COUNT_PER_STEP;

    if(this.#renderMovieCount >= this.#filmCards.length) {
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
      render(this.#filmListComponent, this.#filmsListContainer, RenderPosition.BEFOREEND);
    }
    this.#renderSort();
    this.#renderFilmCardList();
  }
}
