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
  selectedUser: User|null,
  orcidAccount: any,
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

  USR_UPDATE_USER_PASSWORD: 'USR/UPDATE_USER_PASSWORD',
  USR_UPDATE_USER_PASSWORD_PENDING: 'USR/UPDATE_USER_PASSWORD_PENDING',
  USR_UPDATE_USER_PASSWORD_REJECTED: 'USR/UPDATE_USER_PASSWORD_REJECTED',
  USR_UPDATE_USER_PASSWORD_FULFILLED: 'USR/UPDATE_USER_PASSWORD_FULFILLED',

  USR_SELECT_USER: 'USR/SELECT_USER',
  USR_SELECT_USER_PENDING: 'USR/SELECT_USER_PENDING',
  USR_SELECT_USER_REJECTED: 'USR/SELECT_USER_REJECTED',
  USR_SELECT_USER_FULFILLED: 'USR/SELECT_USER_FULFILLED',

  USR_REGISTER_ORCID_USER: 'USR/REGISTER_ORCID_USER',
  USR_REGISTER_ORCID_USER_PENDING: 'USR/REGISTER_ORCID_USER_PENDING',
  USR_REGISTER_ORCID_USER_REJECTED: 'USR/REGISTER_ORCID_USER_REJECTED',
  USR_REGISTER_ORCID_USER_FULFILLED: 'USR/REGISTER_ORCID_USER_FULFILLED',

  USR_CLEAR_USER: 'USR/CLEAR_USER',
};

export const selectors = {
  getUser: (state: ReduxState): User|null => state.user.profile,
  getAdmin: (state: ReduxState): Admin|null => state.user.currentAdmin,
  getSelectedUser: (state: ReduxState): User|null => state.user.selectedUser,
  getOrcidAccount: (state: ReduxState): any => state.user.orcidAccount,

};

export const actions = {
  loginUser: (payload: LoginCredentials): ReduxAction => ({
    type: types.USR_LOGIN_USER,
    payload: API.postRequest('auth/session', { user: payload }),
  }),
  loginORCIDUser: (payload: LoginCredentials): ReduxAction => ({
    type: types.USR_LOGIN_USER,
    payload: API.orcidOAuth('/auth/orcid/session', { orcid: payload }),
  }),
  registerORCIDUser: (payload: any): ReduxAction => ({
    type: types.USR_REGISTER_ORCID_USER,
    payload: API.orcidOAuth('/auth/orcid/user', { orcid: payload }),
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
  updateUserPassword: (userId:number, payload: any): ReduxAction => ({
    type: types.USR_UPDATE_USER_PASSWORD,
    payload: API.putRequest('auth/user/password_update', { password: payload }),
  }),
  selectUser: (userId: number): ReduxAction => ({
    type: types.USR_SELECT_USER,
    payload: API.getRequest(`intellart/users/${userId}`),
  }),
  confirmUser: (confirmationToken: string): ReduxAction => ({
    type: types.USR_SELECT_USER,
    payload: API.getRequest(`intellart/users/confirmation?confirmation_token=${confirmationToken}`),
  }),
};

const logoutUser = (): State => {
  removeItem(localStorageKeys.jwt);
  removeItem(localStorageKeys.isAdmin);

  return {
    profile: null,
    currentAdmin: null,
    selectedUser: null,
    orcidAccount: null,
  };
};

// const logoutAdmin = (): State => {
//   removeItem('_jwt');
//   removeItem('admin');

//   return {};
// };

const handleSilentLogin = (state: State, payload: any): State => {
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
    orcidAccount: null,
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

    case types.USR_LOGIN_USER_REJECTED:

      return state;

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

    case types.USR_REGISTER_ORCID_USER_FULFILLED:
      toast.success('Successfully connected with ORCID!');
      // console.log(action.payload);

      return { ...state, ...{ orcidAccount: action.payload } };

    case types.USR_UPDATE_USER_PASSWORD_FULFILLED:
      toast.success('Password successfully updated!');

      return state;

    case types.USR_UPDATE_USER_PASSWORD_REJECTED:
      toast.error('Password update failed!');

      return state;

    case types.USR_UPDATE_USER_FULFILLED:
      // toast.success('User successfully updated!');

      return {
        ...state,
        profile: action.payload,
      };

    case types.USR_REGISTER_USER_FULFILLED:
      toast.success('Registration successful! Check your email for confirmation.');

      return state;

      // case types.USR_REGISTER_USER_REJECTED:
      //   toast.error('Registration failed!');
      //   console.log(action.payload);

      //   return state;

    case types.USR_LOGOUT_USER_FULFILLED:
      toast.success('User successfully logged out!');

      return logoutUser();

    case types.USR_LOGOUT_USER_REJECTED:
      toast.error('User logout failed!');

      return logoutUser();

    case types.USR_CLEAR_USER:
      return logoutUser();

    case types.USR_SELECT_USER_FULFILLED:
      return {
        ...state,
        selectedUser: action.payload,
      };

    default:
      return state || {};
  }
};
