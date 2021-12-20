import { render, RenderPosition } from './render.js';
import ProfileView from './view/profile-view.js';
import MainNavigationView from './view/main-navigation-view.js';
import SortView from './view/sort-view.js';
import FilmsView from './view/films-view.js';
import FilmListView from './view/films-list-view.js';
import FilmCardView from './view/film-card-view.js';
import FilmsListContainerView from './view/films-list-container.js';
import ShowMoreButton from './view/show-more-button-view.js';
import FooterStatisticView from './view/footer-statistics-view.js';
import FilterView from './view/filter-view.js';
import FilmsExtraTemplate from './view/films-extra-view.js';
import FilmInfoView from './view/popup-film-info-view.js';
import { generateFilmCard } from './mock/movie-card.js';
import { generateProfile } from './mock/profile.js';
import { generateFilters } from './mock/filter.js';

const MOVIE_COUNT = 25;
const MOVIE_COUNT_PER_STEP = 5;

const cards = Array.from({length: MOVIE_COUNT}, generateFilmCard);
const filters = generateFilters(cards);
const profile = generateProfile();

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

render(siteHeaderElement, new ProfileView(profile).element, RenderPosition.BEFOREEND);
render(siteMainElement, new MainNavigationView().element, RenderPosition.BEFOREEND);

const siteNavigationElement = siteMainElement.querySelector('.main-navigation');
render(siteNavigationElement, new FilterView(filters).element, RenderPosition.BEFOREEND);

render(siteMainElement, new SortView().element, RenderPosition.BEFOREEND);

render(siteMainElement, new FilmsView().element, RenderPosition.BEFOREEND);

const filmsElement = siteMainElement.querySelector('.films');
render(filmsElement, new FilmListView(cards).element, RenderPosition.BEFOREEND);

const filmsListElement = filmsElement.querySelector('.films-list');
render(filmsListElement, new FilmsListContainerView().element, RenderPosition.BEFOREEND);

const filmList = filmsListElement.querySelector('.films-list__container');

render(siteMainElement, new FilmsExtraTemplate().element, RenderPosition.BEFOREEND);

render(siteFooterElement, new FooterStatisticView().element, RenderPosition.BEFOREEND);

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

for (let i = 0; i < Math.min(cards.length, MOVIE_COUNT_PER_STEP); i++) {
  renderFilmCard(filmList, cards[i]);
}

if (cards.length > MOVIE_COUNT_PER_STEP) {

  let renderFilmCount = MOVIE_COUNT_PER_STEP;

  render(filmsListElement, new ShowMoreButton().element, RenderPosition.BEFOREEND);
  const loadMoreButton = filmsListElement.querySelector('.films-list__show-more');

  loadMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    cards
      .slice(renderFilmCount, renderFilmCount + MOVIE_COUNT_PER_STEP)
      .forEach((card) => renderFilmCard(filmList,card));

    renderFilmCount += MOVIE_COUNT_PER_STEP;

    if (renderFilmCount >= cards.length) {
      loadMoreButton.remove();
    }
  });
}
