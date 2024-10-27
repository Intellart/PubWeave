import { forEach, join, pickBy } from "lodash";

export const envErrors = {
  VITE_API_BASE_URL: null,
  VITE_CARDANO_API_BASE_URL: null,
  VITE_CARDANO_NETWORK_TYPE: ["testnet", "mainnet"],
};

export const envWarnings = {
  VITE_CARDANO_API_VERSION: ["v1"],
  VITE_API_VERSION: ["v1"],
  VITE_ORCID_CLIENT_ID: null,
  VITE_UNSPLASH_ACCESS_KEY: null,
};

export const checkEnvironmentVariables = () => {
  const formatMessage = (
    key: string,
    values: string[] | null
  ) => `Environment variable ${key} is not set.
  Please set it to ${values ? `{ ${join(values, " , ")} }` : "any value"}`;

  forEach(
    pickBy(envErrors, (_values, key) => !import.meta.env[key]),
    (values, key) => {
      throw new Error(formatMessage(key, values));
    }
  );

  forEach(
    pickBy(envWarnings, (_values, key) => !import.meta.env[key]),
    (values, key) => {
      // eslint-disable-next-line no-console
      console.warn(formatMessage(key, values));
    }
  );
};
