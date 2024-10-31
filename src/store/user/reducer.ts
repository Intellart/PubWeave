import { toast } from "react-toastify";
import type { ReduxActionWithPayload } from "../../types";
import { setItem, removeItem } from "../../localStorage";
import { localStorageKeys } from "../../tokens";
import { UserState, userTypes as types } from "./types";
import { Reducer } from "redux";

const logoutUser = (): UserState => {
  removeItem(localStorageKeys.jwt);
  removeItem(localStorageKeys.isAdmin);

  return {
    profile: null,
    currentAdmin: null,
    selectedUser: null,
    orcidAccount: null,
  };
};

export const initialUserState: UserState = {
  profile: null,
  currentAdmin: null,
  selectedUser: null,
  orcidAccount: null,
};

const handleSilentLogin = (
  state: UserState | undefined,
  payload: any
): UserState => {
  if (!state) return initialUserState;

  if (payload.is_admin) {
    return {
      ...state,
      profile: null,
      currentAdmin: payload.user,
    };
  }

  return {
    ...state,
    profile: payload.user,
    currentAdmin: null,
    orcidAccount: null,
  };
};

export const reducer: Reducer<UserState, ReduxActionWithPayload> = (
  state,
  action
) => {
  if (!state) return initialUserState;

  switch (action.type) {
    case types.USR_VALIDATE_USER_FULFILLED:
      return handleSilentLogin(state, action.payload);

    case types.USR_LOGIN_USER_FULFILLED:
      toast.success("You successfully logged in!");
      setItem(localStorageKeys.isAdmin, "false");

      return {
        ...state,
        profile: action.payload,
        currentAdmin: null,
      };

    case types.USR_LOGIN_USER_REJECTED:
      return state;

    case types.USER_LOGIN_ADMIN_FULFILLED:
      toast.success("Admin successfully logged in!");
      setItem(localStorageKeys.isAdmin, "true");

      return {
        ...state,
        profile: null,
        currentAdmin: action.payload,
      };

    case types.USR_REGISTER_ORCID_USER_FULFILLED:
      toast.success("Successfully connected with ORCID!");
      // console.log(action.payload);

      return { ...state, ...{ orcidAccount: action.payload } };

    case types.USR_UPDATE_USER_PASSWORD_FULFILLED:
      toast.success("Password successfully updated!");

      return state;

    case types.USR_UPDATE_USER_PASSWORD_REJECTED:
      toast.error("Password update failed!");

      return state;

    case types.USR_UPDATE_USER_FULFILLED:
      toast.success("User successfully updated!");

      return {
        ...state,
        profile: action.payload,
      };

    case types.USR_REGISTER_USER_FULFILLED:
      toast.success(
        "Registration successful! Check your email for confirmation."
      );

      return state;

    // case types.USR_REGISTER_USER_REJECTED:
    //   toast.error('Registration failed!');
    //   console.log(action.payload);

    //   return state;

    case types.USR_LOGOUT_USER_FULFILLED:
      toast.success("User successfully logged out!");

      return logoutUser();

    case types.USR_LOGOUT_USER_REJECTED:
      toast.error("User logout failed!");

      return logoutUser();

    case types.USR_CLEAR_USER:
      return logoutUser();

    case types.USR_SELECT_USER_FULFILLED:
      return {
        ...state,
        selectedUser: action.payload,
      };

    default:
      return state;
  }
};
