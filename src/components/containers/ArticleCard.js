// @flow
import React from 'react';
import type { Node } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faGear,
  faGlasses,
  faPencil, faPenToSquare, faWarning, faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { Chip } from '@mui/material';
import classNames from 'classnames';
import {
  filter, get, includes, size,
} from 'lodash';
import { Link } from 'react-router-dom';
import type { Article } from '../../store/articleStore';
import {
  editorPermissions,
  permissions,
  useScreenSize,
} from '../../utils/hooks';
import LogoImg from '../../assets/images/empty_thumbnail.png';
import Modal from '../modal/Modal';
import LikeButton from './LikeButton';
import ArticleTypeModal from '../modal/ArticleTypeModal';
import { EditorStatus } from '../editor/Editor';

type Props = {
  article: Article,
  onDelete?: (id: number) => void,
  showPublishedChip?: boolean,
  onClick?: () => void,
  currentUserId?: number,
  onConvert: () => void,
};

function ArticleCard(props : Props): Node {
  const { isMobile } = useScreenSize();

  const description = props.article.description ? props.article.description : 'Some quick example text to build on the card title and make up the bulk of the cards content.';
  const status = props.article.status ? props.article.status : 'draft';
  const workType = get(props.article, 'article_type', 'blog_article');
  const isPublished = status === 'published';
  const noImage = props.article.image === null;

  const currentPermissions = editorPermissions({
    type: workType,
    status: status || EditorStatus.IN_PROGRESS,
    userId: props.currentUserId,
    ownerId: props.article.author.id,
    isReviewer: includes(props.article.reviewers, props.currentUserId),
  });

  console.log('status', props.article.status);
  console.log('currentPermissions', currentPermissions);

  // const [userAlreadyLiked, setUserAlreadyLiked] = useState(find(get(props.article, 'likes', []), (like) => like.user_id === props.currentUserId));

  // useEffect(() => {
  //   setUserAlreadyLiked(find(get(props.article, 'likes', []), (like) => like.user_id === props.currentUserId));
  // }, [props.article, props.currentUserId]);

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

    const numOfReviewers = size(filter(get(props.article, 'reviewers', []), (reviewer) => !!reviewer.review_content));

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
      case 'reviewing':
        return {
          label: `Reviewing ${numOfReviewers > 0 ? `(${numOfReviewers})` : ''}`,
          color: 'warning',
          icon: <FontAwesomeIcon icon={faGlasses} />,
          variant: 'default',
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
      className="article-card"
    >
      <div
        onClick={handleArticleClick}
        className={classNames('article-card-img-wrapper', { 'article-card-img-wrapper-published': props.showPublishedChip && (isPublished || noImage) })}
      >
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
          <div onClick={handleArticleClick} className="article-card-side-content-title-wrapper">
            <h4>{props.article.category || 'Category'}</h4>
            <h2>{props.article.title}
            </h2>
            <p className="author">By {props.article.author.full_name || 'Authors Name'}</p>
          </div>
          <div className="article-card-side-content-status-wrapper">
            {!isPublished && <Chip className="article-card-side-content-status-chip" label={status || 'Status'} {...chipParams()} />}
            <ArticleTypeModal
              enabled={get(currentPermissions, permissions.SWITCH_ARTICLE_TYPE, false)}
              type={workType}
              onConvert={props.onConvert}
            />
          </div>
        </div>
        <p className="article-card-description">{description.substring(0, isMobile ? 45 : 200)}...</p>
        <div className='article-card-lower'>
          <div className="date-social">
            <p>Updated {new Date(props.article.updated_at).toLocaleDateString()}</p>
            <div className="article-icons-share-heart">
              <Modal
                enabled={get(currentPermissions, permissions.LIKE_ARTICLE, false)}
                type="share"
                shape="icon"
              />
              <Modal
                enabled={get(currentPermissions, permissions.collaborators, false)}
                type="collab"
                shape="chip"
                text="showAll"
                articleId={props.article.id}
                isOwner
              />
              {get(currentPermissions, permissions.LIKE_ARTICLE, false) && (
              <LikeButton
                article={props.article}
                userId={props.currentUserId}
                iconType="default"
              />
              ) }
              {get(currentPermissions, permissions.ARTICLE_SETTINGS, false) && (
              <Link to={`/my-work/${props.article.id}/settings`} className="article-card-link">
                <FontAwesomeIcon icon={faGear} />
              </Link>
              ) }
              {get(currentPermissions, permissions.DELETE_ARTICLE, false) && (
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
  );
}

export default ArticleCard;
