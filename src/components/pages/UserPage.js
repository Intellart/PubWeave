/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
// @flow
import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import { /* useDispatch */ useDispatch, useSelector } from 'react-redux';
import {
  get, isEqual, join, split,
} from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { selectors as articleSelectors, actions } from '../../store/articleStore';
import { faFacebook, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import classNames from 'classnames';
import {
  faCamera, faCheck, faPencil, faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { actions, selectors as userSelectors } from '../../store/userStore';

function UserPage(): Node {
  // const articles = useSelector((state) => articleSelectors.getUsersArticles(state), isEqual);
  const user = useSelector((state) => userSelectors.getUser(state), isEqual);
  const [expandedCard, setExpandedCard] = React.useState(null);
  const [avatarImg, setAvatarImg] = useState(get(user, 'profile_img'));
  const uploadAvatarRef = React.useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editField, setEditField] = useState({
    fieldName: '',
    fieldValue: '',
  });
  const [socialMedia, setSocialMedia] = useState({
    facebook: get(user, 'facebook'),
    twitter: get(user, 'twitter'),
    linkedin: get(user, 'linkedin'),
  });

  useEffect(() => {
    setAvatarImg(get(user, 'profile_img'));
  }, [user]);

  console.log(user);

  const dispatch = useDispatch();
  // const createArticle = (userId : number) => dispatch(actions.createArticle(userId));
  const updateUser = (userId : number, payload:any) => dispatch(actions.updateUser(userId, payload));

  const handleFileChange = (e) => {
    if (!e.target.files) {
      return;
    }

    const file: File = e.target.files[0];

    console.log(e.target.files[0]);

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || '');
    data.append('cloud_name', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || '');

    return fetch(`${process.env.REACT_APP_CLOUDINARY_UPLOAD_URL || ''}${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || ''}/image/upload`, {
      method: 'post',
      body: data,
    }).then((res) => res.json())
      .then((d) => {
        console.log(d);
        updateUser(get(user, 'id'), { profile_img: d.url });
        setAvatarImg(d.url);
      }).catch((err) => console.log(err));
  };

  const uploadAvatar = () => {
    uploadAvatarRef.current?.click();
  };

  const isEditingName = () => {
    setIsEditing(!isEditing);

    setEditField({
      fieldName: 'full_name',
      fieldValue: get(user, 'full_name'),
    });
  };

  const clearEditing = () => {
    setIsEditing(!isEditing);
    setEditField({
      fieldName: '',
      fieldValue: '',
    });
  };

  const updateUserName = () => {
    if (editField.fieldValue === '') {
      return;
    }

    const firstName = split(editField.fieldValue, ' ')[0];

    updateUser(get(user, 'id'), { first_name: firstName });

    if (split(editField.fieldValue, ' ').length > 1) {
      const lastName = join(split(editField.fieldValue, ' ').slice(1), ' ');
      updateUser(get(user, 'id'), { last_name: lastName });
    }

    clearEditing();
  };

  return (
    <main className="user-page-wrapper">
      <div className="user-page-wrapper-left">
        <section className='user-page-hero'>
          <div className="user-page-header">
            <p className='user-page-header-title'>User info</p>
          </div>
          <div className="user-page-info">
            <input
              type="file"
              ref={uploadAvatarRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <div
              className="user-page-info-avatar"
              onClick={uploadAvatar}
            >
              <FontAwesomeIcon
                className="icon"
                icon={faCamera}
              />
              {avatarImg && <img src={avatarImg} alt="avatar" /> }
            </div>
            {!isEditing ? (
              <div className="user-page-info-text">
                <h1 className="user-page-header-info-name">{get(user, 'full_name')}</h1>
                <p className="user-page-header-info-email">{get(user, 'email')}</p>
              </div>
            )
              : (
                <div className="user-page-info-text">
                  <input
                    type="text"
                    className="user-page-header-info-name user-page-header-info-name-edit"
                    value={editField.fieldValue}
                    onChange={(e) => setEditField({ ...editField, fieldValue: e.target.value })}
                  />
                  <p className="user-page-header-info-email">{get(user, 'email')}</p>
                </div>
              )}

            {!isEditing && (
            <FontAwesomeIcon
              onClick={() => isEditingName()}
              className="user-page-info-edit-icon"
              icon={faPencil}
            />
            )}
            {isEditing && (
            <FontAwesomeIcon
              onClick={() => updateUserName()}
              className="user-page-info-edit-icon"
              icon={faCheck}
            />
            )
            }
            {isEditing && (
            <FontAwesomeIcon
              onClick={() => clearEditing()}
              className="user-page-info-edit-icon"
              icon={faXmark}
            />
            )
            }

          </div>

          <hr />
          <div className="user-page-other-info">
            <div className="user-page-other-info-item">
              <p className="user-page-other-info-item-title">ORCID</p>
              <p className="user-page-other-info-item-value">{get(user, 'orcid_id')}</p>
            </div>
            <div className="user-page-other-info-item">
              <p className="user-page-other-info-item-title">Created at</p>
              <p className="user-page-other-info-item-value">{new Date(get(user, 'created_at')).toLocaleDateString()}</p>
            </div>
            <div className="user-page-other-info-item">
              <p className="user-page-other-info-item-title">Last updated</p>
              <p className="user-page-other-info-item-value">{new Date(get(user, 'updated_at')).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="user-page-content" />
        </section>
      </div>
      <div className="user-page-wrapper-right">
        <section className={classNames('user-page-hero', { 'user-page-hero-expanded': expandedCard === 'user-page-hero-1' })}>
          <div
            className="user-page-header"
            onClick={() => setExpandedCard(expandedCard === 'user-page-hero-1' ? null : 'user-page-hero-1')}
          >
            <p className='user-page-header-title'>Statistics</p>
          </div>
          <div className="user-page-hidden-content">
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
          </div>
        </section>
        <section className={classNames('user-page-hero', { 'user-page-hero-expanded': expandedCard === 'user-page-hero-2' })}>
          <div
            className="user-page-header"
            onClick={() => setExpandedCard(expandedCard === 'user-page-hero-2' ? null : 'user-page-hero-2')}
          >
            <p className='user-page-header-title'>Change password</p>
          </div>
          <div className="user-page-hidden-content">
            <div className="user-page-password-change">
              <div className="user-page-password-change-input">
                <input type="password" placeholder="New password" />
              </div>
              <div className="user-page-password-change-input">
                <input type="password" placeholder="Confirm new password" />
              </div>
              <div type="button" className="user-page-password-change-submit">Change password</div>
            </div>
          </div>
        </section>
        <section className={classNames('user-page-hero', { 'user-page-hero-expanded': expandedCard === 'user-page-hero-3' })}>
          <div
            className="user-page-header"
            onClick={() => setExpandedCard(expandedCard === 'user-page-hero-3' ? null : 'user-page-hero-3')}
          >
            <p className='user-page-header-title'>Social links</p>
          </div>
          <div className="user-page-hidden-content">
            <div className="user-page-other-info">
              <div className="user-page-other-info-item">
                <p className="user-page-other-info-item-title"><FontAwesomeIcon icon={faFacebook} /> Facebook</p>
                <input className="user-page-other-info-item-input" type="text" placeholder="Facebook link" />
              </div>
              <div className="user-page-other-info-item">
                <p className="user-page-other-info-item-title"><FontAwesomeIcon icon={faTwitter} /> Twitter</p>
                <input className="user-page-other-info-item-input" type="text" placeholder="Twitter link" />
              </div>
              <div className="user-page-other-info-item">
                <p className="user-page-other-info-item-title"><FontAwesomeIcon icon={faLinkedin} /> LinkedIn</p>
                <input className="user-page-other-info-item-input" type="text" placeholder="LinkedIn link" />
              </div>
              <div className="user-page-other-info-item">
                <p className="user-page-other-info-item-title">Personal page</p>
                <input className="user-page-other-info-item-input" type="text" placeholder="Personal page link" />
              </div>
              <div type="button" className="user-page-password-change-submit">Change password</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default UserPage;
