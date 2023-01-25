/* eslint-disable no-console */
// @flow
import React from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import { /* useDispatch */ useSelector } from 'react-redux';
import { get, isEqual } from 'lodash';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Footer from '../containers/Footer';
// import { selectors as articleSelectors, actions } from '../../store/articleStore';
import { selectors as userSelectors } from '../../store/userStore';

function UserPage(): Node {
  // const articles = useSelector((state) => articleSelectors.getUsersArticles(state), isEqual);
  const user = useSelector((state) => userSelectors.getUser(state), isEqual);

  console.log(user);

  // const dispatch = useDispatch();
  // const createArticle = (userId : number) => dispatch(actions.createArticle(userId));
  // const deleteArticle = (id) => dispatch(actions.deleteArticle(id));

  return (
    <main className="user-page-wrapper">
      <div className="user-page">
        <div className="user-page-wrapper-left">
          <section className='user-page-hero'>
            <div className="user-page-header">
              <p className='user-page-header-title'>User info</p>
            </div>
            <div className="user-page-info">
              <div className="user-page-info-avatar">
                <FontAwesomeIcon icon={faUserCircle} />
              </div>
              <div className="user-page-info-text">
                <h1 className="user-page-header-info-name">{get(user, 'name')}</h1>
                <p className="user-page-header-info-email">{get(user, 'email')}</p>
              </div>
            </div>

            <hr />
            <div className="user-page-other-info">
              <div className="user-page-other-info-item">
                <p className="user-page-other-info-item-title">First name</p>
                <p className="user-page-other-info-item-value">{get(user, 'first_name')}</p>
              </div>
              <div className="user-page-other-info-item">
                <p className="user-page-other-info-item-title">Last name</p>
                <p className="user-page-other-info-item-value">{get(user, 'last_name')}</p>
              </div>

              <div className="user-page-other-info-item">
                <p className="user-page-other-info-item-title">ORCID</p>
                <p className="user-page-other-info-item-value">0</p>
              </div>
            </div>
            <div className="user-page-content" />
          </section>
          <section className='user-page-hero'>
            <div className="user-page-header">
              <p className='user-page-header-title'>Change password</p>
            </div>
            <div className="user-page-password-change">
              <div className="user-page-password-change-input">
                <input type="password" placeholder="New password" />
              </div>
              <div className="user-page-password-change-input">
                <input type="password" placeholder="Confirm new password" />
              </div>
              <div type="button" className="user-page-password-change-submit">Change password</div>
            </div>
          </section>
        </div>
        <div className="user-page-wrapper-right">
          <section className='user-page-hero'>
            <div className="user-page-header">
              <p className='user-page-header-title'>Statistics</p>
            </div>
            <div className="user-page-other-info">
              <div className="user-page-other-info-item">
                <p className="user-page-other-info-item-title">Articles</p>
                <p className="user-page-other-info-item-value">0</p>
              </div>
              <div className="user-page-other-info-item">
                <p className="user-page-other-info-item-title">Likes</p>
                <p className="user-page-other-info-item-value">0</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default UserPage;
