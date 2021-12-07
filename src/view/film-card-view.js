export const createFilmCardTemplate = (filmsCard) => {
  const {
    title,
    raiting,
    year,
    duration,
    genre,
    poster,
    description,
    comments,
    isWatchlist,
    isWatched,
    isFavorite
  } = filmsCard;

  return `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${raiting}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${duration}h ${duration}m</span>
        <span class="film-card__genre">${genre}</span>
      </p>
      <img src="./images/posters/${poster}" alt="${title}" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <span class="film-card__comments">Comments: ${comments.length}</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item ${isWatchlist ? 'film-card__controls-item--active' : ' '} film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
      <button class="film-card__controls-item ${isWatched ? 'film-card__controls-item--active' : ' '} film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
      <button class="film-card__controls-item ${isFavorite ? 'film-card__controls-item--active' : ' '} film-card__controls-item--favorite" type="button">Mark as favorite</button>
    </div>
  </article>`;
};
