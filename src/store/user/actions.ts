import { LoginCredentials, userTypes as types } from "./types";
import * as API from "../../api";
import { ReduxAction } from "../../types";

const userActions = {
  loginUser: (payload: LoginCredentials): ReduxAction => ({
    type: types.USR_LOGIN_USER,
    payload: API.postRequest("auth/session", { user: payload }),
  }),
  loginORCIDUser: (payload: LoginCredentials): ReduxAction => ({
    type: types.USR_LOGIN_USER,
    payload: API.orcidOAuth("/auth/orcid/session", { orcid: payload }),
  }),
  registerORCIDUser: (payload: any): ReduxAction => ({
    type: types.USR_REGISTER_ORCID_USER,
    payload: API.orcidOAuth("/auth/orcid/user", { orcid: payload }),
  }),
  loginAdmin: (payload: LoginCredentials): ReduxAction => ({
    type: types.USER_LOGIN_ADMIN,
    payload: API.postRequest("admin/session", { admin: payload }),
  }),
  logoutUser: (): ReduxAction => ({
    type: types.USR_LOGOUT_USER,
    payload: API.deleteRequest("auth/session"),
  }),
  clearUser: (): ReduxAction => ({
    type: types.USR_CLEAR_USER,
  }),
  registerUser: (payload: LoginCredentials): ReduxAction => ({
    type: types.USR_REGISTER_USER,
    payload: API.postRequest("auth/user", { user: payload }),
  }),
  validateUser: (jwt: string): ReduxAction => ({
    type: types.USR_VALIDATE_USER,
    payload: API.postRequest("auth/validate_jwt", { jwt }),
  }),
  updateUser: (userId: number, payload: any): ReduxAction => ({
    type: types.USR_UPDATE_USER,
    payload: API.putRequest(`intellart/users/${userId}`, { user: payload }),
  }),
  updateUserPassword: (_userId: number, payload: any): ReduxAction => ({
    type: types.USR_UPDATE_USER_PASSWORD,
    payload: API.putRequest("auth/user/password_update", { password: payload }),
  }),
  selectUser: (userId: number): ReduxAction => ({
    type: types.USR_SELECT_USER,
    payload: API.getRequest(`intellart/users/${userId}`),
  }),
};

export default userActions;
