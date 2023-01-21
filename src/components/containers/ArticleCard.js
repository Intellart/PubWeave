// @flow
import React from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faPencil, faPenToSquare, faShare, faWarning, faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import type { Article } from '../../store/articleStore';
import Rocket from '../../images/RocketLaunch.png';
import Space from '../../images/SpaceImg.png';
import Astronaut from '../../images/AstronautImg.png';
import Earth from '../../images/EarthImg.png';

const images = [Rocket, Space, Astronaut, Earth];

type Props = {
  article: Article,
  onDelete?: (id: number) => void,
  showPublishedChip?: boolean,
};

function ArticleCard(props : Props): Node {
  const navigate = useNavigate();
  const description = props.article.description ? props.article.description : 'Some quick example text to build on the card title and make up the bulk of the cards content.';

  const status = props.article.status ? props.article.status : 'draft';
  const isPublished = status === 'published';

  const noImage = props.article.image === null;

  const handleEditArticle = (e) => {
    e.stopPropagation();
    if (isPublished) {
      navigate(`/submit-work/${props.article.id}`);
    }
  };

  const handleDeleteArticle = (e) => {
    e.stopPropagation();
    if (isPublished && props.onDelete) {
      props.onDelete(props.article.id);
    }
  };

  const handleArticleClick = (e) => {
    e.preventDefault();

    if (isPublished) {
      navigate(`/singleblog/${props.article.id}`);
    } else {
      navigate(`/submit-work/${props.article.id}`);
    }
  };

  const chipParams = (imageChip = false) => {
    if (imageChip && !isPublished && noImage) {
      return {
        label: 'No image',
        color: 'warning',
        icon: <FontAwesomeIcon icon={faWarning} />,
        variant: 'default',
      };
    }

    switch (props.article.status) {
      case 'draft':
        return {
          label: 'Draft',
          color: 'info',
          icon: <FontAwesomeIcon icon={faPenToSquare} />,
          variant: 'outlined',
        };
      case 'published':
        return {
          label: 'Published',
          color: 'success',
          icon: <FontAwesomeIcon icon={faCheck} />,
          variant: 'default',
          sx: {
            fontSize: '1.2rem',
          },
        };
      case 'rejected':
        return {
          label: 'Rejected',
          color: 'error',
          icon: <FontAwesomeIcon icon={faXmark} />,
          variant: 'outlined',
        };
      case 'requested':
        return {
          label: 'Requested',
          color: 'warning',
          icon: <FontAwesomeIcon icon={faPencil} />,
          variant: 'outlined',
        };
      default:
        return {
          label: 'Draft',
          color: 'default',
          icon: <FontAwesomeIcon icon={faPencil} />,
          variant: 'outlined',
        };
    }
  };

  return (
    <div
      onClick={handleArticleClick}
      className="article-card"
    >
      <div className={classNames('article-card-img-wrapper', { 'article-card-img-wrapper-published': props.showPublishedChip && (isPublished || noImage) })}>
        <img
          src={props.article.image || images[Math.floor(Math.random() * images.length)]}
          className="article-card-img"
          alt="article"
        />
        {props.showPublishedChip && (isPublished || noImage) && (
        <Chip
          className="article-card-img-chip"
          {...chipParams(true)}
        />
        )}
      </div>
      <div className="article-right-side-content">
        <div className="article-card-side-content-upper-wrapper">
          <div className="article-card-side-content-title-wrapper">
            <h4>{props.article.category || 'Category'}</h4>
            <h2>{props.article.title}</h2>
          </div>
          <div className="article-card-side-content-status-wrapper">
            {!isPublished && <Chip className="article-card-side-content-status-chip" label={status || 'Status'} {...chipParams()} />}
          </div>
        </div>
        <p className="author">By {props.article.user.full_name || 'Authors Name'}</p>
        <p className="article-card-description">{description}</p>
        <div className="date-social">
          <p>Updated {props.article.created_at || 'Date'}</p>
          <div className="article-icons-share-heart">
            <FontAwesomeIcon icon={faShare} />
            {props.article.star && <FontAwesomeIcon icon={faHeart} />}
            {!isPublished && (
            <a
              onClick={(e) => handleEditArticle(e)}
            ><FontAwesomeIcon icon={faPenToSquare} />
            </a>
            )}
            {!isPublished && (
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
