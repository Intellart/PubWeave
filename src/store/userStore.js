// @flow
import { toast } from 'react-toastify';
import * as API from '../api';
import type { ReduxAction, ReduxActionWithPayload, ReduxState } from '../types';

export type User = {
  id: number,
  email: string,
  first_name: string,
  last_name: string,
  full_name: string,
  created_at: string,
  updated_at: string,
}

type LoginCredentials = {
  email: string,
  password: string,
}

export type State = {
  currentUser: User|null,
};

export const types = {
  USR_LOGIN_USER: 'USR/LOGIN_USER',
  USR_LOGIN_USER_PENDING: 'USR/LOGIN_USER_PENDING',
  USR_LOGIN_USER_REJECTED: 'USR/LOGIN_USER_REJECTED',
  USR_LOGIN_USER_FULFILLED: 'USR/LOGIN_USER_FULFILLED',

  USR_LOGOUT_USER: 'USR/LOGOUT_USER',
  USR_LOGOUT_USER_PENDING: 'USR/LOGOUT_USER_PENDING',
  USR_LOGOUT_USER_REJECTED: 'USR/LOGOUT_USER_REJECTED',
  USR_LOGOUT_USER_FULFILLED: 'USR/LOGOUT_USER_FULFILLED',

  USR_CLEAR_USER: 'USR/CLEAR_USER',
};

export const selectors = {
  getUser: (state: ReduxState): User|null => state.user.currentUser,
};

export const actions = {
  loginUser: (payload: LoginCredentials): ReduxAction => ({
    type: types.USR_LOGIN_USER,
    payload: API.postRequest('auth/session', { user: payload }),
  }),
  logoutUser: (): ReduxAction => ({
    type: types.USR_LOGOUT_USER,
    payload: API.deleteRequest('auth/session'),
  }),
  clearUser: (): ReduxAction => ({
    type: types.USR_CLEAR_USER,
  }),
};

const logoutUser = (): State => {
  localStorage.removeItem('_jwt');

  return {};
};

export const reducer = (state: State, action: ReduxActionWithPayload): State => {
  switch (action.type) {
    case types.USR_LOGIN_USER_FULFILLED:
      toast.success('User successfully logged in!');

      return { ...state, ...{ profile: action.payload, currentAdmin: null } };

    case types.USR_LOGOUT_USER_FULFILLED:
      toast.success('User successfully logged out!');

      return logoutUser();

    case types.USR_CLEAR_USER:
      return logoutUser();

    default:
      return state || {};
  }
};
