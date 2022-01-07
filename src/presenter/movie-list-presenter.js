import FilmListView from '../view/films-list-view.js';
import SortView from '../view/sort-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmCardView from '../view/film-card-view.js';
import FilmInfoView from '../view/popup-film-info-view.js';
import EmptyFilmList from '../view/film-list-empty-view.js';
import { render, RenderPosition, remove } from '../utils/render.js';

const MOVIE_COUNT_PER_STEP = 5;
const EscapeKeyDown = {
  ESC: 'Esc',
  ESCAPE: 'Escape'
};

export default class MovieListPresenter {
  #mainContainer = null;
  #filmsList = null;
  #filmsListContainer = null;
  #footerContainer = null;

  #filmListComponent = new FilmListView();
  #filmSortComponent = new SortView();
  #emptyFilmList = new EmptyFilmList();
  #showMoreButtonComponent = new ShowMoreButtonView();

  #filmCards = [];
  #filmComments = [];

  #renderMovieCount = MOVIE_COUNT_PER_STEP;

  constructor (mainContainer, footerContainer) {
    this.#mainContainer = mainContainer;
    this.#footerContainer = footerContainer;
  }

  init = (filmCards) => {
    this.#filmCards = [...filmCards];
    //this.#filmComments = [...filmComments];

    this.#filmsList = this.#filmListComponent.element.querySelector('.films-list');
    this.#filmsListContainer = this.#filmListComponent.element.querySelector('.films-list__container');

    render(this.#mainContainer, this.#filmsListContainer, RenderPosition.BEFOREEND);
    render(this.#filmsListContainer, this.#filmListComponent, RenderPosition.BEFOREEND);

    this.#renderFilmList();
  }

  #renderSort = () => {
    render (this.#filmListComponent, this.#filmSortComponent, RenderPosition.AFTERBEGIN);
  }

  #renderFilmCards = (from, to) => {
    this.#filmCards
      .slice(from, to)
      .forEach((card) => this.#renderCard(card, this.#filmComments));
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

  #renderCard = (filmCardElement, card) => {
    const filmCardComponent = new FilmCardView(card);
    const filmPopupComponent = new FilmInfoView(card);
    const bodyElement = document.querySelector('body');

    const showPopup = ()=> {
      filmCardElement.appendChild(filmPopupComponent.element);
      bodyElement.classList.add('hide-overflow');
    };

    const hidePopup = ()=> {
      filmCardElement.removeChild(filmPopupComponent.element);
      bodyElement.classList.remove('hide-overflow');
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === EscapeKeyDown.ESCAPE || evt.key === EscapeKeyDown.ESC) {
        evt.preventDefault();
        hidePopup();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    filmCardComponent.setOpenCardClickHandler(() => {
      showPopup();
      document.addEventListener('keydown', onEscKeyDown);
    });

    filmPopupComponent.setHideCardClickHandler(() => {
      hidePopup();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(filmCardElement, filmCardComponent, RenderPosition.BEFOREEND);
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
    }   else {
      render(this.#mainContainer, this.#filmListComponent, RenderPosition.BEFOREEND);
    }

    this.#renderSort();
    this.#renderFilmCardList();
  }
}
