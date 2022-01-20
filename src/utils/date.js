import dayjs from 'dayjs';
import { getRandomInteger } from './common.js';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

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

export const sortFilmsByDate = (filmA, filmB) => dayjs(filmB.filmInfo.release.date).diff(dayjs(filmA.filmInfo.release.date));

export const getFilmDurationFormat = (runTime) => dayjs.duration(runTime, 'minutes').format('H[h] mm[m]');

export const getPopupFilmReleaseDateFormat = (date) => dayjs(date).format('DD MMMM YYYY');
export const getFilmReleaseDateFormat = (date) => dayjs(date).format('YYYY');

export const getCommentDateFormat = (date) => dayjs(date).fromNow();
