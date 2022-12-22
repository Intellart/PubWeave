import React, { useEffect } from 'react';
import { createReactEditorJS } from 'react-editor-js';
import { useDispatch, useSelector } from 'react-redux';

import {
  isEmpty, sum, words, get, filter, map,
} from 'lodash';

import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';

import Button from '@mui/material/Button';
import { EDITOR_JS_TOOLS } from '../../utils/editor_constants';

import 'bulma/css/bulma.min.css';
import Navbar from '../containers/Navbar';
import Footer from '../containers/Footer';
import ArticleConfig from '../ArticleConfig';
import type { ArticleContent } from '../../store/articleStore';
import { store } from '../../store';
import { actions } from '../../store/articleStore';

const ReactEditorJS = createReactEditorJS();

function ReactEditor () {
  // const editorRef = React.useRef(null);
  // const [articleContent, setArticleContent] = React.useState(null);
  const [titleFocus, setTitleFocus] = React.useState(false);
  const titleRef = React.useRef(null);
  const { id } = useParams();
  const defaultArticleSettings: ArticleContent = {
    title: 'Undefined',
    category: '',
    description: '',
    author: '',
    wordCount: 0,
    spellCheck: false,
    tags: [],
  };

  // define useSelector
  const article = useSelector((state) => get(state, 'article'));
  const articleContent = useSelector((state) => get(state, 'article.article_content'));
  const blocks = useSelector((state) => get(state, 'article.article_content.blocks'));

  // define dispatch
  const dispatch = useDispatch();
  const fetchArticle = (ind) => dispatch(actions.fetchArticle(ind));
  const updateArticle = (ind, as, ac) => dispatch(actions.updateArticle(ind, as, ac));

  const [articleSettings, setArticleSettings] = React.useState(defaultArticleSettings);
  const [stateReady, setStateReady] = React.useState(false);

  const handleArticleSettings = (action, e) => {
    const newArticleSettings = { ...articleSettings };
    switch (action) {
      case 'add_tag':
        console.log('add_tag', e);
        newArticleSettings.tags = [...articleSettings.tags, e];
        break;
      case 'remove_tag':
        console.log('remove_tag', e);
        newArticleSettings.tags = filter(articleSettings.tags, (tag) => tag !== e);
        break;
      case 'toggle_spell_check':
        newArticleSettings.spellCheck = e;
        break;
      case 'word_count':
        newArticleSettings.wordCount = e;
        break;
      case 'title':
        newArticleSettings.title = e;
        break;
      default:
        throw new Error('Invalid action');
    }
    setArticleSettings(newArticleSettings);
  };

  useEffect(() => {
    console.log('State changed: ', store.getState());
    if (isEmpty(article)) {
      fetchArticle(id);
    } else {
      console.log('Article already loaded');
      setStateReady(true);
      setArticleSettings({
        title: get(article, 'title'),
        category: get(article, 'article_content.category'),
        description: get(article, 'article_content.description'),
        tags: get(article, 'article_content.tags'),
        word_count: sum(map(get(article, 'article_content.blocks'), (block) => words(get(block, 'data.text')).length)),
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article]);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.width = `${(articleSettings.title.length * 12 + 60)}px`;
    }
  }, [titleRef, articleSettings.title]);

  const handleUploadEditorContent = (api) => {
    api.saver.save().then((newArticleContent) => {
      handleArticleSettings('word_count', sum(get(newArticleContent, 'blocks').map((block) => words(get(block, 'data.text')).length)));
      store.dispatch(actions.updateArticle(id, articleSettings, newArticleContent));
    });
  };

  return (
    <main className="editor-wrapper">
      <Navbar />
      <Button
        onClick={() => store.dispatch(actions.fetchArticle(id))}
        variant="contained"
      >
        Dispatch
      </Button>
      <Button
        variant="contained"
        onClick={() => console.log(store.getState())}
      >
        Console log
      </Button>
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
            updateArticle(id, articleSettings, articleContent);
          }}
          ref={titleRef}
          onChange={(e) => handleArticleSettings('title', e.target.value)}
          value={articleSettings.title}
          className={classNames('editor-title-input', { focus: titleFocus })}
        />
      </div>
      <hr className={classNames('editor-title-hr', { focus: titleFocus, empty: !articleSettings.title })} />
      <ArticleConfig
        articleSettings={articleSettings}
        lastSaved={get(article, 'article_content.time', 0)}
        onToggleSpellCheck={(e) => handleArticleSettings('toggle_spell_check', e)}
        addTag={(e) => {
          handleArticleSettings('add_tag', e);
        }}
        removeTag={(e) => {
          handleArticleSettings('remove_tag', e);
        }}
      />
      {stateReady && (
      <ReactEditorJS
        defaultValue={{
          blocks: blocks || [],
        }}
        tools={EDITOR_JS_TOOLS}
        onChange={(api) => {
          handleUploadEditorContent(api);
        }}
        autofocus
        placeholder='Start your article here!'
      />
      )}
      <Footer />
    </main>
  );
}

export default ReactEditor;
