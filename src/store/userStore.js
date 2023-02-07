// @flow
import { toast } from 'react-toastify';
import * as API from '../api';
import type { ReduxAction, ReduxActionWithPayload, ReduxState } from '../types';
import { setItem, removeItem } from '../localStorage';
import { localStorageKeys } from '../tokens';

export type User = {
  id: number,
  email: string,
  first_name: string,
  last_name: string,
  full_name: string,
  created_at: string,
  updated_at: string,
}

type Admin = {
  id: number,
  email: string,
  role: number,
  created_at: string,
  updated_at: string,
}

type LoginCredentials = {
  email: string,
  password: string,
  domain: string,
}

export type State = {
  profile: User|null,
  currentAdmin: Admin|null,
};

export const types = {
  USR_LOGIN_USER: 'USR/LOGIN_USER',
  USR_LOGIN_USER_PENDING: 'USR/LOGIN_USER_PENDING',
  USR_LOGIN_USER_REJECTED: 'USR/LOGIN_USER_REJECTED',
  USR_LOGIN_USER_FULFILLED: 'USR/LOGIN_USER_FULFILLED',

  USER_LOGIN_ADMIN: 'USR/LOGIN_ADMIN',
  USER_LOGIN_ADMIN_PENDING: 'USR/LOGIN_ADMIN_PENDING',
  USER_LOGIN_ADMIN_REJECTED: 'USR/LOGIN_ADMIN_REJECTED',
  USER_LOGIN_ADMIN_FULFILLED: 'USR/LOGIN_ADMIN_FULFILLED',

  USR_LOGOUT_USER: 'USR/LOGOUT_USER',
  USR_LOGOUT_USER_PENDING: 'USR/LOGOUT_USER_PENDING',
  USR_LOGOUT_USER_REJECTED: 'USR/LOGOUT_USER_REJECTED',
  USR_LOGOUT_USER_FULFILLED: 'USR/LOGOUT_USER_FULFILLED',

  USR_VALIDATE_USER: 'USR/VALIDATE_USER',
  USR_VALIDATE_USER_PENDING: 'USR/VALIDATE_USER_PENDING',
  USR_VALIDATE_USER_REJECTED: 'USR/VALIDATE_USER_REJECTED',
  USR_VALIDATE_USER_FULFILLED: 'USR/VALIDATE_USER_FULFILLED',

  USR_UPDATE_USER: 'USR/UPDATE_USER',
  USR_UPDATE_USER_PENDING: 'USR/UPDATE_USER_PENDING',
  USR_UPDATE_USER_REJECTED: 'USR/UPDATE_USER_REJECTED',
  USR_UPDATE_USER_FULFILLED: 'USR/UPDATE_USER_FULFILLED',

  USR_REGISTER_USER: 'USR/REGISTER_USER',
  USR_REGISTER_USER_PENDING: 'USR/REGISTER_USER_PENDING',
  USR_REGISTER_USER_REJECTED: 'USR/REGISTER_USER_REJECTED',
  USR_REGISTER_USER_FULFILLED: 'USR/REGISTER_USER_FULFILLED',

  USR_CLEAR_USER: 'USR/CLEAR_USER',
};

export const selectors = {
  getUser: (state: ReduxState): User|null => state.user.profile,
  getAdmin: (state: ReduxState): Admin|null => state.user.currentAdmin,

};

export const actions = {
  loginUser: (payload: LoginCredentials): ReduxAction => ({
    type: types.USR_LOGIN_USER,
    payload: API.postRequest('auth/session', { user: payload }),
  }),
  loginAdmin: (payload: LoginCredentials): ReduxAction => ({
    type: types.USER_LOGIN_ADMIN,
    payload: API.postRequest('admin/session', { admin: payload }),
  }),
  logoutUser: (): ReduxAction => ({
    type: types.USR_LOGOUT_USER,
    payload: API.deleteRequest('auth/session'),
  }),
  clearUser: (): ReduxAction => ({
    type: types.USR_CLEAR_USER,
  }),
  registerUser: (payload: LoginCredentials): ReduxAction => ({
    type: types.USR_REGISTER_USER,
    payload: API.postRequest('auth/user', { user: payload }),
  }),
  validateUser: (jwt: string): ReduxAction => ({
    type: types.USR_VALIDATE_USER,
    payload: API.postRequest('auth/validate_jwt', { jwt }),
  }),
  updateUser: (userId:number, payload: any): ReduxAction => ({
    type: types.USR_UPDATE_USER,
    payload: API.putRequest(`intellart/users/${userId}`, { user: payload }),
  }),
};

const logoutUser = (): State => {
  removeItem(localStorageKeys.jwt);
  removeItem(localStorageKeys.isAdmin);

  return {};
};

// const logoutAdmin = (): State => {
//   removeItem('_jwt');
//   removeItem('admin');

//   return {};
// };

const handleSilentLogin = (state: State, payload): State => {
  if (payload.is_admin) {
    return {
      ...state,
      profile: null,
      currentAdmin: payload.user,
    };
  }

  return {
    ...state,
    profile: payload.user,
    currentAdmin: null,
  };
};

export const reducer = (state: State, action: ReduxActionWithPayload): State => {
  switch (action.type) {
    case types.USR_VALIDATE_USER_FULFILLED:

      return handleSilentLogin(state, action.payload);

    case types.USR_LOGIN_USER_FULFILLED:
      toast.success('User successfully logged in!');
      setItem(localStorageKeys.isAdmin, 'false');

      return {
        ...state,
        profile: action.payload,
        currentAdmin: null,
      };

    case types.USER_LOGIN_ADMIN_FULFILLED:
      toast.success('Admin successfully logged in!');
      setItem(localStorageKeys.isAdmin, 'true');

      return {
        ...state,
        ...{
          profile: null,
          currentAdmin: action.payload,
        },
      };

    case types.USR_UPDATE_USER_FULFILLED:
      toast.success('User successfully updated!');

      return {
        ...state,
        profile: action.payload,
      };

    case types.USR_REGISTER_USER_FULFILLED:
      toast.success('Registration successful! Check your email for confirmation.');

      return state;

    case types.USR_LOGOUT_USER_FULFILLED:
      toast.success('User successfully logged out!');

      return logoutUser();

    case types.USR_LOGOUT_USER_REJECTED:
      toast.error('User logout failed!');

      return logoutUser();

    case types.USR_CLEAR_USER:
      return logoutUser();

    default:
      return state || {};
  }
};
