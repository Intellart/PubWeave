// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDiscord,
  faFacebook,
  /* faGithub */
  faReddit,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import type { Node } from 'react';
import { Modal } from '@mui/material';
import { faLink, faXmark } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import type { Article } from '../../store/articleStore';

type Props = {
  open: boolean,
  onClose: Function,
  article: Article,
};

function ShareModal(props: Props): Node {
  console.log(window.location.href);
  const link = `${window.location.href}/${get(props.article, 'id', 0)}`;

  const shareText = get(props.article, 'title', 'Article Title');
  const hashtags = 'Math,Science,Technology';

  const twitterLink = `http://twitter.com/share?text=${shareText}&url=${link}&hashtags=${hashtags}`;

  const openLink = (l) => {
    window.open(l, '_blank');
  };

  return (
    <Modal
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      open={props.open}
      onClose={props.onClose}
    >
      <div className="share-modal">
        <div className="share-modal-header">
          <h2>Share</h2>
          <FontAwesomeIcon className="icon" icon={faXmark} onClick={props.onClose} />
        </div>
        <hr />
        <p className="share-modal-subtitle">Share this article with your community</p>
        <div className="share-modal-buttons">
          <FontAwesomeIcon
            className="icon"
            icon={faTwitter}
            onClick={() => openLink(twitterLink)}
          />
          {/* <FontAwesomeIcon className="icon" icon={faGithub} /> */}
          <FontAwesomeIcon className="icon" icon={faDiscord} />
          <FontAwesomeIcon className="icon" icon={faFacebook} />
          <FontAwesomeIcon className="icon" icon={faReddit} />
        </div>
        <p className="share-modal-subtitle">Or copy the link</p>
        <div className="share-modal-copy-link">
          <FontAwesomeIcon className="icon" icon={faLink} />
          <p>{link}</p>
          <button
            type="button"
            className="copy-button"
            onClick={() => {
              navigator.clipboard.writeText('https://www.google.com');
              toast.success('Copied link to clipboard');
            }}
          >Copy
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ShareModal;
