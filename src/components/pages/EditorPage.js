/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import EditorJS from '@editorjs/editorjs';
import { createReactEditorJS } from 'react-editor-js';
import {
  isEmpty, sum, words, get,
} from 'lodash';

import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import * as API from '../../api';

import { EDITOR_JS_TOOLS } from '../../utils/editor_constants';

import logoImg from '../../images/LogoPubWeave.png';
import 'bulma/css/bulma.min.css';
import Navbar from '../containers/Navbar';
import Footer from '../containers/Footer';
import ArticleConfig from '../ArticleConfig';

// const ReactEditorJS = createReactEditorJS();

function ReactEditor () {
  const editorRef = React.useRef(null);
  const [defaultValue, setDefaultValue] = React.useState(null);
  const [editor, setEditor] = React.useState(null);
  const [titleFocus, setTitleFocus] = React.useState(false);
  const titleRef = React.useRef(null);
  const equationRef = React.useRef(null);
  const { id } = useParams();
  const [articleSettings, setArticleSettings] = React.useState({
    title: '',
    category: '',
    description: '',
    author: '',
    wordCount: 0,
    spellCheck: false,
  });

  const toggleSpellCheck = (e) => {
    setArticleSettings({
      ...articleSettings,
      spellCheck: e,
    });
  };

  async function fetchArticle () {
    if (isEmpty(defaultValue)) {
      const response = await API.getRequest(`blog_articles/${id}`);
      if (!isEmpty(response.article_content)) {
        setDefaultValue(response.article_content);
      } else {
        setDefaultValue({ blocks: [] });
        // API.postRequest('blog_articles/1', { blog_article: { title: 'Test Arqsdstttdrggrtsadiclse', article_content: { test: 'test' } } });
      }
      setArticleSettings({
        ...articleSettings,
        wordCount: sum(get(response, 'article_content.blocks').map((block) => words(get(block, 'data.text')).length)),
        title: response.title || 'Undefined',
      });

      console.log('response', response);
    }
  }

  fetchArticle();

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.width = `${(articleSettings.title.length * 12 + 60)}px`;
    }
  }, [titleRef, articleSettings.title]);

  useEffect(() => {
    if (!isEmpty(defaultValue) && isEmpty(editor)) {
      setEditor(new EditorJS({
        holder: 'editorjs',
        data: {
          blocks: defaultValue.blocks,
        },
        tools: EDITOR_JS_TOOLS,
        /**
          * onChange callback
          */
        onChange: (api, event) => {
          api.saver.save().then((articleContent) => {
            setArticleSettings({
              ...articleSettings,
              wordCount: sum(get(articleContent, 'blocks').map((block) => words(get(block, 'data.text')).length)),
            });
            console.log('savedData', articleContent);

            API.putRequest(`blog_articles/${id}`, { blog_article: { title: articleSettings.title, article_content: articleContent } });
            setDefaultValue(articleContent);
          });
        },
        autofocus: true,
        placeholder: 'Let`s write an awesome story!',
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue, editorRef, editor, articleSettings]);

  return (
    <main className="editor-wrapper">
      <Navbar />
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
            API.putRequest(`blog_articles/${id}`, { blog_article: { title: articleSettings.title, article_content: defaultValue } });
          }}
          ref={titleRef}
          onChange={(e) => setArticleSettings({ ...articleSettings, title: e.target.value })}
          value={articleSettings.title}
          className={classNames('editor-title-input', { focus: titleFocus })}
        />
      </div>
      <hr className={classNames('editor-title-hr', { focus: titleFocus, empty: !articleSettings.title })} />
      <div
        spellCheck={articleSettings.spellCheck ? 'true' : 'false'}
        ref={editorRef}
        id="editorjs"
      >
        <ArticleConfig
          wordCount={articleSettings.wordCount}
          lastSaved={get(defaultValue, 'time', 0)}
          onToggleSpellCheck={(e) => toggleSpellCheck(e)}
          toggleSpellCheck={articleSettings.spellCheck}
        />
      </div>

      <Footer />
    </main>
  );
}

export default ReactEditor;
