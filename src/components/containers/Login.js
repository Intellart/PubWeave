/* eslint-disable react/no-unused-prop-types */
// @flow
import React, { useState } from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import logoImg from '../../images/LogoPubWeave.png';

type Props = {
  setToken: (token: any) => void,
};

function Login(props: Props): Node {
  // eslint-disable-next-line no-unused-vars
  const { setToken } = props;
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = () => {
    props.setToken({ token: username });
  };

  return (
    <div className="login-wrapper">
      <div className="login-image-wrapper">
        <img src={logoImg} alt="PubWeave Logo" className="login-image" width="40px" />
      </div>
      <div className="login-name">
        <h1 className="login-name-title">PubWeave</h1>
      </div>
      <div className="login-email">
        <label htmlFor="email" className="login-email-label">
          Email
        </label>
        <div className='login-email-input-wrapper'>
          <input
            type="email"
            placeholder="Email"
            className="login-email-input"
            value={username}
            onChange={e => setUserName(e.target.value)}
          />
        </div>
      </div>
      <div className="login-password">
        <label htmlFor="password" className="login-password-label">
          Password
        </label>
        <div className='login-password-input-wrapper'>
          <input
            type="password"
            placeholder="Password"
            className="login-password-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
      </div>
      <div className="login-forget">
        <a href="/forget" className="login-forget-link">
          Forget Password?
        </a>
      </div>
      <button
        onClick={handleSubmit}
        type="button"
        className="login-button"
      >
        Login
      </button>
      <div className="login-signup">
        <p className="login-signup__text">
          Don&apos;t have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
