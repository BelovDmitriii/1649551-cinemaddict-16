import dayjs from 'dayjs';
import { getRandomInteger } from './common.js';

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
