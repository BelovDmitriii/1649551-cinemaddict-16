import FilmListView from '../view/films-list-view.js';
import SortView from '../view/sort-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import EmptyFilmList from '../view/film-list-empty-view.js';
import { render, RenderPosition, remove } from '../utils/render.js';
import MovieCardPresenter from './movie-card-presenter.js';
import { updateItem } from '../utils/common.js';

const MOVIE_COUNT_PER_STEP = 5;

export default class MovieListPresenter {
  #mainContainer = null;
  #filmsList = null;
  #filmsListContainer = null;

  #filmListComponent = new FilmListView();
  #filmSortComponent = new SortView();
  #emptyFilmList = new EmptyFilmList();
  #showMoreButtonComponent = new ShowMoreButtonView();

  #filmCards = [];
  #filmComments = [];

  #renderMovieCount = MOVIE_COUNT_PER_STEP;
  #cardPresenterMap = new Map();

  constructor (mainContainer) {
    this.#mainContainer = mainContainer;
  }

  init = (filmCards) => {
    this.#filmCards = [...filmCards];

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
    this.#cardPresenterMap.get(updatedCard.id).init(updatedCard, this.#filmComments);
  }

  #renderSort = () => {
    render (this.#mainContainer, this.#filmSortComponent, RenderPosition.AFTERBEGIN);
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
    render(this.#mainContainer, this.#emptyFilmList, RenderPosition.BEFOREEND);
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
