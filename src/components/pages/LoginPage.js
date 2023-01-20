// @flow
import React, { useState } from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import { useDispatch } from 'react-redux';
import Footer from '../containers/Footer';
// import MyTable from '../containers/MyTable';
import logoImg from '../../images/LogoPubWeave.png';
import { actions } from '../../store/userStore';

type User = {
  email: string,
  password: string,
  domain: string,
}

function LoginPage(): Node {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const loginUser = (user: User) => dispatch(actions.loginUser(user));

  const handleSubmit = () => {
    loginUser({
      email: username,
      password,
      domain: 'Pubweave',
    });
  };

  return (
    <main className="login-page-wrapper">
      <section className="login-section">
        <div className="login-section-left">
          <h1 className="login-section-left-title">Welcome to the PubWeave</h1>
          <p className="login-section-left-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            malesuada, nisl eget aliquam tincidunt, nunc nisl aliquam lorem, nec
            aliquam nisl nunc vel nisl. Sed malesuada, nisl eget aliquam
          </p>
        </div>
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
      </section>

      <Footer />
    </main>
  );
}

export default LoginPage;
