import { render, RenderPosition } from './render.js';
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

const MOVIE_COUNT = 25;
const MOVIE_COUNT_PER_STEP = 5;

const filmCards = Array.from({length: MOVIE_COUNT}, generateFilmCard);
const filters = generateFilters(filmCards);
const profile = generateProfile();

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

render(siteHeaderElement, new ProfileView(profile).element, RenderPosition.BEFOREEND);
render(siteMainElement, new MainNavigationView().element, RenderPosition.BEFOREEND);

const siteNavigationElement = siteMainElement.querySelector('.main-navigation');
const filtersComponent = new FilterView(filters);
render(siteNavigationElement, filtersComponent.element, RenderPosition.BEFOREEND);

render(siteMainElement, new SortView().element, RenderPosition.BEFOREEND);

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
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      hidePopup();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  filmCardComponent.element.querySelector('.film-card__link').addEventListener('click', () => {
    showPopup();
    document.addEventListener('keydown', onEscKeyDown);
  });

  filmPopupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
    hidePopup();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(filmCardElement, filmCardComponent.element, RenderPosition.BEFOREEND);
};

const renderList = (container, cards) => {
  const  activeFilterElement = filtersComponent.element.querySelector('.main-navigation__item--active');

  if (filmCards.length === 0) {
    render(container, new EmptyFilmList(activeFilterElement).element, RenderPosition.BEFOREEND);
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

      loadMoreButtonComponent.element.addEventListener('click', (evt) => {
        evt.preventDefault();
        cards
          .slice(renderFilmCount, renderFilmCount + MOVIE_COUNT_PER_STEP)
          .forEach((card) => renderFilmCard(filmsListContainer,card));

        renderFilmCount += MOVIE_COUNT_PER_STEP;

        if (renderFilmCount >= cards.length) {
          loadMoreButtonComponent.element.remove();
          loadMoreButtonComponent.removeElement();
        }
      });
    }
  }
};

renderList(siteMainElement,filmCards);

render(siteMainElement, new FilmsExtraTemplate().element, RenderPosition.BEFOREEND);

const FILMS_EXTRA_COUNT = 2;
const siteFilmsExtra = document.querySelectorAll('.films-list--extra');
const siteFilmsExtraContainerTopRated = siteFilmsExtra[0].querySelector('.films-list__container');

for (let i = 0; i < FILMS_EXTRA_COUNT; i++) {
  render(siteFilmsExtraContainerTopRated, new FilmCardView((filmCards[i])).element, RenderPosition.BEFOREEND);
}

render(siteFooterElement, new FooterStatisticView().element, RenderPosition.BEFOREEND);
