// @flow
import { toast } from 'react-toastify';
import { get } from 'lodash';
import * as API from '../api';
import type { ReduxAction, ReduxActionWithPayload, ReduxState } from '../types';

export type TreasuryStatus = 'treasury_empty' | 'no_treasury' | 'treasury_found' | 'error';

export type Treasury = {
  status: TreasuryStatus,
  utxos?: Array<any>,
  balance?: number,
  address?: string,
};

export type State = {
  tx_id: string,
  signature: string,
  tx_id_fulfilled: string,
  treasury: Treasury | null,
};

export const types = {
  WLT_FILL_TREASURY: 'WLT_FILL_TREASURY',
  WLT_FILL_TREASURY_FULFILLED: 'WLT_FILL_TREASURY_FULFILLED',
  WLT_FILL_TREASURY_REJECTED: 'WLT_FILL_TREASURY_REJECTED',
  WLT_FILL_TREASURY_PENDING: 'WLT_FILL_TREASURY_PENDING',

  WLT_SPEND_TREASURY: 'WLT_SPEND_TREASURY',
  WLT_SPEND_TREASURY_FULFILLED: 'WLT_SPEND_TREASURY_FULFILLED',
  WLT_SPEND_TREASURY_REJECTED: 'WLT_SPEND_TREASURY_REJECTED',
  WLT_SPEND_TREASURY_PENDING: 'WLT_SPEND_TREASURY_PENDING',

  WLT_SIGN_MESSAGE: 'WLT_SIGN_MESSAGE',

  WLT_SUBMIT_MESSAGE: 'WLT_SUBMIT_MESSAGE',
  WLT_SUBMIT_MESSAGE_FULFILLED: 'WLT_SUBMIT_MESSAGE_FULFILLED',
  WLT_SUBMIT_MESSAGE_REJECTED: 'WLT_SUBMIT_MESSAGE_REJECTED',
  WLT_SUBMIT_MESSAGE_PENDING: 'WLT_SUBMIT_MESSAGE_PENDING',

  WLT_FETCH_WALLET: 'WLT_FETCH_WALLET',
  WLT_FETCH_WALLET_FULFILLED: 'WLT_FETCH_WALLET_FULFILLED',
  WLT_FETCH_WALLET_REJECTED: 'WLT_FETCH_WALLET_REJECTED',
  WLT_FETCH_WALLET_PENDING: 'WLT_FETCH_WALLET_PENDING',
};

export const selectors = {
  getTxID: (state: ReduxState): string | null => state.wallet.tx_id,
  getSignature: (state: ReduxState): string | null => state.wallet.signature,
  getTxIDFulfilled: (state: ReduxState): string => state.wallet.tx_id_fulfilled,
  getTreasury: (state: ReduxState): Treasury | null => state.wallet.treasury,

};

export const actions = {
  fetchTreasury: (articleId: number, showMessage?: boolean): ReduxAction => ({
    type: types.WLT_FETCH_WALLET,
    payload: API.fetchTreasury(articleId),
    propagate: {
      showMessage,
    },
  }),
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
  spendTreasury: (payload: any): ReduxAction => {
    toast('Spending treasury...', {
      type: toast.TYPE.INFO,
      autoClose: 20000,
      toastId: 'spend-treasury',
    });

    return {
      type: types.WLT_SPEND_TREASURY,
      payload: API.postSpendTreasury(payload),
      propagate: {
        articleId: payload.articleId,
      },
    };
  },
  signMessage: (signature: string): ReduxAction => ({
    type: types.WLT_SIGN_MESSAGE,
    payload: {
      signature,
    },
  }),
  submitMessage: (signature: string, tx: string, id: number): ReduxAction => ({
    type: types.WLT_SUBMIT_MESSAGE,
    payload: API.submitTx({
      article: {
        tx,
        witness: signature,
        article_id: id,
      },
    }),
  }),
  submitSpendMessage: (signature: string, tx: string, id: number): ReduxAction => ({
    type: types.WLT_SUBMIT_MESSAGE,
    payload: API.submitSpendTx({
      article: {
        tx,
        witness: signature,
        article_id: id,
      },
    }),
  }),
};

export const reducer = (state: State, action: ReduxActionWithPayload): State => {
  switch (action.type) {
    case types.WLT_FETCH_WALLET_FULFILLED:
      console.log('WLT_FETCH_WALLET_FULFILLED');
      console.log(action.payload);

      if (get(action.propagate, 'showMessage', false)) {
        const message = {
          treasury_empty: 'Treasury is empty, please wait for a minute and try again.',
          no_treasury: 'No treasury found! Please wait for a minute and try again.',
          treasury_found: 'Treasury info updated! Plese wait for a minute before trying again.',
          error: 'Error fetching treasury! Unexpected error occurred.',
        }[get(action.payload, 'status', 'error')];

        toast(message, {
          type: toast.TYPE.INFO,
          autoClose: 5000,
        });
      }

      return {
        ...state,
        treasury: action.payload,
      };
    case types.WLT_SUBMIT_MESSAGE_FULFILLED:
      console.log('WLT_SUBMIT_MESSAGE_FULFILLED');
      toast.update('fill-treasury', {
        type: toast.TYPE.SUCCESS,
        render: 'Transaction submitted successfully!',
        autoClose: 5000,
        progress: null,
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
        render: 'Transaction signed successfully!',
      });

      return {
        ...state,
        signature: action.payload.signature,
      };
    case types.WLT_FILL_TREASURY_FULFILLED:
      toast.update('fill-treasury', {
        type: toast.TYPE.SUCCESS,
        progress: 0.3,
        render: 'Treasury account created successfully!',
      });

      console.log('Treasury filled successfully');
      console.log(action.propagate);

      return {
        ...state,
        tx_id: action.payload.tx,
      };

    case types.WLT_SPEND_TREASURY_FULFILLED:
      toast.update('fill-treasury', {
        type: toast.TYPE.SUCCESS,
        progress: 0.3,
        render: 'Treasury account created successfully!',
      });

      return {
        ...state,
        tx_id: action.payload.tx,
      };

    default:
      return state || {};
  }
};
