import { generateComment } from './comments.js';
import { getRandomFloatInteger, getRandomInteger, createRandomArray, generateDate } from '../util.js';

const ACTORS = [
  'Al Pacino',
  'Robert De Niro',
  'Tom Hanks',
  'Clint Eastwood',
  'Leonardo DiCaprioo'
];

const WRITERS = [
  'Christopher Nolan',
  'Stiven Spielberg',
  'Stanley Kubrick',
  'Martin Scorsese'
];

const FilmLength = {
  MIN: 60,
  MAX: 300
};

const generateRandomTitle = () => {
  const titles = [
    'The Dance of Life',
    'Sagebrush Trail',
    'The Man with the Golden Arm',
    'Santa Claus Conquers the Martians',
    'Popeye the Sailor Meets Sindbad the Sailor'
  ];

  const randomIndex = getRandomInteger(0, titles.length - 1);
  return titles[randomIndex];
};

const generatePoster = () => {
  const posters = [
    'made-for-each-other.png',
    'popeye-meets-sinbad.png',
    'sagebrush-trail.jpg',
    'santa-claus-conquers-the-martians.jpg',
    'the-dance-of-life.jpg',
    'the-great-flamarion.jpg',
    'the-man-with-the-golden-arm.jpg'
  ];

  const randomIndex = getRandomInteger(0, posters.length - 1);
  return posters[randomIndex];
};

const generateDescription = () => {
  const descriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Aliquam erat volutpat.',
    'Nunc fermentum tortor ac porta dapibus.',
    'In rutrum ac purus sit amet tempus.'
  ];

  const randomIndex = getRandomInteger(0, descriptions.length - 1);
  return descriptions[randomIndex];
};

const generateRandomComment = (min = 0, max = 5) => {
  const randomIndex = getRandomInteger(min, max);
  return Array.from({ length: randomIndex }, generateComment);
};

const generateGenre = () => {
  const genres = [
    'Western',
    'Drama',
    'Mystery',
    'Comedy',
  ];

  const randomIndex = getRandomInteger(0, genres.length - 1);
  return genres[randomIndex];
};

const generateAuthor = () => {
  const authors = [
    'Christopher Nolan',
    'Stiven Spielberg',
    'Stanley Kubrick',
    'Martin Scorsese'
  ];

  const randomIndex = getRandomInteger(0, authors.length - 1);
  return authors[randomIndex];
};

const generateCountry = () => {
  const country = [
    'USA',
    'Germany',
    'Great Britain',
    'Sweden',
    'France',
    'Italy'
  ];

  const randomIndex = getRandomInteger(0, country.length - 1);
  return country[randomIndex];
};

const generateAge = () => {
  const age = [
    '0+',
    '6+',
    '12+',
    '16+',
    '18+'
  ];

  const randomIndex = getRandomInteger(0, age.length - 1);
  return age[randomIndex];
};

const generateDuration = (time) => Math.floor(time/60);

export const generateFilmCard = () => ({
  title: generateRandomTitle(),
  raiting: getRandomFloatInteger(),
  poster: generatePoster(),
  age: generateAge(),
  description: generateDescription(),
  comments: generateRandomComment(),
  genre: generateGenre(),
  year: getRandomInteger(1900, 2000),
  author: generateAuthor(),
  writrs:createRandomArray(WRITERS),
  actors: createRandomArray(ACTORS),
  country: generateCountry(),
  date: generateDate(),
  duration:generateDuration(getRandomInteger(FilmLength.MIN, FilmLength.MAX)),
  isWatchlist: Boolean(getRandomInteger(0, 1)),
  isWatched: Boolean(getRandomInteger(0, 1)),
  isFavorite: Boolean(getRandomInteger(0, 1))
});
