import { renderTemplate, renderElement, RenderPosition } from './render.js';
import { createProfileTemplate } from './view/profile-view.js';
//import { createMainNavigationTemplate } from './view/main-navigation-view.js';
import MainNavigationView from './view/main-navigation-view.js';
//import { createSortTemplate } from './view/sort-view.js';
import SortView from './view/sort-view.js';
//import { createFilmsTemplate } from './view/films-view.js';
import FilmsView from './view/films-view.js';
//import { createFilmListTemplate } from './view/films-list-view.js';
import FilmListView from './view/films-list-view.js';
import { createFilmCardTemplate } from './view/film-card-view.js';
//import { createFilmsListContainerTemplate } from './view/films-list-container.js';
import FilmsListContainerView from './view/films-list-container.js';
import ShowMoreButton from './view/show-more-button-view.js';
//import { createFooterStatisticsTemplate } from './view/footer-statistics-view.js';
import FooterStatisticView from './view/footer-statistics-view.js';
import { createFilterTemplate } from './view/filter-view.js';
//import { createFilmsExtraTemplate } from './view/films-extra-view.js'
import FilmsExtraTemplate from './view/films-extra-view.js';
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

renderTemplate(siteHeaderElement, createProfileTemplate(profile), RenderPosition.BEFOREEND);
//renderTemplate(siteMainElement, createMainNavigationTemplate(), RenderPosition.BEFOREEND);
renderElement(siteMainElement, new MainNavigationView().element, RenderPosition.BEFOREEND);

const siteNavigationElement = siteMainElement.querySelector('.main-navigation');
renderTemplate(siteNavigationElement, createFilterTemplate(filters), RenderPosition.BEFOREEND);

//renderTemplate(siteMainElement, createSortTemplate(), RenderPosition.BEFOREEND);
renderElement(siteMainElement, new SortView().element, RenderPosition.BEFOREEND);


//renderTemplate(siteMainElement, createFilmsTemplate(), RenderPosition.BEFOREEND);
renderElement(siteMainElement, new FilmsView().element, RenderPosition.BEFOREEND);

const filmsElement = siteMainElement.querySelector('.films');
//renderTemplate(filmsElement, createFilmListTemplate(), RenderPosition.BEFOREEND);
renderElement(filmsElement, new FilmListView().element, RenderPosition.BEFOREEND);

const filmsListElement = filmsElement.querySelector('.films-list');
//renderTemplate(filmsListElement, createFilmsListContainerTemplate(), RenderPosition.BEFOREEND);
renderElement(filmsListElement, new FilmsListContainerView().element, RenderPosition.BEFOREEND);

const filmList = filmsListElement.querySelector('.films-list__container');
for (const card of cards.slice(0, MOVIE_COUNT_PER_STEP)) {
  renderTemplate(filmList, createFilmCardTemplate(card), RenderPosition.BEFOREEND);
}

if (cards.length > MOVIE_COUNT_PER_STEP) {

  let renderFilmCount = MOVIE_COUNT_PER_STEP;

  renderElement(filmsListElement, new ShowMoreButton().element, RenderPosition.BEFOREEND);
  const loadMoreButton = filmsListElement.querySelector('.films-list__show-more');

  loadMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    cards
      .slice(renderFilmCount, renderFilmCount + MOVIE_COUNT_PER_STEP)
      .forEach((card) => {
        renderTemplate(filmList, createFilmCardTemplate(card), RenderPosition.BEFOREEND);
      });

    renderFilmCount += MOVIE_COUNT_PER_STEP;

    if (renderFilmCount >= cards.length) {
      loadMoreButton.remove();
    }
  });
}

renderElement(siteMainElement, new FilmsExtraTemplate().element, RenderPosition.BEFOREEND);

renderElement(siteFooterElement, new FooterStatisticView().element, RenderPosition.BEFOREEND);
