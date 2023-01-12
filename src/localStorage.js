// @flow
import { isEmpty } from 'lodash';

export const getItem = (key: string): string|null => {
  try {
    const serializedState = localStorage.getItem(key);
    if (isEmpty(serializedState) || !serializedState) {
      return null;
    }

    return serializedState;
  } catch (err) {
    return null;
  }
};

export const setItem = (key: string, payload: string) => {
  try {
    localStorage.setItem(key, payload);
  } catch (err) {
    // ignore write errors
  }
};

export const removeItem = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    // ignore write errors
  }
};
