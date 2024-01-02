// @flow
import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
// import FeaturedImg from '../../images/featured-card.png';
// import { faComment } from '@fortawesome/free-regular-svg-icons';
import { faFacebook, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import Avatar from '@mui/material/Avatar';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  find, get, isEmpty, isEqual, map, size, toInteger,
} from 'lodash';
import { Chip } from '@mui/material';
import CommentModal from '../comments/CommentModal';
// import { store } from '../../store';
import { actions, selectors } from '../../store/articleStore';
import { selectors as userSelectors } from '../../store/userStore';
import { useScrollTopEffect } from '../../utils/hooks';
import OrcIDButton from '../elements/OrcIDButton';
import Editor, { EditorStatus } from '../editor/Editor';
import LikeButton from '../containers/LikeButton';

function Blogs(): Node {
  useScrollTopEffect();
  const { id } = useParams();

  // store.getState();

  // eslint-disable-next-line no-unused-vars

  const dispatch = useDispatch();
  const fetchArticle = (artId: number) => dispatch(actions.fetchArticle(artId));
  // const likeArticle = (articleId: number) => dispatch(actions.likeArticle(articleId));
  // const removeArticleLike = (articleId: number) => dispatch(actions.likeArticleRemoval(articleId));

  const article = useSelector((state) => selectors.article(state), isEqual);
  const categories = useSelector((state) => selectors.getCategories(state), isEqual);
  const user = useSelector((state) => userSelectors.getUser(state), isEqual);
  const [isReady, setIsReady] = useState(!isEmpty(article) && id && get(article, 'id') === toInteger(id));

  useEffect(() => {
    setIsReady(!isEmpty(article) && id && get(article, 'id') === toInteger(id));
  }, [article, id]);

  useEffect(() => {
    if (!isReady) {
      fetchArticle(id);
    }
    if (document.body) {
      document.body.spellcheck = false;
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article, id, isReady]);

  const getRoute = (catId: number) => get(find(categories, (cat) => cat.id === catId), 'category_name');

  const author = get(article, 'author', {});

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <main className="single-blog-wrapper">
      <section className="single-blog-highlight unselectable">
        <div className="single-blog-highlight-text">
          <div className="single-blog-highlight-text-left">
            <h1 className="single-blog-highlight-category">{get(article, 'category', '')}</h1>
            <h2 className="single-blog-highlight-title">{get(article, 'title', 'No title')}</h2>
            <p className="single-blog-highlight-description">{get(article, 'description', '')}</p>
            <div className="single-blog-highlight-text-left-tags">
              {map(get(article, 'tags', []), (tag, index) => (
                <Link
                  key={index}
                  to={`/blogs/${getRoute(tag.category_id)}/${tag.tag}`}
                >
                  <Chip
                    variant='outlined'
                    key={tag.id}
                    label={tag.tag}
                    className="single-blog-highlight-text-left-tags-chip"
                  />
                </Link>
              ))}
            </div>
          </div>
          <div className="single-blog-highlight-text-right">
            <div className="single-blog-highlight-text-right-social-icons">
              {get(author, 'social_tw')
              && (
              <a target="_blank" href={get(author, 'social_tw')}>
                <FontAwesomeIcon icon={faTwitter} style={{ width: 35, height: 35 }} />
              </a>
              )}
              {get(author, 'social_ln')
              && (
                <a href={get(author, 'social_ln')}>
                  <FontAwesomeIcon icon={faLinkedin} style={{ width: 35, height: 35 }} />
                </a>
              )}
              {get(author, 'social_fb')
              && (
                <a target="_blank" href={get(author, 'social_fb')}>
                  <FontAwesomeIcon icon={faFacebook} style={{ width: 35, height: 35 }} />
                </a>
              )}
              {get(author, 'social_web')
              && (
                <a target="_blank" href={get(author, 'social_web')}>
                  <FontAwesomeIcon icon={faGlobe} style={{ width: 35, height: 35 }} />
                </a>
              )}
            </div>
            {get(author, 'orcid_id') && (
              <OrcIDButton
                orcid={get(author, 'orcid_id')}
              />
            )}
            <div className="single-blog-highlight-text-right-author">
              <Avatar alt="Remy Sharp" src={get(author, 'profile_img', '')} className="single-blog-highlight-text-right-author-img" />
              <div className="single-blog-highlight-text-right-author-text">
                <p className="single-blog-highlight-text-right-author-text-name">{get(author, 'full_name', '')}</p>
                <p className="single-blog-highlight-text-right-author-text-date">{new Date(get(article, 'created_at', '')).toDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {isReady && (
        <div
          className="editorjs-wrapper"
        >
          <Editor
            readOnly
            isReady={isReady}
            status={EditorStatus.PUBLISHED}
          />

        </div>
      )}
      <div className="reaction-icons unselectable">
        <LikeButton
          enabled={!isEmpty(user)}
          article={article}
          userId={get(user, 'id', 1)}
          iconType='solid'
        />
        <CommentModal
          enabled
          articleId={id}
        />
        <p>{size(get(article, 'comments', []))}</p>

      </div>
    </main>
  );
}

export default Blogs;
