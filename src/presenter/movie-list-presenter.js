import FilmListView from '../view/films-list-view.js';
import SortView from '../view/sort-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmCardView from '../view/film-card-view.js';
import FilmInfoView from '../view/popup-film-info-view.js';
import EmptyFilmList from '../view/film-list-empty-view.js';
import { render, RenderPosition, replace, remove } from '../utils/render.js';

const MOVIE_COUNT_PER_STEP = 5;

export default class MovieListPresenter {
  #mainContainer = null;
  #filmsList = null;
  #footerContainer = null;

  #filmListComponent = new FilmListView();
  #filmCardComponent = new FilmCardView();
  #filmPopupComponent = new FilmInfoView()
  #filmSortComponent = new SortView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #emptyFilmList = new EmptyFilmList();

  #filmCards = [];
  #filmComments = [];
  #renderMovieCount = MOVIE_COUNT_PER_STEP;

  constructor (mainContainer, footerContainer) {
    this.#mainContainer = mainContainer;
    this.#footerContainer = footerContainer;
  }

  init = (filmCards, filmComments) => {
    this.#filmCards = [...filmCards];
    this.#filmComments = [...filmComments];

    render(this.#mainContainer, this.#filmListComponent, RenderPosition.BEFOREEND);
    render(this.#filmListComponent, this.#filmCardComponent, RenderPosition.BEFOREEND);

    this.#renderFilmList();
  }

  #renderSort = () => {
    render (this.#filmListComponent, this.#filmSortComponent, RenderPosition.AFTERBEGIN);
  }

  #renderShowMoreButton = () => {

  }

  #renderCard = (card, comments) => {

  }

  #renderFilmCards = (from, to) => {
    this.#filmCards
      .slice(from, to)
      .forEach((card) => this.#renderCard(card, this.#filmComments));
  }

  #renderEmptyFilms = () => {
    render(this.#filmListComponent, this.#emptyFilmList, RenderPosition.AFTERBEGIN);
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
    }
    this.#renderSort();

    if(this.#filmCards.length) {
      render(this.#filmListComponent, this.#filmCardComponent, RenderPosition.BEFOREEND);
    }

    this.#renderFilmCardList();
  }
}
