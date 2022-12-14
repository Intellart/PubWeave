// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import FeaturedImg from '../../images/featured-card.png';

function FeaturedCard(): Node {
  return (
    <div className="featured-card">
      <img src={FeaturedImg} className="featured-card-img" alt="featured" />
      <div className="categoryname-share-like">
        <h4>Category name</h4>
        <div className="icons-share-heart">
          <FontAwesomeIcon icon={faShare} />
          <FontAwesomeIcon icon={faHeart} />
        </div>
      </div>
      <hr className="featured-card-divider" />
      <p className="featured-card-description">Donec consectetur venenatis nisi vel facilisis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices  posuere cubilia curae.</p>
      <div className="author-date">
        <p>John Doe, Jane Doe...</p>
        <p>Updated Jan 1, 2022</p>
      </div>
    </div>
  );
}

export default FeaturedCard;
