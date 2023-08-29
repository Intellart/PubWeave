// @flow
import {
  faHeart as faHeartSolid,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { find, get, size } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { actions } from '../../store/articleStore';
import type { Article } from '../../store/articleStore';

type Props = {
    enabled: boolean,
    article: Article,
    userId?: number,
    iconType: 'default' | 'solid',
};

function LikeButton({
  enabled, article, userId, iconType = 'solid',
}: Props): React$Node {
  const dispatch = useDispatch();
  const likeArticle = (articleId: number) => dispatch(actions.likeArticle(articleId));
  const removeArticleLike = (articleId: number) => dispatch(actions.likeArticleRemoval(articleId));
  const [userAlreadyLiked, setUserAlreadyLiked] = useState(find(get(article, 'likes', []), (like) => like.user_id === userId));

  // console.log(get(article, 'likes', []));

  useEffect(() => {
    setUserAlreadyLiked(find(get(article, 'likes', []), (like) => like.user_id === userId) || false);
  }, [article, userId]);

  if (!enabled) {
    return null;
  }

  return (
    <div className="like-button-container">
      <FontAwesomeIcon
        className={classNames('like-button-icon', { 'like-button-icon-active': userAlreadyLiked })}
        onClick={() => {
          if (!userId) { return; }

          if (userAlreadyLiked) {
            removeArticleLike(article.id);
          } else {
            likeArticle(article.id);
          }
        }}
        icon={(iconType === 'default' && !userAlreadyLiked) ? faHeart : faHeartSolid}
        style={{
          color: userAlreadyLiked ? '#FF0000' : '#11273F',
        }}
      />
      <p>{size(get(article, 'likes', 0))}</p>
    </div>
  );
}

export default LikeButton;
