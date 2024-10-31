import { get } from "lodash";
import { ReduxActionWithPayload } from "../../types";
import { WalletState, types } from "./types";
import { toast } from "react-toastify";
import { Reducer } from "@reduxjs/toolkit";

export const initialWalletState: WalletState = {
  tx_id: "",
  signature: "",
  treasury: null,
  tx_id_fulfilled: "",
  witness_set: {},
};

export const reducer: Reducer<WalletState, ReduxActionWithPayload> = (
  state,
  action
) => {
  if (!state) return initialWalletState;
  switch (action.type) {
    case types.WLT_CLEAR_TX:
      return {
        ...state,
        tx_id: "",
        signature: "",
        tx_id_fulfilled: "",
        witness_set: "",
      };
    case types.WLT_FETCH_WALLET_FULFILLED:
      console.log("WLT_FETCH_WALLET_FULFILLED");
      console.log(action.payload);

      if (get(action.propagate, "showMessage", false)) {
        const message = get(
          {
            treasury_empty:
              "Treasury is empty, please wait for a minute and try again.",
            no_treasury:
              "No treasury found! Please wait for a minute and try again.",
            treasury_found:
              "Treasury info updated! Plese wait for a minute before trying again.",
            error: "Error fetching treasury! Unexpected error occurred.",
          },
          get(action.payload, "status", "error")
        );

        toast(message, {
          type: toast.TYPE.INFO,
          autoClose: 5000,
        });
      }

      return {
        ...state,
        treasury: action.payload,
      };
    case types.WLT_SUBMIT_FILL_TREASURY_FULFILLED:
    case types.WLT_SUBMIT_SPEND_TREASURY_FULFILLED:
      console.log("WLT_SUBMIT_MESSAGE_FULFILLED");
      toast.update("fill-treasury", {
        type: toast.TYPE.SUCCESS,
        render: "Transaction submitted successfully!",
        autoClose: 5000,
        progress: null,
      });

      return {
        ...state,
        tx_id_fulfilled: action.payload.tx_id,
      };
    case types.WLT_SIGN_MESSAGE:
      console.log("WLT_SIGN_MESSAGE");
      toast.update("fill-treasury", {
        type: toast.TYPE.INFO,
        progress: 0.6,
        render: "Transaction signed successfully!",
      });

      return {
        ...state,
        signature: action.payload.signature,
      };
    case types.WLT_BUILD_FILL_TREASURY_FULFILLED:
      toast.update("fill-treasury", {
        type: toast.TYPE.SUCCESS,
        progress: 0.3,
        render: "Treasury account created successfully!",
      });

      console.log("Treasury filled successfully");
      console.log(action.propagate);

      return {
        ...state,
        tx_id: action.payload.tx,
      };

    case types.WLT_BUILD_SPEND_TREASURY_FULFILLED:
      toast.update("fill-treasury", {
        type: toast.TYPE.SUCCESS,
        progress: 0.3,
        render: "Treasury account created successfully!",
      });

      return {
        ...state,
        tx_id: action.payload.tx,
        witness_set: action.payload.witness_set,
      };

    default:
      return state || {};
  }
};
