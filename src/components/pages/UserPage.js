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
import { toast } from 'react-toastify';
import { Alert } from '@mui/material';
import { actions, selectors as userSelectors } from '../../store/userStore';

function UserPage(): Node {
  // const articles = useSelector((state) => articleSelectors.getUsersArticles(state), isEqual);
  const user = useSelector((state) => userSelectors.getUser(state), isEqual);
  const [expandedCard, setExpandedCard] = React.useState(null);
  const [avatarImg, setAvatarImg] = useState(get(user, 'profile_img'));
  const uploadAvatarRef = React.useRef(null);
  const [newPassword, setNewPassword] = useState({
    password: '',
    confirm: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editField, setEditField] = useState({
    fieldName: '',
    fieldValue: '',
  });

  const [editField2, setEditField2] = useState({
    fieldName: '',
    fieldValue: '',
  });

  const [socialMedia, setSocialMedia] = useState({
    facebook: get(user, 'social_fb') || '',
    twitter: get(user, 'social_tw') || '',
    linkedin: get(user, 'social_ln') || '',
    website: get(user, 'social_web') || '',
  });

  useEffect(() => {
    setAvatarImg(get(user, 'profile_img'));
  }, [user]);

  console.log(user);

  const dispatch = useDispatch();
  // const createArticle = (userId : number) => dispatch(actions.createArticle(userId));
  const updateUser = (userId : number, payload:any) => dispatch(actions.updateUser(userId, payload));
  const updateUserPassword = (userId : number, payload:any) => dispatch(actions.updateUserPassword(userId, payload));

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

    setEditField2({
      fieldName: 'username',
      fieldValue: get(user, 'username'),
    });
  };

  const clearEditing = () => {
    setIsEditing(!isEditing);
    setEditField({
      fieldName: '',
      fieldValue: '',
    });
  };

  const changePassword = () => {
    if (newPassword.password !== newPassword.confirm) {
      toast.error('Passwords do not match');

      return;
    }

    if (newPassword.password === '' || newPassword.confirm === '') {
      toast.error('Password cannot be empty');

      return;
    }

    updateUserPassword(get(user, 'id'), { password: newPassword.password });

    setNewPassword({
      password: '',
      confirm: '',
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

    updateUser(get(user, 'id'), { username: editField2.fieldValue });

    clearEditing();
  };

  const updateSocialMedia = () => {
    console.log(socialMedia);
    updateUser(get(user, 'id'), {
      social_fb: socialMedia.facebook,
      social_tw: socialMedia.twitter,
      social_ln: socialMedia.linkedin,
      social_web: socialMedia.website,
    });
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
            {!isEditing && (
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
            )}
            {!isEditing && (
              <div className="user-page-info-text">
                <h1 className="user-page-header-info-name">{get(user, 'full_name')}</h1>
                <p className="user-page-header-info-email">{get(user, 'email')}</p>
                <p
                  className={classNames('user-page-header-info-username', { 'user-page-header-info-username-empty': !get(user, 'username') })}
                >
                  {get(user, 'username') || 'No username'}
                </p>
              </div>
            ) }
            {isEditing && (
            <div className="user-page-editing">
              <p className="user-page-editing-label">
                Full name:
              </p>
              <input
                type="text"
                className="user-page-editing-input"
                value={editField.fieldValue}
                onChange={(e) => setEditField({ ...editField, fieldValue: e.target.value })}
              />
              <p className="user-page-editing-label">
                Email:
              </p>
              <input
                type="text"
                className="user-page-editing-input"
                value={get(user, 'email')}
                onChange={(e) => setEditField({ ...editField, fieldValue: e.target.value })}
              />
              <p className="user-page-editing-label">
                Username:
              </p>
              <input
                type="text"
                placeholder='Enter username'
                className="user-page-editing-input"
                value={editField2.fieldValue}
                onChange={(e) => setEditField2({ ...editField2, fieldValue: e.target.value })}
              />
              <Alert>
                <p className="user-page-header-info-email">Username is used to create a unique URL for your profile. It can be changed later.</p>
              </Alert>
              <div className="user-page-editing-icons">
                <FontAwesomeIcon
                  onClick={() => updateUserName()}
                  className="user-page-info-edit-icon"
                  icon={faCheck}
                />
                <FontAwesomeIcon
                  onClick={() => clearEditing()}
                  className="user-page-info-edit-icon"
                  icon={faXmark}
                />
              </div>
            </div>
            )}

            {!isEditing && (
            <FontAwesomeIcon
              onClick={() => isEditingName()}
              className="user-page-info-edit-icon"
              icon={faPencil}
            />
            )}

          </div>

          <hr />
          <div className="user-page-other-info">
            {!isEditing && get(user, 'username') === '' && (
              <Alert>
                <p className="user-page-header-info-email">You need to set a username in order to comment on the platform.</p>
              </Alert>
            )}
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
                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword.password}
                  onChange={(e) => setNewPassword({ ...newPassword, password: e.target.value })}
                />
              </div>
              <div className="user-page-password-change-input">
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={newPassword.confirm}
                  onChange={(e) => setNewPassword({ ...newPassword, confirm: e.target.value })}
                />
              </div>
              <div
                onClick={changePassword}
                type="button"
                className="user-page-password-change-submit"
              >Change password
              </div>
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
                <input
                  className="user-page-other-info-item-input"
                  type="text"
                  placeholder="Facebook link"
                  value={socialMedia.facebook}
                  onChange={(e) => setSocialMedia({ ...socialMedia, facebook: e.target.value })}
                />
              </div>
              <div className="user-page-other-info-item">
                <p className="user-page-other-info-item-title"><FontAwesomeIcon icon={faTwitter} /> Twitter</p>
                <input
                  className="user-page-other-info-item-input"
                  type="text"
                  placeholder="Twitter link"
                  value={socialMedia.twitter}
                  onChange={(e) => setSocialMedia({ ...socialMedia, twitter: e.target.value })}
                />
              </div>
              <div className="user-page-other-info-item">
                <p className="user-page-other-info-item-title"><FontAwesomeIcon icon={faLinkedin} /> LinkedIn</p>
                <input
                  className="user-page-other-info-item-input"
                  type="text"
                  placeholder="LinkedIn link"
                  value={socialMedia.linkedin}
                  onChange={(e) => setSocialMedia({ ...socialMedia, linkedin: e.target.value })}
                />
              </div>
              <div className="user-page-other-info-item">
                <p className="user-page-other-info-item-title">Personal page</p>
                <input
                  className="user-page-other-info-item-input"
                  type="text"
                  placeholder="Personal page link"
                  value={socialMedia.website}
                  onChange={(e) => setSocialMedia({ ...socialMedia, website: e.target.value })}
                />
              </div>
              <div
                type="button"
                className="user-page-other-info-submit"
                onClick={updateSocialMedia}
              >
                Update social media links
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default UserPage;
