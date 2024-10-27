import { toast } from "react-toastify";
import * as API from "../../api";
import type { ReduxAction } from "../../types";
import { types } from "./types";

const walletActions = {
  fetchTreasury: (articleId: number, showMessage?: boolean): ReduxAction => ({
    type: types.WLT_FETCH_WALLET,
    payload: API.fetchTreasury(articleId),
    propagate: {
      showMessage,
    },
  }),
  buildFill: (payload: any): ReduxAction => {
    toast("Filling treasury...", {
      type: toast.TYPE.INFO,
      autoClose: 20000,
      toastId: "fill-treasury",
    });

    return {
      type: types.WLT_BUILD_FILL_TREASURY,
      payload: API.postTreasury(payload),
      propagate: {
        articleId: payload.articleId,
      },
    };
  },
  buildSpend: (payload: any): ReduxAction => {
    toast("Spending treasury...", {
      type: toast.TYPE.INFO,
      autoClose: 20000,
      toastId: "spend-treasury",
    });

    return {
      type: types.WLT_BUILD_SPEND_TREASURY,
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
  sumbitFill: (signature: string, tx: string, id: number): ReduxAction => ({
    type: types.WLT_SUBMIT_FILL_TREASURY,
    payload: API.submitTx({
      article: {
        tx,
        witness: signature,
        article_id: id,
      },
    }),
  }),
  clearTx: (): ReduxAction => ({
    type: types.WLT_CLEAR_TX,
  }),
  submitSpend: (
    signature: string,
    tx: string,
    id: number,
    ws: string
  ): ReduxAction => ({
    type: types.WLT_SUBMIT_SPEND_TREASURY,
    payload: API.submitSpendTx({
      article: {
        tx,
        witness: signature,
        witness_set: ws,
        article_id: id,
      },
    }),
  }),
};

export default walletActions;
