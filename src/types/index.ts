/* istanbul ignore file */
import type { State as GlobalState } from "../store/globalStore";
import { ArticleState } from "../store/article/types";
import { WalletState } from "../store/cardano/types";
import { UserState } from "../store/user/types";
import { Action } from "@reduxjs/toolkit";

export type ReduxState = {
  user: UserState;
  global: GlobalState;
  article: ArticleState;
  wallet: WalletState;
};

export type BaseReduxAction = {
  type: string;
};

export type PayloadReduxAction = {
  type: string;
  payload: any;
};

export type ReduxAction = Action & {
  payload?: any;
  propagate?: any;
};

export type ReduxActionWithPayload = Action & {
  payload: any;
  propagate?: any;
};

export type ReduxMiddlewareArgument = {
  dispatch: Function;
  getState: () => ReduxState;
};

export type ErrorContent = {
  message?: string;
  statusCode?: string | number;
  name?: string;
};

export type ErrorAction = {
  type: string;
  error: true;
  payload: ErrorContent;
};

type CauseActionType = string;

type NextAction = (() => ReduxAction) | string;

export type ActionChains = {
  [key: CauseActionType]: Array<NextAction> | NextAction;
};

export type DispatchFn = (key: BaseReduxAction | PayloadReduxAction) => void;

export type AsyncCallback = (key: any) => void;

export type BasicOption = {
  label: string;
  value: number | string;
};
