import { forEach, join, pickBy } from 'lodash';

export const envErrors = {
  REACT_APP_API_BASE_URL: null,
  REACT_APP_CARDANO_NETWORK_TYPE: ['testnet', 'mainnet'],
};

export const envWarnings = {
  REACT_APP_API_VERSION: ['v1'],
  REACT_APP_ORCID_CLIENT_ID: null,
  REACT_APP_UNSPLASH_ACCESS_KEY: null,
};

export const checkEnvironmentVariables = () => {
  const formatMessage = (key, values) => `Environment variable ${key} is not set.
  Please set it to ${values ? `{ ${join(values, ' , ')} }` : 'any value'}`;

  forEach(pickBy(envErrors, (values, key) => !process.env[key]), (values, key) => {
    throw new Error(formatMessage(key, values));
  });

  forEach(pickBy(envWarnings, (values, key) => !process.env[key]), (values, key) => {
    // eslint-disable-next-line no-console
    console.warn(formatMessage(key, values));
  });
};
