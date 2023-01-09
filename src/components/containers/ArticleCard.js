// @flow
/* eslint-disable react/prop-types */
import React from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faShare } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';

type Props = {
  img: string,
  id: number,
  title: string,
  category: string,
  description: string,
  author: string,
  date: string,
  // eslint-disable-next-line react/no-unused-prop-types
  tags?: Array<string>,
  editable?: boolean,
};

function ArticleCard(props : Props): Node {
  const description = props.description ? props.description : 'Some quick example text to build on the card title and make up the bulk of the cards content.';

  return (
    <div className="article-card">
      <img src={props.img} className="article-card-img" alt="article" />
      <div className="article-right-side-content">
        <h4>{props.category || 'Category'}</h4>
        <h2>{props.title} {props.id}</h2>
        <p className="author">By {props.author || 'Authors Name'}</p>
        <p className="article-card-description">{description}</p>
        <div className="date-social">
          <p>Updated {props.date || 'Date'}</p>
          <div className="article-icons-share-heart">
            <FontAwesomeIcon icon={faShare} />
            <FontAwesomeIcon icon={faHeart} />
            {props.editable && (
            <a
              href={`/submit-work/${props.id}`}
            ><FontAwesomeIcon icon={faPenToSquare} />
            </a>
            )}
          </div>
        </div>
        <hr className="article-card-divider" />
      </div>
    </div>
  );
}

export default ArticleCard;
