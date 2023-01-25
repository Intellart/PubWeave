/* eslint-disable no-console */ import React, {
  useEffect, useState,
} from 'react';
import { createReactEditorJS } from 'react-editor-js';
import { useDispatch, useSelector } from 'react-redux';

import {
  isEmpty, sum, words, get, filter, map, isEqual, indexOf,
} from 'lodash';

import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Alert } from '@mui/material';
import { EDITOR_JS_TOOLS } from '../../utils/editor_constants';

import 'bulma/css/bulma.min.css';
import Footer from '../containers/Footer';
import ArticleConfig from '../ArticleConfig';
// eslint-disable-next-line no-unused-vars
import { store } from '../../store';
import { actions, selectors } from '../../store/articleStore';
import ImageSelection from '../containers/ImageSelection';

const ReactEditorJS = createReactEditorJS();

function ReactEditor () {
  const [titleFocus, setTitleFocus] = useState(false);
  const titleRef = React.useRef(null);
  const { id } = useParams();

  const navigate = useNavigate();

  // useSelector
  const article = useSelector((state) => selectors.article(state), isEqual);
  const articleContent = useSelector((state) => selectors.articleContent(state), isEqual);
  const categories = useSelector((state) => selectors.getCategories(state), isEqual);

  // dispatch
  const dispatch = useDispatch();
  const fetchArticle = (ind) => dispatch(actions.fetchArticle(ind));
  const updateArticle = (articleId, payload) => dispatch(actions.updateArticle(articleId, payload));
  const publishArticle = (articleId, status) => dispatch(actions.publishArticle(articleId, status));

  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState(0);

  const [stateReady, setStateReady] = useState(false);

  const [articleTitle, setArticleTitle] = useState('');

  useEffect(() => {
    if (isEmpty(article)) {
      fetchArticle(id);
    } else if (!stateReady) {
      console.log('Article loaded');
      setStateReady(true);
      setArticleTitle(get(article, 'title'));
      setWordCount(sum(map(get(articleContent, 'blocks'), (block) => words(get(block, 'data.text')).length), 0));
      setLastSaved(get(articleContent, 'time'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article]);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.width = `${(articleTitle.length * 12 + 60)}px`;
    }
  }, [titleRef, articleTitle]);

  console.log(map(filter(get(articleContent, 'blocks', []), (block) => block.type === 'image'), (block) => get(block, 'data.file.url')));

  return (
    <main className="editor-wrapper">
      <div
        className={classNames('editor-title')}
        onClick={() => titleRef.current.focus()}
      >
        {!titleFocus && <FontAwesomeIcon icon={faPenToSquare} />}
        <input
          type="text"
          placeholder="Title"
          onFocus={() => setTitleFocus(true)}
          onBlur={() => {
            setTitleFocus(false);
            updateArticle(id, { title: articleTitle });
          }}
          ref={titleRef}
          onChange={(e) => setArticleTitle(e.target.value)}
          value={articleTitle}
          className={classNames('editor-title-input', { focus: titleFocus })}
        />
      </div>
      <hr className={classNames('editor-title-hr', { focus: titleFocus, empty: !articleTitle })} />
      <div className="editor-buttons-wrapper">
        <div className="editor-buttons">
          <Link
            to={`/submit-work/${id}`}
          >
            <div
              className='editor-buttons-back-button'
              color="primary"
            >
              Back to editor
            </div>
          </Link>
          <div
            className={classNames('editor-wrapper-publish-button')}
            onClick={() => {
              publishArticle(id, 'requested', article);
              navigate('/submit-work');
            }}
          >
            Publish article
          </div>
        </div>
      </div>
      <ImageSelection
        linkList={map(filter(get(articleContent, 'blocks', []), (block) => block.type === 'image'), (block) => get(block, 'data.file.url'))}
        onImageSelection={(href) => {
          console.log('Image selected' + href);
          updateArticle(id, { image: href });
        }}
        oldSelectedImageIndex={indexOf(map(filter(get(articleContent, 'blocks', []), (block) => block.type === 'image'), (block) => get(block, 'data.file.url')), get(article, 'image', ''))}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',

        }}
        className="alert-container"
      >
        <Alert
          sx={{ width: '60%' }}
          severity="info"
        >
          You are in read only mode and can only view the article. To edit the article, click on the Back button.
        </Alert>
      </div>

      <ArticleConfig
        id={id}
        wordCount={wordCount}
        lastSaved={lastSaved}
        updateArticle={updateArticle}
        article={article}
        categories={categories}
      />
      {stateReady && (
      <ReactEditorJS
        holder='editorjs'
        readOnly
        defaultValue={{
          blocks: get(articleContent, 'blocks', []),
        }}
        tools={EDITOR_JS_TOOLS}
        autofocus
        placeholder='Start your article here!'
      />
      )}
      <Footer />
    </main>
  );
}

export default ReactEditor;
