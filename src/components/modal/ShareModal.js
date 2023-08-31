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
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import type { Article } from '../../store/articleStore';

type Props = {
  article: Article,
};

function ShareModal({ article }: Props): Node {
  // console.log(window.location.href);
  const link = `${window.location.href}/${get(article, 'id', 0)}`;

  const shareText = get(article, 'title', 'Article Title');
  const hashtags = 'Math,Science,Technology';

  const twitterLink = `http://twitter.com/share?text=${shareText}&url=${link}&hashtags=${hashtags}`;

  const openLink = (l: string) => {
    window.open(l, '_blank');
  };

  return (
    <div className="share-modal">
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
  );
}

export default ShareModal;
