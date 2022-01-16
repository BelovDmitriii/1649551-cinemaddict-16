import { getRandomFloatInteger, getRandomInteger, createRandomArray } from '../utils/common.js';
import { generateDate } from '../utils/date.js';
import { nanoid } from 'nanoid';


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
  MAX: 240
};

const generateRandomAuthor = () => {
  const commentAuthors = [
    'John Snow',
    'Jack Richer',
    'Jennifer Smith',
    'Velikii'
  ];

  const randomIndex = getRandomInteger(0, commentAuthors.length - 1);
  return commentAuthors[randomIndex];
};

const generateRandomComment = () => {
  const comments = [
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

  const randomIndex = getRandomInteger(0, comments.length -1);
  return comments[randomIndex];
};

const createEmotion = () => {
  const emojis = [
    'smile',
    'sleeping',
    'puke',
    'angry'
  ];

  const randomIndex = getRandomInteger(0, emojis.length -1);
  return emojis[randomIndex];
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

const generateGenre = () => {
  const genres = [
    'Western',
    'Drama',
    'Mystery',
    'Comedy',
  ];

  const randomIndex = createRandomArray(genres);
  return randomIndex;
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

const generateFilmComment = () => ({
  id: nanoid(),
  author: generateRandomAuthor(),
  comment: generateRandomComment(),
  date: generateDate(),
  emotion: createEmotion()
});

const getRandomComments = (min = 0, max = 7) => {
  const randomIndex = getRandomInteger(min, max);
  return Array.from({ length: randomIndex }, generateFilmComment);
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
  id: nanoid(),
  comments: getRandomComments(0, 7),
  filmInfo: {
    title: generateRandomTitle(),
    alternativeTitle: generateRandomTitle(),
    totalRating: getRandomFloatInteger(),
    poster: generatePoster(),
    ageRating: generateAge(),
    director: generateAuthor(),
    writers: createRandomArray(WRITERS),
    actors: createRandomArray(ACTORS),
    release: {
      date: getRandomInteger(1970, 2021),
      releaseCountry: generateCountry()
    },
    runtime: {
      hours: generateDuration(getRandomInteger(FilmLength.MIN, FilmLength.MAX)),
      minutes: getRandomInteger(0, 60)
    },
    genre: generateGenre(),
    description: generateDescription(),
  },
  userDetails: {
    isWatchlist: Boolean(getRandomInteger(0, 1)),
    isWatched: Boolean(getRandomInteger(0, 1)),
    watchingDate: generateDate(),
    isFavorite: Boolean(getRandomInteger(0, 1))
  }
});
