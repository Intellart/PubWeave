// @flow
import React, { useState } from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import { useDispatch } from 'react-redux';
// import MyTable from '../containers/MyTable';
import logoImg from '../../images/LogoPubWeave.png';
import { actions } from '../../store/userStore';

type User = {
  email: string,
  password: string,
  domain: string,
}

type Props = {
  forAdmin?: boolean,
}

function LoginPage({ forAdmin }: Props): Node {
  const [username, setUserName] = useState(forAdmin ? 'a@a.com' : 'test@test.com');
  const [password, setPassword] = useState('123456');
  const [confirmedPassword, setConfirmedPassword] = useState('');

  const [register, setRegister] = useState(false);

  const dispatch = useDispatch();
  const loginUser = (user: User) => dispatch(actions.loginUser(user));
  const loginAdmin = (admin: User) => dispatch(actions.loginAdmin(admin));
  const registerUser = (user: User) => dispatch(actions.loginUser(user));

  const handleSubmit = () => {
    if (!username || !password) {
      return;
    }

    if (register) {
      if (password !== confirmedPassword) {
        return;
      }

      registerUser({
        email: username,
        password,
        domain: 'Pubweave',
      });
    } else if (forAdmin) {
      loginAdmin({
        email: username,
        password,
        domain: 'Pubweave',
      });
    } else {
      loginUser({
        email: username,
        password,
        domain: 'Pubweave',
      });
    }
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
            <h1 className="login-name-title">PubWeave {forAdmin ? 'Admin' : ''} Login</h1>
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
          {register && (
          <div className="login-password">
            <label htmlFor="password" className="login-password-label">
              Confirm Password
            </label>
            <div className='login-password-input-wrapper'>
              <input
                type="password"
                placeholder="Password"
                className="login-password-input"
                value={password}
                onChange={e => setConfirmedPassword(e.target.value)}
              />
            </div>
          </div>
          ) }
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
            {register && 'Register'}
            {forAdmin && !register && 'Admin Login'}
            {!forAdmin && !register && 'Login'}
          </button>
          {!forAdmin && (
          <div
            onClick={() => setRegister(!register)}
            className="login-signup"
          >
            {!register
              ? (
                <p className="login-signup-text">
                  Don&apos;t have an account?

                  Sign Up
                </p>
              ) : (
                <p className="login-signup-text">
                  Sign in
                </p>
              )}

          </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
