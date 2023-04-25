import React, {
  useEffect,
  useState,
} from 'react';
import { createReactEditorJS } from 'react-editor-js';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'universal-cookie';
import { Link, useParams } from 'react-router-dom';

import {
  sum, words, get, map, isEqual, toInteger, isEmpty, keyBy, size,
} from 'lodash';

import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHistory,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';

import { EDITOR_JS_TOOLS } from '../../utils/editor_constants';

import 'bulma/css/bulma.min.css';
import ArticleConfig from '../ArticleConfig';
import type { ArticleContent } from '../../store/articleStore';
// eslint-disable-next-line no-unused-vars
import { store } from '../../store';
import { actions, selectors } from '../../store/articleStore';
import TutorialModal from '../containers/TutorialModal';
import ActiveUsers from '../elements/ActiveUsers';
import SideBar from '../elements/SideBar';

const ReactEditorJS = createReactEditorJS();
const cookies = new Cookies();

function ReactEditor () {
  const [titleFocus, setTitleFocus] = useState(false);
  const titleRef = React.useRef(null);
  const { id } = useParams();

  // useSelector
  const article = useSelector((state) => selectors.article(state), isEqual);
  const articleContent = useSelector((state) => selectors.articleContent(state), isEqual);
  const articleBlocks = keyBy(get(articleContent, 'blocks'), 'id');
  const categories = useSelector((state) => selectors.getCategories(state), isEqual);
  const tags = useSelector((state) => selectors.getTags(state), isEqual);

  console.log('blocks', size(articleBlocks));

  // dispatch
  const dispatch = useDispatch();
  const fetchArticle = (ind) => dispatch(actions.fetchArticle(ind));
  const updateArticle = (articleId, payload) => dispatch(actions.updateArticle(articleId, payload));
  const updateArticleContentSilently = (articleId, newArticleContent: ArticleContent) => dispatch(actions.updateArticleContentSilently(articleId, newArticleContent));
  const addTag = (articleId, tagId) => dispatch(actions.addTag(articleId, tagId));
  const removeTag = (articleTagId) => dispatch(actions.removeTag(articleTagId));

  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState(0);
  const [articleTitle, setArticleTitle] = useState('');

  const [isReady, setIsReady] = useState(!isEmpty(article) && id && get(article, 'id') === toInteger(id));

  const [snapSidebar, setSnapSidebar] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    setIsReady(!isEmpty(article) && id && get(article, 'id') === toInteger(id));
  }, [article, id]);

  useEffect(() => {
    if (!isReady) {
      fetchArticle(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article, id, isReady]);

  const [openTutorialModal, setOpenTutorialModal] = useState(cookies.get('tutorial') !== 'true');

  useEffect(() => {
    if (isReady) {
      // console.log('Article loaded');
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

  const handleUploadEditorContent = (api) => {
    api.saver.save().then((newArticleContent: ArticleContent) => {
      updateArticleContentSilently(id, newArticleContent);
      setWordCount(sum(map(newArticleContent.blocks, (block) => words(get(block, 'data.text')).length), 0));
      setLastSaved(newArticleContent.time);
    });
  };

  return (
    <main
      className={classNames('editor-wrapper', {
        'editor-wrapper-snap': snapSidebar,
      })}
    >
      <TutorialModal
        open={openTutorialModal}
        onClose={() => {
          setOpenTutorialModal(false);
        }}
        onFinished={() => {
          cookies.set('tutorial', 'true', { path: '/' });
        }}
      />
      <div
        className={classNames('editor-title')}
        onClick={() => titleRef.current.focus()}
      >
        <div />

        <div className="editor-title-input-wrapper">
          {!titleFocus && <FontAwesomeIcon icon={faPenToSquare} />}
          <input
            type="text"
            placeholder="Enter a title..."
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
            className={classNames('editor-title-input', {
              focus: titleFocus,
              empty: (!articleTitle || articleTitle === 'New article'),
            })}
          />
        </div>
        <div className="editor-title-buttons">
          <ActiveUsers />
          <div
            onClick={(e) => {
              e.stopPropagation();
              setShowSidebar(!showSidebar);
            }}
            className={classNames('editor-history-button', {
              disabled: showSidebar,
            })
            }

          >
            <FontAwesomeIcon icon={faHistory} />
          </div>
          <Link
            onClick={(e) => {
              e.stopPropagation();
            }}
            to={`/publish/${id}`}
            className="editor-publish-button"
          >
            Review before publishing
          </Link>
        </div>
      </div>
      <hr className={classNames('editor-title-hr', { focus: titleFocus, empty: (!articleTitle || articleTitle === 'New article') })} />
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
      <SideBar
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        snapSidebar={snapSidebar}
        setSnapSidebar={setSnapSidebar}
      />
      {isReady && (
        <ReactEditorJS
          holder='editorjs'
          defaultValue={{
            blocks: get(articleContent, 'blocks', []),
          }}
          tools={EDITOR_JS_TOOLS}
          onChange={(api) => {
            handleUploadEditorContent(api);
          }}
          autofocus
          placeholder='Start your article here!'
        />
      )}

    </main>
  );
}

export default ReactEditor;
