// @flow
import React, { useState, useEffect } from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faPencil, faPenToSquare, faShare, faWarning, faXmark, faHeart as faHeartSolid,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { Chip } from '@mui/material';
import classNames from 'classnames';
import { find, get } from 'lodash';
import { useDispatch } from 'react-redux';
import type { Article } from '../../store/articleStore';
// import Rocket from '../../images/RocketLaunch.png';
// import Space from '../../images/SpaceImg.png';
// import Astronaut from '../../images/AstronautImg.png';
// import Earth from '../../images/EarthImg.png';
import { useScreenSize } from '../../utils/hooks';
import ShareModal from './ShareModal';
import { actions } from '../../store/articleStore';
import LogoImg from '../../assets/images/pubweave_logo.png';

// const images = [Rocket, Space, Astronaut, Earth];

type Props = {
  article: Article,
  onDelete?: (id: number) => void,
  showPublishedChip?: boolean,
  onClick?: () => void,
  currentUserId?: number,
};

function ArticleCard(props : Props): Node {
  const description = props.article.description ? props.article.description : 'Some quick example text to build on the card title and make up the bulk of the cards content.';

  const status = props.article.status ? props.article.status : 'draft';
  const isPublished = status === 'published';

  const dispatch = useDispatch();
  const likeArticle = (articleId: number) => dispatch(actions.likeArticle(articleId));
  const removeArticleLike = (articleId: number) => dispatch(actions.likeArticleRemoval(articleId));

  const [userAlreadyLiked, setUserAlreadyLiked] = useState(find(get(props.article, 'likes', []), (like) => like.user_id === props.currentUserId));

  useEffect(() => {
    setUserAlreadyLiked(find(get(props.article, 'likes', []), (like) => like.user_id === props.currentUserId));
  }, [props.article, props.currentUserId]);

  const noImage = props.article.image === null;

  const { isMobile } = useScreenSize();

  // const handleEditArticle = (e) => {
  //   e.stopPropagation();
  //   if (isPublished) {
  //     navigate(`/submit-work/${props.article.id}`);
  //   }
  // };

  const handleDeleteArticle = (e: any) => {
    e.stopPropagation();
    if (props.onDelete) {
      props.onDelete(props.article.id);
    }
  };

  const handleArticleClick = (e: any) => {
    e.preventDefault();
    if (props.onClick) {
      props.onClick();
    }
  };

  const chipParams = (imageChip: boolean = false) => {
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

  const [showModal, setShowModal] = React.useState(false);

  return (
    <>
      <ShareModal
        open={showModal}
        onClose={() => setShowModal(false)}
        article={props.article}
      />
      <div
        onClick={handleArticleClick}
        className="article-card"
      >
        <div className={classNames('article-card-img-wrapper', { 'article-card-img-wrapper-published': props.showPublishedChip && (isPublished || noImage) })}>
          <img
            src={props.article.image || LogoImg}
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
              <p className="author">By {props.article.author.full_name || 'Authors Name'}</p>
            </div>
            <div className="article-card-side-content-status-wrapper">
              {!isPublished && <Chip className="article-card-side-content-status-chip" label={status || 'Status'} {...chipParams()} />}
            </div>
          </div>
          <p className="article-card-description">{description.substring(0, isMobile ? 45 : 200)}...</p>
          <div className='article-card-lower'>
            <div className="date-social">
              <p>Updated {new Date(props.article.updated_at).toLocaleDateString()}</p>
              <div className="article-icons-share-heart">
                {isPublished && (
                <FontAwesomeIcon
                  icon={faShare}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowModal(true);
                  }}
                />
                )}
                {props.currentUserId && (
                <FontAwesomeIcon
                  onClick={(e) => {
                    e.stopPropagation();
                    if (userAlreadyLiked) {
                      removeArticleLike(get(props.article.id));
                    } else {
                      likeArticle(get(props.article.id));
                    }
                  }}
                  style={{
                    color: userAlreadyLiked ? '#FF0000' : '#11273F',
                  }}
                  icon={userAlreadyLiked ? faHeartSolid : faHeart}
                />
                ) }
                {/* {!isPublished && (
                <a
                  onClick={(e) => handleEditArticle(e)}
                ><FontAwesomeIcon icon={faPenToSquare} />
                </a>
                )} */}
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
      </div>
    </>
  );
}

export default ArticleCard;
