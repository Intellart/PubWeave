// @flow
import React from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import { useDispatch } from 'react-redux';
import Navbar from '../containers/Navbar';
import Footer from '../containers/Footer';
// import MyTable from '../containers/MyTable';

import Login from '../containers/Login';
import { store } from '../../store';
import { actions } from '../../store/userStore';

type User = {
  email: string,
  password: string,
  domain: string,
}

function LoginPage(): Node {
  store.getState();

  const dispatch = useDispatch();
  const loginUser = (user: User) => dispatch(actions.loginUser(user));

  return (
    <main className="login-page-wrapper">
      <Navbar />
      <section className="login-section">
        <div className="login-section-left">
          <h1 className="login-section-left-title">Welcome to the PubWeave</h1>
          <p className="login-section-left-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            malesuada, nisl eget aliquam tincidunt, nunc nisl aliquam lorem, nec
            aliquam nisl nunc vel nisl. Sed malesuada, nisl eget aliquam
          </p>
        </div>
        <Login loginUser={loginUser} />
      </section>

      <Footer />
    </main>
  );
}

export default LoginPage;
