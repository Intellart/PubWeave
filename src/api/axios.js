// @flow
import axios from 'axios';
import {
  get, isEmpty, has,
} from 'lodash';
import { minutesToMilliseconds } from 'date-fns';
import { store } from '../store';
import { actions } from '../store/userStore';
import { localStorageKeys } from '../tokens';

export const requestTimeoutMs = 120000;
export const baseURL: string = get(process.env, 'REACT_APP_API_BASE_URL', 'http://localhost:3000');
export const apiVersion: string = get(process.env, 'REACT_APP_API_VERSION', 'v1');

const apiClient: any = axios.create({
  baseURL,
  timeout: minutesToMilliseconds(1),
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config: any) => {
  const jwt = localStorage.getItem(localStorageKeys.jwt);
  if (!isEmpty(jwt) && jwt) {
    config.headers.Authorization = JSON.parse(jwt);

    return config;
  }

  return config;
}, (error) => Promise.reject(error));

apiClient.interceptors.response.use((response: any) => {
  if (has(response, 'headers.authorization')) {
    const jwt = get(response, 'headers.authorization');
    localStorage.setItem(localStorageKeys.jwt, JSON.stringify(jwt));
  }

  return response;
}, (error) => {
  if (get(error, 'response.status') === 401) {
    store.dispatch(actions.clearUser());
  }

  return Promise.reject(error);
},
);

export default apiClient;
