import {
  createStore,
  combineReducers,
  applyMiddleware,
  Middleware,
  Store,
} from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { concat, forEach, get, isString, includes } from "lodash";
import { toast } from "react-toastify";
import { isPromise } from "../utils";

import { reducer as globalStoreReducer } from "./globalStore";
import { reducer as userStoreReducer } from "./user/reducer";
import { reducer as walletReducer } from "./cardano/reducer";
import { reducer as articleReducer } from "./article/reducer";

import { localStorageKeys } from "../tokens";
import { getItem } from "../localStorage";

import type {
  ReduxAction,
  ReduxState,
  ReduxMiddlewareArgument,
  ActionChains,
} from "../types";
import ErrorMessage from "../components/errors/ErrorMessage";
import { articleTypes } from "./article/types";
import { userTypes } from "./user/types";

const ignoreErrors: string[] = [];

const disableSanitizer =
  window.sessionStorage.getItem("disable_sanitizer") === "true";
const sanitizedPayload = "Set REACT_APP_REDUX_SANITIZER=false";
const actionSanitizer = (action: ReduxAction): ReduxAction => {
  if (!action.payload || disableSanitizer) return action;

  const sanitizedActions: string[] = [];

  return includes(sanitizedActions, action.type)
    ? { ...action, payload: sanitizedPayload }
    : action;
};

const stateSanitizer = (state: ReduxState): any => {
  // eslint-disable-next-line no-console
  if (get(import.meta.env, "REACT_APP_REDUX_STATE_LOG", "") === "true")
    console.log(state);
  if (!state || disableSanitizer) return state;

  return {
    ...state,
  };
};

const actionsDenylist = () =>
  get(import.meta.env, "REACT_APP_REDUX_ACTIONS_DENYLIST", "").split(",");

function promiseMiddleware({ dispatch }: ReduxMiddlewareArgument): any {
  return (next: any) => (action: ReduxAction) => {
    if (action.payload && isPromise(action.payload)) {
      action.payload
        .then((payload: any) => {
          if (get(payload, "message")) {
            toast.error(<ErrorMessage error={payload} />);

            // dispatch({ type: action.type + '_REJECTED', payload });
          } else {
            dispatch({
              type: action.type + "_FULFILLED",
              payload,
              propagate: get(action, "propagate", {}),
            });
          }
        })
        .catch((e: any) => {
          const message = get(e, "message") || get(e, "errorMessage");
          const statusCode =
            get(e, "code") ||
            get(e, "errorCode") ||
            get(e, "statusCode") ||
            get(e, "response.status");
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
          // eslint-disable-next-line no-console
          console.error(e);
        });

      return dispatch({ type: `${action.type}_PENDING` });
    }

    return next(action);
  };
}

export function chainActionsMiddleware(chainedActions: ActionChains): any {
  return ({ dispatch }: ReduxMiddlewareArgument) =>
    (next: any) =>
    (action: ReduxAction) => {
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

function dispatchRecorder(dispatchedActions?: Array<string>): any {
  return () => (next: any) => (action: ReduxAction) => {
    if (dispatchedActions && !actionsDenylist().includes(action.type)) {
      dispatchedActions.push(action.type);
    }

    return next(action);
  };
}

const initialReduxState: ReduxState = {
  global: {
    loading: {
      [articleTypes.ART_FETCH_ALL_ARTICLES]: "PENDING",
      [articleTypes.ART_FETCH_CATEGORIES]: "PENDING",
      [articleTypes.ART_FETCH_TAGS]: "PENDING",
      [userTypes.USR_VALIDATE_USER]: getItem(localStorageKeys.jwt)
        ? "PENDING"
        : "DONE",
    },
  },
  user: {
    profile: null,
    currentAdmin: null,
    selectedUser: null,
    orcidAccount: null,
  },
  article: {
    oneArticle: null,
    allArticles: {},
    comments: {},
    categories: {},
    tags: {},
    versions: [],
    reviewers: [],
    reviews: [],
    activeBlock: null,
    activeSections: {},
    blockIdQueue: {
      updated: {},
      created: {},
      deleted: {},
    },
    critical_section_ids: [],
  },
  wallet: {
    tx_id: "",
    signature: "",
    treasury: null,
    tx_id_fulfilled: "",
    witness_set: {},
  },
};

export const configureStore = (
  initialState: {} | ReduxState,
  actionChains?: ActionChains,
  dispatchedActions?: Array<string>
): Store => {
  const middleware: Middleware[] = [thunk];
  if (dispatchedActions) {
    middleware.push(dispatchRecorder(dispatchedActions));
  }
  middleware.push(promiseMiddleware);
  if (actionChains) {
    middleware.push(chainActionsMiddleware(actionChains));
  }

  const sanitizers = get(import.meta.env, "REACT_APP_REDUX_SANITIZER") !==
    "false" && { actionSanitizer, stateSanitizer };

  const composeEnhancers = composeWithDevTools({
    ...sanitizers,
    actionsDenylist: actionsDenylist(),
  });

  const middlewareApplier = composeEnhancers(applyMiddleware(...middleware));

  return createStore(
    combineReducers({
      global: globalStoreReducer,
      user: userStoreReducer,
      article: articleReducer,
      wallet: walletReducer,
    }),
    initialState,
    middlewareApplier
  );
};

export const store = configureStore(initialReduxState);
