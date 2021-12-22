import AbstractView from './abstract-view.js';

const createProfileTemplate = (profile) => {
  const { status, avatar} = profile;

  return `<section class="header__profile profile">
            <p class="profile__rating">${status}</p>
            <img class="profile__avatar" src="${avatar}" alt="Avatar" width="35" height="35">
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
