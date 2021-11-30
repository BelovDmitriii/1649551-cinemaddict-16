import { renderTemplate, RenderPosition } from './render.js';
import { createProfileTemplate } from './view/profile-view.js';
import { createMainNavigationTemplate } from './view/main-navigation-view.js';
import { createSortTemplate } from './view/sort-view.js';
import { createFilmsContainerTemplate } from './view/films-container-view.js';
import { createFilmCardTemplate } from './view/film-card-view.js';
import { createShowMoreButtonTemplate } from './view/show-more-button-view.js';
import { createFooterStatisticsTemplate } from './view/footer-statistics-view.js';

const MOVIE_COUNT = 5;

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

renderTemplate(siteHeaderElement, createProfileTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createMainNavigationTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createSortTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createFilmsContainerTemplate(), RenderPosition.BEFOREEND);

const filmList = siteMainElement.querySelector('.films-list__container');

for (let i = 0; i < MOVIE_COUNT; i++) {
  renderTemplate(filmList, createFilmCardTemplate(), RenderPosition.BEFOREEND);
}

renderTemplate(filmList, createShowMoreButtonTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteFooterElement, createFooterStatisticsTemplate(), RenderPosition.BEFOREEND);
