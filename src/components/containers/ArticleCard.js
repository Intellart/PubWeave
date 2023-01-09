// @flow
/* eslint-disable react/prop-types */
import React from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';

function ArticleCard(props): Node {
  return (
    <div className="article-card">
      <img src={props.img} className="article-card-img" alt="article" />
      <div className="article-right-side-content">
        <h4>Category name</h4>
        <Link to="/singleblog"><h2>Maecenas mi quam, mattis at pulvinar at, tincidunt a magna. Donec vel...</h2></Link>
        <p className="author">John Doe, Jane Doe...</p>
        <p className="article-card-description">Praesent mollis, tortor eget facilisis feugiat, sapien quam commodo leo, sit amet cursus mi velit nec lectus. Curabitur purus metus, consequat eget augue in, tempor sollicitudin est. Sed vel leo quis felis ullamcorper fringilla.</p>
        <div className="date-social">
          <p>Updated Jan 1, 2022</p>
          <div className="article-icons-share-heart">
            <FontAwesomeIcon icon={faShare} />
            <FontAwesomeIcon icon={faHeart} />
          </div>
        </div>
        <hr className="article-card-divider" />
      </div>
    </div>
  );
}

export default ArticleCard;
