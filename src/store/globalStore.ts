import { values, every } from "lodash";
import type { ReduxActionWithPayload, ReduxState } from "../types";
import { userTypes } from "./user/types";
import { articleTypes } from "./article/types";
import { Reducer } from "@reduxjs/toolkit";
import { getItem } from "../localStorage";
import { localStorageKeys } from "../tokens";

type Loading = {
  [key: string]: string;
};

export type State = {
  loading: Loading;
};

export const types: Object = {};

export const selectors = {
  checkIsLoading: (state: ReduxState): boolean =>
    !every(values(state.global.loading), (ty) => ty === "DONE"),
  // checkIsLoading: (state: ReduxState): boolean => get(state.global.loading, [articleTypes.ART_FETCH_ALL_ARTICLES]) === 'DONE',
};

const updateLoading = (
  state: State | undefined,
  type: string,
  loadingState: string
): State => {
  let key = type;
  key = key.replace("_FULFILLED", "");
  key = key.replace("_REJECTED", "");

  return {
    ...state,
    loading: {
      ...state?.loading,
      [key]: loadingState,
    },
  };
};

export const initialGlobalState: State = {
  loading: {
    [articleTypes.ART_FETCH_ALL_ARTICLES]: "PENDING",
    [articleTypes.ART_FETCH_CATEGORIES]: "PENDING",
    [articleTypes.ART_FETCH_TAGS]: "PENDING",
    [userTypes.USR_VALIDATE_USER]: getItem(localStorageKeys.jwt)
      ? "PENDING"
      : "DONE",
  },
};

export const reducer: Reducer<State, ReduxActionWithPayload> = (
  state,
  action
) => {
  switch (action.type) {
    // case userTypes.USR_FETCH_ALL_USERS_FULFILLED:
    //   return updateLoading(state, action.type, 'DONE');

    // case userTypes.USR_FETCH_ALL_USERS_REJECTED:
    //   return updateLoading(state, action.type, 'FAIL');

    case userTypes.USR_VALIDATE_USER_FULFILLED:
      return updateLoading(state, action.type, "DONE");

    case userTypes.USR_VALIDATE_USER_REJECTED:
      return updateLoading(state, action.type, "DONE");

    case articleTypes.ART_FETCH_ALL_ARTICLES_FULFILLED:
      return updateLoading(state, action.type, "DONE");

    case articleTypes.ART_FETCH_CATEGORIES_FULFILLED:
      return updateLoading(state, action.type, "DONE");

    case articleTypes.ART_FETCH_TAGS_FULFILLED:
      return updateLoading(state, action.type, "DONE");

    default:
      return state || { loading: {} };
  }
};
