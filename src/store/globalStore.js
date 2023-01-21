// @flow
import {
  values, every,
} from 'lodash';
import type { ReduxState, ReduxActionWithPayload } from '../types';
import { types as articleTypes } from './articleStore';

type Loading = {
  [string]: string
}

export type State = {
  loading: Loading
};

export const types: Object = {};

export const selectors = {
  checkIsLoading: (state: ReduxState): boolean => !every(values(state.global.loading), (ty) => ty === 'DONE'),
  // checkIsLoading: (state: ReduxState): boolean => get(state.global.loading, [articleTypes.ART_FETCH_ALL_ARTICLES]) === 'DONE',
};

const updateLoading = (state: State, type: string, loadingState: string): State => {
  let key = type;
  key = key.replace('_FULFILLED', '');
  key = key.replace('_REJECTED', '');

  return {
    ...state,
    loading: {
      ...state.loading,
      [key]: loadingState,
    },
  };
};

export const reducer = (state: State, action: ReduxActionWithPayload): State => {
  switch (action.type) {
    // case userTypes.USR_FETCH_ALL_USERS_FULFILLED:
    //   return updateLoading(state, action.type, 'DONE');

    // case userTypes.USR_FETCH_ALL_USERS_REJECTED:
    //   return updateLoading(state, action.type, 'FAIL');

    case articleTypes.ART_FETCH_ALL_ARTICLES_FULFILLED:
      return updateLoading(state, action.type, 'DONE');

    case articleTypes.ART_FETCH_COMMENTS_FULFILLED:
      return updateLoading(state, action.type, 'DONE');

    case articleTypes.ART_FETCH_CATEGORIES_FULFILLED:
      return updateLoading(state, action.type, 'DONE');

    case articleTypes.ART_FETCH_TAGS_FULFILLED:
      return updateLoading(state, action.type, 'DONE');

    default:
      return state || {};
  }
};
