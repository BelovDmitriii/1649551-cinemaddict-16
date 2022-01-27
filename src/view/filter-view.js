import AbstractView from './abstract-view.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return `<a href='#${type}'
       class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}"data-filter="${type}">
        ${name} ${type === 'all' ? '' : `<span data-filter="${type}" class="main-navigation__item-count">${count}</span>`}
        </a>`;
};

const createAllMoviesTemplate = () =>
  '<a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>';

const createFilterTemplate = (filters, currentFilterType) => {

  const filterItemsTemplate = filters
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `<nav class="main-navigation">
     <div class="main-navigation__items">
      ${createAllMoviesTemplate()}
      ${filterItemsTemplate}
    </div>

    <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`;
};

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }
}
