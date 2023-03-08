/* eslint-disable no-unused-vars */
// @flow
import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import { useDispatch, useSelector } from 'react-redux';
// import MyTable from '../containers/MyTable';
import classNames from 'classnames';
import {
  isEmpty,
  isEqual, join, map, size, split, get,
} from 'lodash';
import { Alert } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/images/pubweave_logo.png';
import { actions, selectors } from '../../store/userStore';
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
  const [username, setUserName] = useState(''); // useState(forAdmin ? 'a@a.com' : 'test@test.com');
  const [password, setPassword] = useState(''); // useState('123456');
  const [fullName, setFullName] = useState('');
  const [orcidId, setOrcidId] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');

  const orcidAccount = useSelector((state) => selectors.getOrcidAccount(state));

  const dispatch = useDispatch();
  const registerUser = (user: any) => dispatch(actions.registerUser(user));
  const registerORCIDUser = (user: any) => dispatch(actions.registerORCIDUser(user));

  useEffect(() => {
    if (!isEmpty(orcidAccount)) {
      setUserName(get(orcidAccount, 'person.emails.email[0].email', ''));
      setFullName(get(orcidAccount, 'person.name.given-names.value', '') + ' ' + get(orcidAccount, 'person.name.family-name.value', ''));
      setOrcidId(get(orcidAccount, 'orcid-identifier.path', ''));
    }
  }, [orcidAccount]);

  const isDisabled = !username || !password || !confirmedPassword || !fullName;

  const handleSubmit = () => {
    if (isDisabled) {
      return;
    }

    // if (password !== confirmedPassword) {
    //   return;
    // }

    const name = fullName.replace(/^[ ]+$/g, '');

    const firstName = split(name, ' ')[0];
    let lastName = '';

    if (size(split(fullName, ' ')) > 1) {
      lastName = join(split(fullName, ' ').slice(1), ' ');
    }

    registerUser({
      email: username,
      password,
      first_name: firstName,
      last_name: lastName,
      orcid_id: orcidId,
    });
  };

  const handleORCIDSubmit = () => {
    window.location.assign(orcidOAuthLink(window.location.pathname));
  };

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');
    if (!isEmpty(code) && code) {
      window.history.replaceState({}, document.title, window.location.pathname);
      console.log('redirect_uri', window.location.origin + window.location.pathname);
      console.log('code', code);

      registerORCIDUser({
        code,
        redirect_uri: window.location.origin + window.location.pathname,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleRegister = () => {
    setUserName('');
    setPassword('');
    setFullName('');
  };

  const checkPasswords = () => [
    { rule: !(password === '' || confirmedPassword === ''), text: "Can't be empty" },
    { rule: isEqual(password, confirmedPassword) && !(password === '' || confirmedPassword === ''), text: 'Password match' },
    { rule: size(password) >= 6, text: 'At least 6 characters' },
    { rule: /\d/g.test(password), text: 'At least 1 number' },
  ];

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
            <h1 className="login-name-title">PubWeave Register</h1>
          </div>
          {!isEmpty(orcidAccount) && (
          <div className="login-email">
            <label htmlFor="full-name" className="login-email-label">
              ORCID ID
            </label>
            <div className='login-email-input-wrapper'>
              <input
                disabled
                type="text"
                placeholder="Your full name"
                className="login-email-input"
                value={orcidId}
              />
            </div>
            <Alert
              severity="success"
              sx={{
                marginTop: '10px',
                padding: '10px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <FontAwesomeIcon icon={faCheck} />
              {' '}
              ORCID account connected
            </Alert>
          </div>
          ) }
          <div className="login-email">
            <label htmlFor="full-name" className="login-email-label">
              Full name
            </label>
            <div className='login-email-input-wrapper'>
              <input
                type="text"
                placeholder="Your full name"
                className="login-email-input"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
              />
            </div>
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

          <div className="login-password">
            <label htmlFor="password" className="login-password-label">
              Confirm Password
            </label>
            <div className='login-password-input-wrapper'>
              <input
                type="password"
                placeholder="Password"
                className="login-password-input"
                value={confirmedPassword}
                onChange={e => setConfirmedPassword(e.target.value)}
              />
            </div>
          </div>

          <Alert
            severity="warning"
            className='login-alert'
            sx={{
              width: '100%',
            }}
          >
            {map(checkPasswords(), (check, index) => (
              <div key={index} className='login-alert-item'>
                <FontAwesomeIcon
                  className='login-alert-item-icon'
                  icon={check.rule ? faCheck : faXmark}
                  style={{
                    color: check.rule ? 'green' : 'red',
                  }}
                />
                {check.text}
              </div>
            ))}
          </Alert>

          {/* <div className="login-forget">
            <a href="/forget" className="login-forget-link">
              Forget Password?
            </a>
          </div> */}
          {!orcidAccount && (
          <button
            onClick={handleORCIDSubmit}
            type="button"
            className={classNames('orcid-login-button')}
          >
            <img src={orcidImg} alt="ORCID Logo" className="orcid-login-image" width="40px" />
            Register with ORCID
          </button>
          ) }

          <button
            onClick={handleSubmit}
            type="button"
            className={classNames('login-button', {
              disabled: isDisabled,
            })}
          >
            Register
          </button>
          <Link
            to="/login"
            onClick={() => toggleRegister()}
            className="login-signup"
          >

            <p className="login-signup-text">
              Login
            </p>

          </Link>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
