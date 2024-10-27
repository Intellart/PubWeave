export const isProdEnv = import.meta.env.NODE_ENV === "production";
export const isDevelopment = import.meta.env.NODE_ENV === "development";

export const localStorageKeys = {
  jwt: "_jwt",
  isAdmin: "is_admin",
};
