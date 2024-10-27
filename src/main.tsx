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

const _jwt = getItem(localStorageKeys.jwt);
if (!isEmpty(_jwt) && _jwt) store.dispatch(userActions.validateUser(_jwt));

store.dispatch(articleActions.fetchAllArticles());
store.dispatch(articleActions.fetchCategories());
store.dispatch(articleActions.fetchTags());

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <StrictMode>
        <App />
      </StrictMode>
    </BrowserRouter>
  </Provider>
);
