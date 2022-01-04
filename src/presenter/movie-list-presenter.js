import FilmListView from '../view/films-list-view.js';
import SortView from '../view/sort-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';

const MOVIE_COUNT_PER_STEP = 5;

export default class MovieListPresenter {
  #mainContainer = null;

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

  }

  #renderProfile = () => {

  }

  #renderShowMoreButton = () => {

  }

  #renderFilmCard = () => {

  }

  #renderCardList = () => {

  }
}
