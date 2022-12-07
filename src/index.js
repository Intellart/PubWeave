// @flow
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import ErrorBoundary from './components/errors/ErrorBoundary';
import App from './components/App';
import { store } from './store';
import './assets/stylesheets/index.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary store={store}>
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
