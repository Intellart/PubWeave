import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/stylesheets/index.scss";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { localStorageKeys } from "./tokens/index.ts";
import { getItem } from "./localStorage.ts";
import { isEmpty } from "lodash";
import App from "./components/App.tsx";
import { store } from "./store";
import articleActions from "./store/article/actions.ts";
import userActions from "./store/user/actions.ts";
import { ReduxActionWithPayload } from "./types/index.ts";

const _jwt = getItem(localStorageKeys.jwt);
if (!isEmpty(_jwt) && _jwt)
  store.dispatch(userActions.validateUser(_jwt) as ReduxActionWithPayload);

store.dispatch(articleActions.fetchAllArticles() as ReduxActionWithPayload);
store.dispatch(articleActions.fetchCategories() as ReduxActionWithPayload);
store.dispatch(articleActions.fetchTags() as ReduxActionWithPayload);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <StrictMode>
        <App />
      </StrictMode>
    </BrowserRouter>
  </Provider>
);
