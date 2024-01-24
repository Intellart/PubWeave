// @flow
import { toast } from 'react-toastify';
import * as API from '../api';
import type { ReduxAction, ReduxActionWithPayload, ReduxState } from '../types';

export type State = {
  tx_id: string,
  signature: string,
  key: string,
  tx_id_fulfilled: string,
};

export const types = {
  WLT_FILL_TREASURY: 'WLT_FILL_TREASURY',
  WLT_FILL_TREASURY_FULFILLED: 'WLT_FILL_TREASURY_FULFILLED',
  WLT_FILL_TREASURY_REJECTED: 'WLT_FILL_TREASURY_REJECTED',
  WLT_FILL_TREASURY_PENDING: 'WLT_FILL_TREASURY_PENDING',

  WLT_SIGN_MESSAGE: 'WLT_SIGN_MESSAGE',

  WLT_SUBMIT_MESSAGE: 'WLT_SUBMIT_MESSAGE',
  WLT_SUBMIT_MESSAGE_FULFILLED: 'WLT_SUBMIT_MESSAGE_FULFILLED',
  WLT_SUBMIT_MESSAGE_REJECTED: 'WLT_SUBMIT_MESSAGE_REJECTED',
  WLT_SUBMIT_MESSAGE_PENDING: 'WLT_SUBMIT_MESSAGE_PENDING',
};

export const selectors = {
  getTxID: (state: ReduxState): string | null => state.wallet.tx_id,
  getSignature: (state: ReduxState): string | null => state.wallet.signature,
  getKey: (state: ReduxState): string | null => state.wallet.key,
  getTxIDFulfilled: (state: ReduxState): string => state.wallet.tx_id_fulfilled,

};

export const actions = {
  fillTreasury: (payload: any): ReduxAction => {
    toast('Filling treasury...', {
      type: toast.TYPE.INFO,
      autoClose: 20000,
      toastId: 'fill-treasury',
    });

    return {
      type: types.WLT_FILL_TREASURY,
      payload: API.postTreasury(payload),
      propagate: {
        articleId: payload.articleId,
      },
    };
  },
  signMessage: (signature: string, key: string): ReduxAction => ({
    type: types.WLT_SIGN_MESSAGE,
    payload: {
      signature,
      key,
    },
  }),
  submitMessage: (signature: string, tx: string): ReduxAction => ({
    type: types.WLT_SUBMIT_MESSAGE,
    payload: API.submitTx({
      tx,
      witness: signature,
    }),
  }),
};

export const reducer = (state: State, action: ReduxActionWithPayload): State => {
  switch (action.type) {
    case types.WLT_SUBMIT_MESSAGE_FULFILLED:
      console.log('WLT_SUBMIT_MESSAGE_FULFILLED');
      toast.update('fill-treasury', {
        type: toast.TYPE.SUCCESS,
        render: 'Message submitted successfully',
      });

      return {
        ...state,
        tx_id_fulfilled: action.payload.tx_id,
      };
    case types.WLT_SIGN_MESSAGE:
      console.log('WLT_SIGN_MESSAGE');
      toast.update('fill-treasury', {
        type: toast.TYPE.INFO,
        progress: 0.6,
        render: 'Message signed successfully',
      });

      return {
        ...state,
        signature: action.payload.signature,
        key: action.payload.key,
      };
    case types.WLT_FILL_TREASURY_FULFILLED:
      toast.update('fill-treasury', {
        type: toast.TYPE.SUCCESS,
        progress: 0.3,
        render: 'Treasury filled successfully',
      });

      console.log('Treasury filled successfully');
      console.log(action.propagate);

      return {
        ...state,
        tx_id: action.payload.tx,
      };

    default:
      return state || {};
  }
};
