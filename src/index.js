// @flow
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { isEmpty } from 'lodash';
import App from './components/App';
import { store } from './store';
import './assets/stylesheets/index.scss';
import reportWebVitals from './reportWebVitals';
import { actions as userActions } from './store/userStore';
import { getItem } from './localStorage';
import { actions as articleActions } from './store/articleStore';

const _jwt = getItem('_jwt');
if (!isEmpty(_jwt) && _jwt) store.dispatch(userActions.validateUser(_jwt));
store.dispatch(articleActions.fetchAllArticles());
store.dispatch(articleActions.fetchCategories());
store.dispatch(articleActions.fetchComments());

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
