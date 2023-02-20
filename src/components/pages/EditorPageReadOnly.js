import React, {
  useEffect, useState,
} from 'react';
import { createReactEditorJS } from 'react-editor-js';
import { useDispatch, useSelector } from 'react-redux';

import {
  isEmpty, sum, words, get, filter, map, isEqual,
  toInteger,
  uniq,
} from 'lodash';

import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faPenToSquare, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Alert, AlertTitle } from '@mui/material';
import { EDITOR_JS_TOOLS } from '../../utils/editor_constants';

import 'bulma/css/bulma.min.css';
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
  const tags = useSelector((state) => selectors.getTags(state), isEqual);

  // dispatch
  const dispatch = useDispatch();
  const fetchArticle = (ind) => dispatch(actions.fetchArticle(ind));
  const updateArticle = (articleId, payload) => dispatch(actions.updateArticle(articleId, payload));
  const publishArticle = (articleId, status) => dispatch(actions.publishArticle(articleId, status));
  const addTag = (articleId, tagId) => dispatch(actions.addTag(articleId, tagId));
  const removeTag = (articleTagId) => dispatch(actions.removeTag(articleTagId));

  const [isReady, setIsReady] = useState(!isEmpty(article) && id && get(article, 'id') === toInteger(id));

  useEffect(() => {
    setIsReady(!isEmpty(article) && id && get(article, 'id') === toInteger(id));
  }, [article, id]);

  useEffect(() => {
    if (!isReady) {
      fetchArticle(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article, id, isReady]);

  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState(0);

  const [articleTitle, setArticleTitle] = useState('');

  useEffect(() => {
    if (isReady) {
      console.log('Article loaded');
      setArticleTitle(get(article, 'title'));
      setWordCount(sum(map(get(articleContent, 'blocks'), (block) => words(get(block, 'data.text')).length), 0));
      setLastSaved(get(articleContent, 'time'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article, isReady]);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.width = `${(articleTitle.length * 12 + 60)}px`;
    }
  }, [titleRef, articleTitle]);

  // console.log(map(filter(get(articleContent, 'blocks', []), (block) => block.type === 'image'), (block) => get(block, 'data.file.url')));

  const linkList: Array<string> = uniq([
    ...map(filter(get(articleContent, 'blocks', []), (block) => block.type === 'image'), (block) => get(block, 'data.file.url')),
    ...get(article, 'image', '') ? [get(article, 'image', '')] : [],
  ]);

  const checks = [
    {
      name: 'Word count',
      check: () => wordCount >= 200,
      message: 'Word count must be at least 200',
    },
    {
      name: 'Title',
      check: () => articleTitle.length > 0 && articleTitle !== 'New article',
      message: 'Add a title',
    },
    {
      name: 'Image',
      check: () => get(article, 'image', ''),
      message: 'Add at least one image to your article',
    },
    {
      name: 'Thumbnail',
      check: () => get(article, 'image', ''),
      message: 'Add a thumbnail to your article',
    },
    {
      name: 'Category',
      check: () => get(article, 'category', ''),
      message: 'Add a category to your article',
    },
    {
      name: 'Description',
      check: () => get(article, 'description', ''),
      message: 'Add a description to your article',
    },
  ];

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
            if (articleTitle === get(article, 'title')) {
              return;
            }
            if (articleTitle === '') {
              setArticleTitle(get(article, 'title'));

              return;
            }
            updateArticle(id, { title: articleTitle });
          }}
          ref={titleRef}
          onChange={(e) => setArticleTitle(e.target.value)}
          value={articleTitle}
          className={classNames('editor-title-input', { focus: titleFocus })}
        />
      </div>
      <hr className={classNames('editor-title-hr', { focus: titleFocus, empty: (!articleTitle || articleTitle === 'New article') })} />

      <ImageSelection
        linkList={linkList}
        onImageSelection={(href) => {
          // console.log('Image selected' + href);
          updateArticle(id, { image: href });
        }}
        currentImage={get(article, 'image', '')}
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
          sx={{
            width: 'calc(100% - 150px)',

          }}
          severity="info"
        >
          <AlertTitle>Complete this steps to publish your article</AlertTitle>
          {map(checks, (check) => (
            <div key={check.name}>
              <FontAwesomeIcon
                icon={check.check() ? faCheckCircle : faTimesCircle}
                style={{
                  color: check.check() ? 'green' : 'red',
                  marginRight: '10px',
                }}
              />
              {check.message}
            </div>
          ))}
        </Alert>
      </div>
      <ArticleConfig
        id={id}
        wordCount={wordCount}
        lastSaved={lastSaved}
        updateArticle={updateArticle}
        article={article}
        categories={categories}
        tags={tags}
        addTag={addTag}
        removeTag={removeTag}
      />
      {isReady && (
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
    </main>
  );
}

export default ReactEditor;
