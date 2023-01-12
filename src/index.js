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
import { actions } from './store/userStore';
import { getItem } from './localStorage';

document.title = 'PubWeave';

const _jwt = getItem('_jwt');
if (!isEmpty(_jwt) && _jwt) store.dispatch(actions.validateUser(_jwt));

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
