import { getRandomInteger } from '../utils/common.js';

const getRandomStatus = () => {
  const status = [
    'Movie Buff',
    'Movie Critic'
  ];

  const randomIndex = getRandomInteger(0, status.length - 1);
  return status[randomIndex];
};

const getRandomAvatar = () => {
  const avatars = [
    './images/bitmap@2x.png'
  ];

  return avatars[0];
};

export const generateProfile = () => ({
  status: getRandomStatus(),
  avatar: getRandomAvatar()
});
