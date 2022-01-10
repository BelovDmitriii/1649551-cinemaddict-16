import { render, RenderPosition} from './utils/render.js';
import ProfileView from './view/profile-view.js';
import MainNavigationView from './view/main-navigation-view.js';
import FilmCardView from './view/film-card-view.js';
import FooterStatisticView from './view/footer-statistics-view.js';
import FilterView from './view/filter-view.js';
import FilmsExtraTemplate from './view/films-extra-view.js';
import { generateFilmCard} from './mock/movie-card.js';
import { generateProfile } from './mock/profile.js';
import { generateFilters } from './mock/filter.js';
import MovieListPresenter from './presenter/movie-list-presenter.js';

const MOVIE_COUNT = 30;

const filmCards = Array.from({length: MOVIE_COUNT}, generateFilmCard);
const filters = generateFilters(filmCards);
const profile = generateProfile();

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const profileComponent = new ProfileView(profile);
const navigationComponent = new MainNavigationView();

const movieListPresenter = new MovieListPresenter(siteMainElement);

render(siteHeaderElement, profileComponent, RenderPosition.BEFOREEND);
render(siteMainElement, navigationComponent, RenderPosition.BEFOREEND);

const siteNavigationElement = siteMainElement.querySelector('.main-navigation');
const filtersComponent = new FilterView(filters);

render(siteNavigationElement, filtersComponent, RenderPosition.BEFOREEND);

movieListPresenter.init(filmCards);

const extraFilms = new FilmsExtraTemplate();
const footerStats = new FooterStatisticView(filmCards);

render(siteMainElement, extraFilms, RenderPosition.BEFOREEND);

const FILMS_EXTRA_COUNT = 2;
const siteFilmsExtra = document.querySelectorAll('.films-list--extra');
const siteFilmsExtraContainerTopRated = siteFilmsExtra[0].querySelector('.films-list__container');

for (let i = 0; i < FILMS_EXTRA_COUNT; i++) {
  render(siteFilmsExtraContainerTopRated, new FilmCardView((filmCards[i])).element, RenderPosition.BEFOREEND);
}

render(siteFooterElement, footerStats, RenderPosition.BEFOREEND);
