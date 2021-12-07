import dayjs from 'dayjs';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomFloatInteger = (a = 0, b = 9.9) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);
  const result = lower + Math.random() * (upper - lower + 1);
  return result.toFixed(1);
};

export const getRandomArrayElement = (element) => element[getRandomInteger(0, element.length - 1)];

const shuffle = (array) => {
  const copyOfArray = array.slice();

  for (let i = copyOfArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copyOfArray[i], copyOfArray[j]] = [copyOfArray[j], copyOfArray[i]];
  }
  return array;
};

export const createRandomArray = (array) => shuffle(array).slice(0, getRandomInteger(0, array.length - 1));

export const getFloatingPointNumber = (min = 0, max = 10, exp = 1) => Number((Math.random() * (max - min) + min).toFixed(exp));

export const generateDate = () => {
  const hour = getRandomInteger(0, 24);
  const minutes = getRandomInteger(0, 24);
  const day = getRandomInteger(1, 7);
  const month = getRandomInteger(0, 11);
  const year = getRandomInteger(-10, 0);
  return dayjs()
    .add(hour, 'hour')
    .add(minutes, 'minutes')
    .add(day, 'day')
    .add(month, 'month')
    .add(year, 'year')
    .format('YYYY/MM/DD hh:mm');
};
