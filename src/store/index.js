// @flow
import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
  concat, forEach, get, isString, includes,
} from 'lodash';
import { toast } from 'react-toastify';
import { isPromise } from '../utils';
import { reducer as globalStoreReducer } from './globalStore';
import { reducer as userStoreReducer } from './userStore';
import ErrorMessage from '../components/errors/ErrorMessage';
import type {
  ReduxAction,
  ReduxState,
  ReduxMiddlewareArgument,
  ActionChains,
} from '../types';

const ignoreErrors = [];

const disableSanitizer = window.sessionStorage.getItem('disable_sanitizer') === 'true';
const sanitizedPayload = 'Set REACT_APP_REDUX_SANITIZER=false';
const actionSanitizer = (action: ReduxAction): ReduxAction => {
  if (!action.payload || disableSanitizer) return action;

  const sanitizedActions = [];

  return includes(sanitizedActions, action.type) ? { ...action, payload: sanitizedPayload } : action;
};

const stateSanitizer = (state: ReduxState): any => {
  // eslint-disable-next-line no-console
  if (get(process.env, 'REACT_APP_REDUX_STATE_LOG', '') === 'true') console.log(state);
  if (!state || disableSanitizer) return state;

  return {
    ...state,
  };
};

const actionsDenylist = () => get(process.env, 'REACT_APP_REDUX_ACTIONS_DENYLIST', '').split(',');

function promiseMiddleware({ dispatch }: ReduxMiddlewareArgument): any {
  return (next) => (action) => {
    if (action.payload && isPromise(action.payload)) {
      action.payload
        .then((payload) => {
          dispatch({ type: action.type + '_FULFILLED', payload });
        })
        .catch((e) => {
          const message = get(e, 'message') || get(e, 'errorMessage');
          const statusCode = get(e, 'code') || get(e, 'errorCode') || get(e, 'statusCode');
          dispatch({
            type: `${action.type}_REJECTED`,
            error: true,
            payload: {
              message,
              statusCode,
            },
          });

          if (includes(ignoreErrors, action.type)) return;

          toast.error(<ErrorMessage error={e} />);
        });

      return dispatch({ type: `${action.type}_PENDING` });
    }

    return next(action);
  };
}

export function chainActionsMiddleware(chainedActions: ActionChains): any {
  return ({ dispatch }: ReduxMiddlewareArgument) => (next) => (action) => {
    let nextActions = chainedActions[action.type];
    if (nextActions) {
      nextActions = concat(nextActions);
      forEach(nextActions, (nextAction) => {
        if (isString(nextAction)) {
          dispatch({ type: nextAction });
        } else {
          dispatch(nextAction(action));
        }
      });
    }

    return next(action);
  };
}

function dispatchRecorder(dispatchedActions: ?Array<string>): any {
  return () => (next) => (action) => {
    if (dispatchedActions && !actionsDenylist().includes(action.type)) {
      dispatchedActions.push(action.type);
    }

    return next(action);
  };
}

export const configureStore = (
  initialState: {} | ReduxState,
  actionChains: ?ActionChains,
  dispatchedActions: ?Array<string>,
): any => {
  const middleware = [thunk];
  if (dispatchedActions) {
    middleware.push(dispatchRecorder(dispatchedActions));
  }
  middleware.push(promiseMiddleware);
  if (actionChains) {
    middleware.push(chainActionsMiddleware(actionChains));
  }

  const sanitizers = get(process.env, 'REACT_APP_REDUX_SANITIZER') !== 'false' && { actionSanitizer, stateSanitizer };
  const composeEnhancers = composeWithDevTools({ ...sanitizers, actionsDenylist: actionsDenylist() });
  const middlewareApplier = composeEnhancers(applyMiddleware(...middleware));

  return createStore(
    combineReducers({
      global: globalStoreReducer,
      user: userStoreReducer,
    }),
    initialState,
    middlewareApplier,
  );
};

const initialReduxState = {};
export const store: any = configureStore(initialReduxState);
