import { createElement } from '../render.js';

const createProfileTemplate = (profile) => {
  const { status, avatar} = profile;

  return `<section class="header__profile profile">
            <p class="profile__rating">${status}</p>
            <img class="profile__avatar" src="${avatar}" alt="Avatar" width="35" height="35">
          </section> `;
};

export default class ProfileView {
  #element = null;
  #profile = null;

  constructor(profile) {
    this.#profile = profile;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return createProfileTemplate(this.#profile);
  }

  removeElement() {
    this.#element = null;
  }
}
