/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
// @flow
import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import { /* useDispatch */ useDispatch, useSelector } from 'react-redux';
import {
  get, includes, isEqual, join, split,
  map,
  mapValues,
  filter,
  every,
  size,
} from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { selectors as articleSelectors, actions } from '../../store/articleStore';
import { faFacebook, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import classNames from 'classnames';
import {
  faCamera, faCheck, faCircleCheck, faCircleXmark, faPencil, faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { Alert } from '@mui/material';
import { actions, selectors as userSelectors } from '../../store/userStore';
import {
  emailChecks,
  nameChecks,
  regex,
  uploadImage,
  usernameChecks,
} from '../../utils/hooks';

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
  const [editFields, setEditFields] = useState({
    name: '',
    email: '',
    username: '',
  });

  const [socialMedia, setSocialMedia] = useState({
    facebook: get(user, 'social_fb') || '',
    twitter: get(user, 'social_tw') || '',
    linkedin: get(user, 'social_ln') || '',
    website: get(user, 'social_web') || '',
  });

  useEffect(() => {
    setAvatarImg(get(user, 'profile_img'));
    setSocialMedia({
      facebook: get(user, 'social_fb') || '',
      twitter: get(user, 'social_tw') || '',
      linkedin: get(user, 'social_ln') || '',
      website: get(user, 'social_web') || '',
    });

    setEditFields({
      name: get(user, 'full_name'),
      email: get(user, 'email'),
      username: get(user, 'username') || '',
    });
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

    uploadImage(file).then((url) => {
      console.log('upl img', url);
      updateUser(get(user, 'id'), { profile_img: url });
      setAvatarImg(url);
    });
  };

  const uploadAvatar = () => {
    uploadAvatarRef.current?.click();
  };

  const isEditingName = () => {
    setIsEditing(!isEditing);

    setEditFields({
      name: get(user, 'full_name'),
      email: get(user, 'email'),
      username: get(user, 'username') || '',
    });
  };

  const clearEditing = () => {
    setIsEditing(!isEditing);
    setEditFields({
      name: get(user, 'full_name'),
      email: get(user, 'email'),
      username: get(user, 'username') || '',
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

  const updateUserFields = () => {
    if (isEqual(editFields, {
      name: get(user, 'full_name'),
      email: get(user, 'email'),
      username: get(user, 'username'),
    })) {
      return;
    }

    const firstName = split(editFields.name, ' ')[0];

    updateUser(get(user, 'id'), { first_name: firstName });

    if (split(editFields.name, ' ').length > 1) {
      const lastName = join(split(editFields.name, ' ').slice(1), ' ');
      updateUser(get(user, 'id'), { last_name: lastName });
    }

    updateUser(get(user, 'id'), { username: editFields.username });

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

  const usernameOK = every(usernameChecks, (check) => check.check(editFields.username));
  const emailOK = every(emailChecks, (check) => check.check(editFields.email));
  const nameOK = every(nameChecks, (check) => check.check(editFields.name));

  const isUsernameSame = editFields.username === get(user, 'username');
  const isEmailSame = editFields.email === get(user, 'email');
  const isNameSame = editFields.name === get(user, 'full_name');

  const isOK = (!isUsernameSame || !isEmailSame || !isNameSame) && usernameOK && emailOK && nameOK;

  const renderChecks = (checks, value) => map(filter(checks, (check) => !check.check(value)), (check, index) => (
    <p key={index}>{check.info}</p>
  ));

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
                  className={classNames('user-page-header-info-username')}
                >
                  {get(user, 'username') || 'No username'}
                </p>
              </div>
            )}
            {isEditing && (
            <div className="user-page-editing">
              <p className="user-page-editing-label">
                Full name:
              </p>
              <div className="user-name-editing-input-wrapper">
                <input
                  type="text"
                  className="user-page-editing-input"
                  value={editFields.name}
                  onChange={(e) => setEditFields({ ...editFields, name: e.target.value })}
                />
                <div className="user-page-editing-input-checks-wrapper">
                  <FontAwesomeIcon
                    className={classNames('user-page-editing-input-icon')}
                    icon={nameOK ? faCircleCheck : faCircleXmark}
                    // eslint-disable-next-line no-nested-ternary
                    style={{ color: isNameSame ? 'grey' : nameOK ? 'green' : 'red' }}
                  />
                  {!nameOK && (
                  <div className="user-page-editing-input-checks">
                    {renderChecks(nameChecks, editFields.name)}
                  </div>
                  ) }
                </div>
              </div>
              <p className="user-page-editing-label">
                Email:
              </p>
              <div className="user-name-editing-input-wrapper">
                <input
                  type="text"
                  className="user-page-editing-input"
                  value={editFields.email}
                  onChange={(e) => setEditFields({ ...editFields, email: e.target.value })}
                />
                <div className="user-page-editing-input-checks-wrapper">
                  <FontAwesomeIcon
                    className={classNames('user-page-editing-input-icon')}
                    icon={emailOK ? faCircleCheck : faCircleXmark}
                    // eslint-disable-next-line no-nested-ternary
                    style={{ color: isEmailSame ? 'grey' : emailOK ? 'green' : 'red' }}
                  />
                  {!emailOK && (
                  <div className="user-page-editing-input-checks">
                    {renderChecks(emailChecks, editFields.email)}
                  </div>
                  ) }
                </div>
              </div>
              <p className="user-page-editing-label">
                Username:
              </p>
              <div className="user-name-editing-input-wrapper">
                <input
                  type="text"
                  placeholder='Enter username'
                  className="user-page-editing-input"
                  value={editFields.username}
                  onChange={(e) => setEditFields({ ...editFields, username: e.target.value })}
                />
                <div className="user-page-editing-input-checks-wrapper">
                  <FontAwesomeIcon
                    className={classNames('user-page-editing-input-icon')}
                    icon={usernameOK ? faCircleCheck : faCircleXmark}
                    // eslint-disable-next-line no-nested-ternary
                    style={{ color: isUsernameSame ? 'grey' : usernameOK ? 'green' : 'red' }}
                  />
                  {!usernameOK && (
                  <div className="user-page-editing-input-checks">
                    {renderChecks(usernameChecks, editFields.username)}
                  </div>
                  ) }
                </div>
              </div>
              <div className="user-page-editing-icons">
                <FontAwesomeIcon
                  onClick={() => isOK && updateUserFields()}
                  className="user-page-editing-icon-ok"
                  icon={faCheck}
                  style={{ color: isOK ? '#00BFA6' : '#BDBDBD' }}
                />
                <FontAwesomeIcon
                  onClick={() => clearEditing()}
                  className="user-page-editing-icon-x"
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
            {!isEditing && (get(user, 'username') === '' || !get(user, 'username')) && (
              <Alert
                severity="warning"
                sx={{
                  width: '80%',
                  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.25)',
                }}
              >
                <p className="user-page-header-info-email">You need to set a username in order to comment on the platform.</p>
              </Alert>
            )}
            {get(user, 'orcid_id') && (
            <div className="user-page-other-info-item">
              <p className="user-page-other-info-item-title">ORCID</p>
              <p className="user-page-other-info-item-value">{get(user, 'orcid_id')}</p>
            </div>
            )
            }
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
