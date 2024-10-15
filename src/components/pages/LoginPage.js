// @flow
import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
import { useDispatch } from 'react-redux';
// import MyTable from '../containers/MyTable';
import classNames from 'classnames';
import {
  isEmpty,
} from 'lodash';
import { useNavigate } from 'react-router-dom';
import logoImg from '../../assets/images/pubweave_logo.png';
import { actions } from '../../store/userStore';
import orcidImg from '../../assets/images/orcid_logo.png';
import { orcidOAuthLink } from '../../utils/hooks';

type User = {
  email: string,
  password: string,
  domain: string,
}

type Props = {
  forAdmin?: boolean,
}

function LoginPage({ forAdmin }: Props): Node {
  const navigate = useNavigate();
  const [username, setUserName] = useState(''); // useState(forAdmin ? 'a@a.com' : 'test@test.com');
  const [password, setPassword] = useState(''); // useState('123456');

  const dispatch = useDispatch();
  const loginUser = (user: User) => dispatch(actions.loginUser(user));
  const loginORCIDUser = (user: any) => dispatch(actions.loginORCIDUser(user));
  const loginAdmin = (admin: User) => dispatch(actions.loginAdmin(admin));

  const isDisabled = !username || !password;

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (isDisabled) {
      return;
    }

    if (forAdmin) {
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

  const handleORCIDSubmit = () => {
    window.location.assign(orcidOAuthLink(window.location.pathname));
  };

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');
    if (!isEmpty(code) && code) {
      window.history.replaceState({}, document.title, window.location.pathname);
      // console.log('redirect_uri', window.location.origin + window.location.pathname);
      // console.log('code', code);

      loginORCIDUser({
        code,
        redirect_uri: window.location.origin + window.location.pathname,
      });
    }
  }, []);

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <main className="login-page-wrapper">
      <section className="login-section">
        <div className="login-section-left">
          <h1 className="login-section-left-title">Welcome to PubWeave</h1>
          <p className="login-section-left-text">
            PubWeave is your go-to website for the publishing and hosting of
            your scientific content. From sharing your results in the form of
            blogs to going through paper revisions with your co-authors to the
            hosting of your pre-prints, PubWeave is here for you!
          </p>
        </div>
        <form className="login-wrapper" onSubmit={handleSubmit}>
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
          <button
            type="submit"
            className={classNames('login-button', {
              disabled: isDisabled,
            })}
          >
            {forAdmin ? 'Admin' : null} Login
          </button>
          {!forAdmin && (
            <>
              <button
                onClick={handleORCIDSubmit}
                type="button"
                className={classNames('orcid-login-button')}
              >
                <img src={orcidImg} alt="ORCID Logo" className="orcid-login-image" width="40px" />
                Login with ORCID
              </button>
              <div
                onClick={handleRegister}
                className="login-signup"
              >
                <p className="login-signup-text">
                  Don&apos;t have an account?

                  Sign Up
                </p>

              </div>
            </>
          )}
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
