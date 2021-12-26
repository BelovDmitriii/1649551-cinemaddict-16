import { render, RenderPosition, remove} from './utils/render.js';
import ProfileView from './view/profile-view.js';
import MainNavigationView from './view/main-navigation-view.js';
import SortView from './view/sort-view.js';
import FilmListView from './view/films-list-view.js';
import FilmCardView from './view/film-card-view.js';
import ShowMoreButtonView from './view/show-more-button-view.js';
import FooterStatisticView from './view/footer-statistics-view.js';
import FilterView from './view/filter-view.js';
import FilmsExtraTemplate from './view/films-extra-view.js';
import FilmInfoView from './view/popup-film-info-view.js';
import EmptyFilmList from './view/film-list-empty-view.js';
import { generateFilmCard } from './mock/movie-card.js';
import { generateProfile } from './mock/profile.js';
import { generateFilters } from './mock/filter.js';

const MOVIE_COUNT = 13;
const MOVIE_COUNT_PER_STEP = 5;
const EscapeKeyDown = {
  ESC: 'Esc',
  ESCAPE: 'Escape'
};

const filmCards = Array.from({length: MOVIE_COUNT}, generateFilmCard);
const filters = generateFilters(filmCards);
const profile = generateProfile();

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const profileComponent = new ProfileView(profile);
const navigationComponent = new MainNavigationView();

render(siteHeaderElement, profileComponent, RenderPosition.BEFOREEND);
render(siteMainElement, navigationComponent, RenderPosition.BEFOREEND);

const siteNavigationElement = siteMainElement.querySelector('.main-navigation');
const filtersComponent = new FilterView(filters);
const sortComponent = new SortView();
render(siteNavigationElement, filtersComponent, RenderPosition.BEFOREEND);

render(siteMainElement, sortComponent, RenderPosition.BEFOREEND);

const renderFilmCard = (filmCardElement, card) => {
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
};

const renderList = (container, cards) => {
  const  activeFilterElement = filtersComponent.element.querySelector('.main-navigation__item--active');

  if (filmCards.length === 0) {
    const emptyFilmList = new EmptyFilmList(activeFilterElement);
    render(container, emptyFilmList, RenderPosition.BEFOREEND);
  } else {
    const filmListComponent = new FilmListView();
    render(container, filmListComponent.element, RenderPosition.BEFOREEND);

    const filmsList = filmListComponent.element.querySelector('.films-list');
    const filmsListContainer = filmListComponent.element.querySelector('.films-list__container');

    for (let i = 0; i < Math.min(filmCards.length, MOVIE_COUNT_PER_STEP); i++) {
      renderFilmCard(filmsListContainer, cards[i]);
    }

    if (cards.length > MOVIE_COUNT_PER_STEP) {

      let renderFilmCount = MOVIE_COUNT_PER_STEP;

      const loadMoreButtonComponent = new ShowMoreButtonView();

      render(filmsList, loadMoreButtonComponent.element, RenderPosition.BEFOREEND);

      loadMoreButtonComponent.setShowMoreButtonClickHandler(() => {
        cards
          .slice(renderFilmCount, renderFilmCount + MOVIE_COUNT_PER_STEP)
          .forEach((card) => renderFilmCard(filmsListContainer,card));

        renderFilmCount += MOVIE_COUNT_PER_STEP;

        if (renderFilmCount >= cards.length) {
          remove(loadMoreButtonComponent);
        }
      });
    }
  }
};

renderList(siteMainElement,filmCards);

const extraFilms = new FilmsExtraTemplate();
const footerStats = new FooterStatisticView();

render(siteMainElement, extraFilms, RenderPosition.BEFOREEND);

const FILMS_EXTRA_COUNT = 2;
const siteFilmsExtra = document.querySelectorAll('.films-list--extra');
const siteFilmsExtraContainerTopRated = siteFilmsExtra[0].querySelector('.films-list__container');

for (let i = 0; i < FILMS_EXTRA_COUNT; i++) {
  render(siteFilmsExtraContainerTopRated, new FilmCardView((filmCards[i])).element, RenderPosition.BEFOREEND);
}

render(siteFooterElement, footerStats, RenderPosition.BEFOREEND);
