import AbstractObservable from '../utils/abstract-observable.js';
import { FilterType } from '../utils/const.js';

export default class FilterModel extends AbstractObservable {
#filter = FilterType.ALL;

get moviesFilter() {
  return this.#filter;
}

setMoviesFilter = (updateType, filter) => {
  this.#filter = filter;
  this._notify(updateType, filter);
}

}
