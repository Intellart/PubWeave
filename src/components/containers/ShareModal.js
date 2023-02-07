// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
import type { Node } from 'react';
import { Modal } from '@mui/material';
import { faLink, faXmark } from '@fortawesome/free-solid-svg-icons';

type Props = {
  open: boolean,
  onClose: Function,
};

function ShareModal(props: Props): Node {
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
          <FontAwesomeIcon className="icon" icon={faTwitter} />
          <FontAwesomeIcon className="icon" icon={faGithub} />
          <FontAwesomeIcon className="icon" icon={faDiscord} />
        </div>
        <p className="share-modal-subtitle">Or copy the link</p>
        <div className="share-modal-copy-link">
          <FontAwesomeIcon className="icon" icon={faLink} />
          <p>https://www.google.com</p>
          <button
            type="button"
            className="copy-button"
          >Copy
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ShareModal;
