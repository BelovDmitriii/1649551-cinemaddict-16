import AbstractView from './abstract-view.js';
import { getCommentDateFormat } from '../utils/date.js';
import he from 'he';

export const createCommentDetails = (comments = {}) => {
  const {
    author,
    date,
    comment,
    emotion
  } = comments;

  const dayComment = getCommentDateFormat(date);

  return `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji${emotion}">
  </span>
  <div>
    <p class="film-details__comment-text">${he.encode(comment)}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${author}</span>
      <span class="film-details__comment-day">${dayComment}</span>
      <button class="film-details__comment-delete">Delete</button>
    </p>
  </div>
</li>`;
};

export default class CommentDetails extends AbstractView {
  #comments = null;

  constructor(comments) {
    super();
    this.#comments = comments;
  }

  get template() {
    return createCommentDetails(this.#comments);
  }

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.film-details__comment-delete').addEventListener('click', this.#deleteClickHandler);
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();

    this._callback.deleteClick(this.#comments.id);
  };
}
