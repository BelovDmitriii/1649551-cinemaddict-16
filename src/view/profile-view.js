import { userRank } from '../utils/const.js';
import AbstractView from './abstract-view.js';

const createProfileTemplate = (watchedFilms) => {

  const getUserRank = (count, rank = {}) => {
    const profileRank = Object.keys(rank).find((key) => count >= rank[key].MIN && count <= rank[key].MAX);
    return profileRank;
  };

  const profileUserRank = getUserRank(watchedFilms, userRank);

  return `<section class="header__profile profile">
            <p class="profile__rating">${profileUserRank}</p>
            <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
          </section> `;
};

export default class ProfileView extends AbstractView {
  #profile = null;

  constructor(profile) {
    super();
    this.#profile = profile;
  }

  get template() {
    return createProfileTemplate(this.#profile);
  }
}
