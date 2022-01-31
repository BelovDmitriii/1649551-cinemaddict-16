export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomFloatInteger = (a = 0, b = 8.9) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);
  const result = lower + Math.random() * (upper - lower + 1);
  return result.toFixed(1);
};

export const createTemplateFromArray = (array, cb) => array.map((item) => cb(item)).join('');

export const getRandomArrayElement = (element) => element[getRandomInteger(0, element.length - 1)];

const shuffle = (array) => {

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const createRandomArray = (array) => shuffle(array).slice(0, getRandomInteger(1, array.length - 1));

export const getFloatingPointNumber = (min = 0, max = 10, exp = 1) => Number((Math.random() * (max - min) + min).toFixed(exp));

export const sortFilmsByRating = (cardA, cardB) => cardB.filmInfo.totalRating - cardA.filmInfo.totalRating;
