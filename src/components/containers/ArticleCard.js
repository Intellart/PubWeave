// @flow
/* eslint-disable react/prop-types */
import React from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faShare, faXmark } from '@fortawesome/free-solid-svg-icons';
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
  editable?: Function,
  deleteable?: Function,
  status?: string,
};

function ArticleCard(props : Props): Node {
  const description = props.description ? props.description : 'Some quick example text to build on the card title and make up the bulk of the cards content.';

  const handleEditArticle = (e) => {
    e.stopPropagation();
    if (props.editable) {
      props.editable(props.id);
    }
  };

  const handleDeleteArticle = (e) => {
    e.stopPropagation();
    if (props.deleteable) {
      props.deleteable(props.id);
    }
  };

  const handleTitleClick = (e) => {
    e.preventDefault();

    if (props.editable) {
      props.editable(props.id);
    }
  };

  return (
    <div
      onClick={handleTitleClick}
      className="article-card"
    >
      <img src={props.img} className="article-card-img" alt="article" />
      <div className="article-right-side-content">
        <div className="article-card-side-content-upper-wrapper">
          <div className="article-card-side-content-title-wrapper">
            <h4>{props.category || 'Category'}</h4>
            <h2>{props.title} {props.id}</h2>
          </div>
          <div className="article-card-side-content-status-wrapper">
            <p>{props.status || 'Status'}</p>
          </div>
        </div>
        <p className="author">By {props.author || 'Authors Name'}</p>
        <p className="article-card-description">{description}</p>
        <div className="date-social">
          <p>Updated {props.date || 'Date'}</p>
          <div className="article-icons-share-heart">
            <FontAwesomeIcon icon={faShare} />
            <FontAwesomeIcon icon={faHeart} />
            {props.editable && (
            <a
              onClick={(e) => handleEditArticle(e)}
            ><FontAwesomeIcon icon={faPenToSquare} />
            </a>
            )}
            {props.deleteable && (
            <a
              onClick={(e) => handleDeleteArticle(e)}
            ><FontAwesomeIcon icon={faXmark} />
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
