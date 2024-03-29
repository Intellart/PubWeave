// @flow
/* istanbul ignore file */
import type { State as GlobalState } from '../store/globalStore';
import type { State as UserState } from '../store/userStore';

export type ReduxState = {
  user: UserState,
  global: GlobalState,
  article: any,
};

export type BaseReduxAction = {
  type: string,
};

export type PayloadReduxAction = {
  type: string,
  payload: any,
};

export type ReduxAction = {
  type: string,
  payload?: any,
};
export type ReduxActionWithPayload = {
  type: string,
  payload: any,
};

export type ReduxMiddlewareArgument = {
  dispatch: Function,
  getState: () => ReduxState,
};

export type ErrorContent = {
  message: ?string,
  statusCode?: ?(string | number),
  name?: ?string,
};

export type ErrorAction = {
  type: string,
  error: true,
  payload: ErrorContent,
};

type CauseActionType = string;
type NextAction = (() => ReduxAction) | string;

export type ActionChains = {
  [CauseActionType]: Array<NextAction> | NextAction,
};

export type DispatchFn = (BaseReduxAction | PayloadReduxAction) => void;

export type AsyncCallback = (...any) => void;
