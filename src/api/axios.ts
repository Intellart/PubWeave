import axios from "axios";
import { get, isEmpty, has } from "lodash";
import { minutesToMilliseconds } from "date-fns";
// import { toast } from 'react-toastify';
import { store } from "../store/index.tsx";
import { localStorageKeys } from "../tokens";
import { getItem, setItem } from "../localStorage";
import userActions from "../store/user/actions.ts";

const requestTimeoutMs = 120000;
const baseURL: string = get(
  import.meta.env,
  "VITE_API_BASE_URL",
  "http://localhost:3000"
);
const apiVersion: string = get(import.meta.env, "VITE_API_VERSION", "v1");
const baseURLCardano: string = get(
  import.meta.env,
  "VITE_CARDANO_API_BASE_URL",
  "http://127.0.0.1:5000"
);
const apiVersionCardano: string = get(
  import.meta.env,
  "VITE_CARDANO_API_VERSION",
  "v1"
);

const apiClient: any = axios.create({
  baseURL: `${baseURL}/api/${apiVersion}`,
  timeout: minutesToMilliseconds(1),
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Accept: "*/*",
  },
});

export const apiClientCardano: any = axios.create({
  baseURL: `${baseURLCardano}/api/${apiVersionCardano}`,
  timeout: requestTimeoutMs,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Accept: "*/*",
  },
});

apiClient.interceptors.request.use(
  (config: any) => {
    const _jwt = getItem(localStorageKeys.jwt);
    if (!isEmpty(_jwt) && _jwt) {
      // if (config.url === '/api/v1/pubweave/blog_articles/1') {
      //   console.log('\nsending', config.url, config.method);
      // }
      config.headers.Authorization = "Bearer " + _jwt;

      return config;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: any) => {
    // if (response.config.url === '/api/v1/pubweave/blog_articles/1') {
    //   console.log('\nreceived', response.config.url, response.config.method, response.status, response.data);
    // }

    if (has(response, `data.${localStorageKeys.isAdmin}`)) {
      const isAdmin = get(response, `data.${localStorageKeys.isAdmin}`);
      // console.log('response.data', isAdmin);
      setItem(localStorageKeys.isAdmin, isAdmin ? "true" : "false");
    }
    if (has(response, `headers.${localStorageKeys.jwt}`)) {
      const _jwt = get(response, `headers.${localStorageKeys.jwt}`);
      // localStorage.setItem(localStorageKeys.jwt, JSON.stringify(jwt));
      setItem(localStorageKeys.jwt, _jwt);
    }

    return response;
  },
  (error) => {
    if (get(error, "response.status") === 401) {
      store.dispatch(userActions.clearUser());
    }

    return Promise.reject(error);
  }
);

export default apiClient;
