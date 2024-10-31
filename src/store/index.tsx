import {
  reducer as globalStoreReducer,
  initialGlobalState,
} from "./globalStore";
import {
  initialWalletState,
  reducer as walletReducer,
} from "./cardano/reducer";
import {
  reducer as articleReducer,
  initialArticleState,
} from "./article/reducer";
import { reducer as userReducer, initialUserState } from "./user/reducer";
import { configureStore } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import ErrorMessage from "../components/errors/ErrorMessage";
import { get } from "lodash";
import {
  ReduxAction,
  ReduxActionWithPayload,
  ReduxMiddlewareArgument,
  ReduxState,
} from "../types";
import { isPromise } from "../utils";

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

          toast.error(<ErrorMessage error={e} />);
          // eslint-disable-next-line no-console
          console.error(e);
        });

      return dispatch({ type: `${action.type}_PENDING` });
    }

    return next(action);
  };
}

// Automatically adds the thunk middleware and the Redux DevTools extension
export const store = configureStore<ReduxState, ReduxActionWithPayload, any>({
  reducer: {
    global: globalStoreReducer,
    user: userReducer,
    article: articleReducer,
    wallet: walletReducer,
  },
  preloadedState: {
    global: initialGlobalState,
    user: initialUserState,
    article: initialArticleState,
    wallet: initialWalletState,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      promiseMiddleware
    ),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
