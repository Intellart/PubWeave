import { ReduxState } from "../../types";
import { Admin, User } from "./types";

const userSelectors = {
  getUser: (state: ReduxState): User | null => state.user.profile,
  getAdmin: (state: ReduxState): Admin | null => state.user.currentAdmin,
  getSelectedUser: (state: ReduxState): User | null => state.user.selectedUser,
  getOrcidAccount: (state: ReduxState): any => state.user.orcidAccount,
};
export default userSelectors;
