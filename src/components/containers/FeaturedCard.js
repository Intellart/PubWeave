// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';

type Props = {
  img: string,
  id: number,
  // title: string,
  category: string,
  description: string,
  author: string,
  date: string,
  // eslint-disable-next-line react/no-unused-prop-types
  tags?: Array<string>,
  // editable?: Function,
  // deleteable?: Function,
  // status?: string,
  // likeable?: boolean,
};

function FeaturedCard(props : Props): Node {
  const description = props.description ? props.description : 'Some quick example text to build on the card title and make up the bulk of the cards content.';

  return (
    <Link to={`/singleblog/${props.id}`}>
      <div
        key={props.id}
        className="featured-card"
      >
        <img src={props.img} className="featured-card-img" alt="featured" />
        <div className="categoryname-share-like">
          <h4>{props.category || 'Category'}</h4>
          <div className="icons-share-heart">
            <FontAwesomeIcon icon={faShare} />
            <FontAwesomeIcon icon={faHeart} />
          </div>
        </div>
        <hr className="featured-card-divider" />
        <p className="featured-card-description">{description}</p>
        <div className="author-date">
          <p>By {props.author}</p>
          <p>{props.date}</p>
        </div>
      </div>
    </Link>
  );
}

export default FeaturedCard;
