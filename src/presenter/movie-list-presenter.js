import FilmListView from '../view/films-list-view.js';
import SortView from '../view/sort-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import MainNavigationView from '../view/main-navigation-view.js';
import ProfileView from '../view/profile-view.js';
import FilterView from '../view/filter-view.js';
import FilmsExtraTemplate from '../view/films-extra-view.js';
import EmptyFilmList from '../view/film-list-empty-view.js';
import { render, RenderPosition, replace, remove } from '../utils/render.js';

const MOVIE_COUNT_PER_STEP = 5;

export default class MovieListPresenter {
  #mainContainer = null;
  #filmsList = null;
  #filmsContainer = null;
  #footerContainer = null;

  #movieListComponent = new FilmListView();
  #movieSortComponent = new SortView();
  #showMoreButtonComponent = new ShowMoreButtonView();

  #filmCards = [];
  #filmComments = [];

  constructor (mainContainer) {
    this.#mainContainer = mainContainer;
  }

  init = (filmCards, filmComments) => {
    this.#filmCards = [...filmCards];
    this.#filmComments = [...filmComments];

  }

  #renderSort = () => {
    render (this.#mainContainer, this.#movieSortComponent, RenderPosition.BEFOREEND);
  }

  #renderShowMoreButton = () => {

  }

  #renderCard = (card, comments) => {

  }

  #renderFilmCard = (from, to) => {
    this.filmCards
    .slice(from, to)
    .forEach((card) => this.#renderCard(this.#filmComments))
  }

  #renderCardList = () => {

  }
}
