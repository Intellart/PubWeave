import { ReduxState } from "../../types";
import { Treasury } from "./types";

const walletSelectors = {
  getTxID: (state: ReduxState): string | null => state.wallet.tx_id,
  getSignature: (state: ReduxState): string | null => state.wallet.signature,
  getTxIDFulfilled: (state: ReduxState): string => state.wallet.tx_id_fulfilled,
  getTreasury: (state: ReduxState): Treasury | null => state.wallet.treasury,
  getWitnessSet: (state: ReduxState): Treasury | null =>
    state.wallet.witness_set,
};

export default walletSelectors;
