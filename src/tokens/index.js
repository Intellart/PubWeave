// @flow
export const isProdEnv = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';

export const localStorageKeys = {
  jwt: '_jwt',
  isAdmin: 'is_admin',
};
