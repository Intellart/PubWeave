// @flow
import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClipboard, faCopy, faGlobe, faHeart,
} from '@fortawesome/free-solid-svg-icons';
// import FeaturedImg from '../../images/featured-card.png';
// import { faComment } from '@fortawesome/free-regular-svg-icons';
import { faFacebook, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import Avatar from '@mui/material/Avatar';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  find, get, isEmpty, isEqual, map, size, toInteger,
} from 'lodash';
import { createReactEditorJS } from 'react-editor-js';
import { Chip, Popover } from '@mui/material';
import classNames from 'classnames';
import { toast } from 'react-toastify';
import hljs from 'highlight.js';
import PubWeaveLogo from '../../assets/images/pubweave_logo.png';
import CommentModal from '../containers/CommentModal';
import { store } from '../../store';
import { actions, selectors } from '../../store/articleStore';
import { selectors as userSelectors } from '../../store/userStore';
import { useScrollTopEffect } from '../../utils/hooks';
import OrcIDButton from '../elements/OrcIDButton';
import { useEditorTools } from '../../utils/editor_constants';

const ReactEditorJS = createReactEditorJS();

function Blogs(): Node {
  useScrollTopEffect();
  const { id } = useParams();

  store.getState();

  // eslint-disable-next-line no-unused-vars

  const EDITOR_JS_TOOLS = useEditorTools();

  const dispatch = useDispatch();
  const fetchArticle = (artId: number) => dispatch(actions.fetchArticle(artId));
  const createComment = (articleId: number, userId: number, comment: string, replyTo: number) => dispatch(actions.createComment(articleId, userId, comment, replyTo));
  const likeArticle = (articleId: number) => dispatch(actions.likeArticle(articleId));
  const removeArticleLike = (articleId: number) => dispatch(actions.likeArticleRemoval(articleId));

  const [contextMenu, setContextMenu] = useState({
    show: false,
    x: 0,
    y: 0,
    selection: '',
  });

  const article = useSelector((state) => selectors.article(state), isEqual);
  const articleContent = useSelector((state) => selectors.articleContent(state), isEqual);
  const categories = useSelector((state) => selectors.getCategories(state), isEqual);
  const user = useSelector((state) => userSelectors.getUser(state), isEqual);
  const [isReady, setIsReady] = useState(!isEmpty(article) && id && get(article, 'id') === toInteger(id));

  // console.log(article);

  useEffect(() => {
    setIsReady(!isEmpty(article) && id && get(article, 'id') === toInteger(id));
  }, [article, id]);

  useEffect(() => {
    if (!isReady) {
      fetchArticle(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article, id, isReady]);

  const getRoute = (catId: number) => get(find(categories, (cat) => cat.id === catId), 'category_name');

  const [userAlreadyLiked, setUserAlreadyLiked] = useState(find(get(article, 'likes', []), (like) => like.user_id === get(user, 'id', '')));

  useEffect(() => {
    setUserAlreadyLiked(find(get(article, 'likes', []), (like) => like.user_id === get(user, 'id', '')));
  }, [article, user]);

  const onRightClick = (e: any) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      selection: window.getSelection().toString(),
    });
  };

  const copySelectedToClipboard = () => {
    navigator.clipboard.writeText(contextMenu.selection);
    setContextMenu({
      show: false,
      x: 0,
      y: 0,
      selection: '',
    });

    toast.success('Copied to clipboard');
  };

  const referenceSelectedText = () => {
    const text = contextMenu.selection;
    const url = window.location.href;
    const reference = `${text} (${url})`;
    navigator.clipboard.writeText(reference);
    setContextMenu({
      show: false,
      x: 0,
      y: 0,
      selection: '',
    });

    toast.success('Copied to clipboard');
  };

  const onEditorKeyDown = (e: any) => {
    e.preventDefault();
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <main className="single-blog-wrapper">
      <section className="single-blog-highlight unselectable">
        <div className="single-blog-highlight-text">
          <div className="single-blog-highlight-text-left">
            <h1 className="single-blog-highlight-category">{get(article, 'category', '')}</h1>
            <h2 className="single-blog-highlight-title">{get(article, 'title', 'No title')}</h2>
            <div className="single-blog-highlight-text-left-tags">
              {map(get(article, 'tags', []), (tag, index) => (
                <Link
                  key={index}
                  to={`/blogs/${getRoute(tag.category_id)}/${tag.tag_name}`}
                >
                  <Chip
                    variant='outlined'
                    key={tag.id}
                    label={tag.tag_name}
                    className="single-blog-highlight-text-left-tags-chip"
                  />
                </Link>
              ))}
            </div>
          </div>
          <div className="single-blog-highlight-text-right">
            <div className="single-blog-highlight-text-right-social-icons">
              {get(article, 'user.social_tw')
              && (
              <a target="_blank" href={get(article, 'user.social_tw')}>
                <FontAwesomeIcon icon={faTwitter} style={{ width: 35, height: 35 }} />
              </a>
              )}
              {get(article, 'user.social_ln')
              && (
                <a href={get(article, 'user.social_ln')}>
                  <FontAwesomeIcon icon={faLinkedin} style={{ width: 35, height: 35 }} />
                </a>
              )}
              {get(article, 'user.social_fb')
              && (
                <a target="_blank" href={get(article, 'user.social_fb')}>
                  <FontAwesomeIcon icon={faFacebook} style={{ width: 35, height: 35 }} />
                </a>
              )}
              {get(article, 'user.social_web')
              && (
                <a target="_blank" href={get(article, 'user.social_web')}>
                  <FontAwesomeIcon icon={faGlobe} style={{ width: 35, height: 35 }} />
                </a>
              )}
            </div>
            {get(article, 'user.orcid_id') && (
              <OrcIDButton
                orcid={get(article, 'user.orcid_id')}
              />
            )}
            <div className="single-blog-highlight-text-right-author">
              <Avatar alt="Remy Sharp" src={get(article, 'user.profile_img', '')} className="single-blog-highlight-text-right-author-img" />
              <div className="single-blog-highlight-text-right-author-text">
                <p className="single-blog-highlight-text-right-author-text-name">{get(article, 'user.full_name', '')}</p>
                <p className="single-blog-highlight-text-right-author-text-date">{new Date(get(article, 'created_at', '')).toDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <img
        src={get(article, 'image') || PubWeaveLogo}
        className={classNames('single-blog-img', { 'single-blog-img-no-image': !get(article, 'image') })}
        alt="single blog"
      />
      {isReady && (
        <div
          onKeyDown={(event) => onEditorKeyDown(event)}
          onContextMenu={(event) => onRightClick(event)}
          className="editorjs-wrapper"
        >
          <ReactEditorJS
            holder='editorjs'
            readOnly
            onReady={() => {
              hljs.highlightAll();
              const editor = document.getElementById('editorjs');
              if (editor) { editor.setAttribute('spellcheck', 'false'); }
            }}
            defaultValue={{
              blocks: get(articleContent, 'blocks', []),
            }}
            tools={EDITOR_JS_TOOLS}
            minHeight={0}
          />
          <Popover
            className='editorjs-context-menu-popover unselectable'
            open={contextMenu.show}
            anchorReference="anchorPosition"
            anchorPosition={{ top: contextMenu.y, left: contextMenu.x }}
            onClose={() => setContextMenu({
              show: false, x: 0, y: 0, selection: '',
            })}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <div className="editorjs-context-menu">
              <div
                onClick={() => {
                  copySelectedToClipboard();
                }}
                className="editorjs-context-menu-item"
              >
                <FontAwesomeIcon icon={faCopy} style={{ width: 20, height: 20, marginRight: 10 }} />
                <p>Copy</p>
              </div>
              <div
                onClick={() => {
                  referenceSelectedText();
                }}
                className="editorjs-context-menu-item"
              >
                <FontAwesomeIcon icon={faClipboard} style={{ width: 20, height: 20, marginRight: 10 }} />
                <p>Reference</p>
              </div>
            </div>
          </Popover>
        </div>
      )}
      <div className="reaction-icons unselectable">
        <FontAwesomeIcon
          className={classNames('reaction-icon reaction-icon-like', { 'reaction-icon-like-active': userAlreadyLiked })}
          onClick={() => {
            if (!user) return;

            if (userAlreadyLiked) {
              removeArticleLike(id);
            } else {
              likeArticle(id);
            }
          }}
          icon={faHeart}
          style={{
            color: userAlreadyLiked ? '#FF0000' : '#11273F',
          }}
        />
        <p>{size(get(article, 'likes', 0))}</p>
        {user ? (
          <>
            <CommentModal
              className="reaction-icon reaction-icon-comment"
              comments={get(article, 'comments', [])}
              createComment={createComment}
              articleId={id}
              authorId={get(article, 'user.id', 1)}
              currentUserId={get(user, 'id', 1)}
              author={get(article, 'user')}
              currentUser={user}
            />
            <p>{size(get(article, 'comments', []))}</p>
          </>
        ) : (
          <p>You must be logged in to see comments.</p>
        )}

      </div>
    </main>
  );
}

export default Blogs;
