/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import EditorJS from '@editorjs/editorjs';
import { createReactEditorJS } from 'react-editor-js';
import {
  isEmpty, sum, words, get, filter, map,
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
import type { ArticleContent } from '../../store/articleStore';
import { fetchArticle, updateArticle } from '../../store/articleStore';

// const ReactEditorJS = createReactEditorJS();

function ReactEditor () {
  const editorRef = React.useRef(null);
  const [articleContent, setArticleContent] = React.useState(null);
  const [editor, setEditor] = React.useState(null);
  const [titleFocus, setTitleFocus] = React.useState(false);
  const titleRef = React.useRef(null);
  const equationRef = React.useRef(null);
  const { id } = useParams();
  const defaultArticleSettings: ArticleContent = {
    title: '',
    category: '',
    description: '',
    author: '',
    wordCount: 0,
    spellCheck: false,
    tags: [],
  };

  const [articleSettings, setArticleSettings] = React.useState(defaultArticleSettings);

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

  console.log('title', articleSettings.title);

  useEffect(() => {
    if (isEmpty(articleContent)) {
      const response = fetchArticle(id);
      if (!isEmpty(response.article_content)) {
        setArticleContent(response.article_content);
      } else {
        setArticleContent({ blocks: [] });
      }
      handleArticleSettings('title', response.title || 'Undefined');
      handleArticleSettings('word_count', sum(map(get(response, 'article_content.blocks'), (block) => words(get(block, 'data.text')).length)));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleContent, id]);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.width = `${(articleSettings.title.length * 12 + 60)}px`;
    }
  }, [titleRef, articleSettings.title]);

  const handleUploadEditorContent = (api) => {
    api.saver.save().then((newArticleContent) => {
      handleArticleSettings('word_count', sum(get(newArticleContent, 'blocks').map((block) => words(get(block, 'data.text')).length)));
      console.log('savedData', newArticleContent);

      updateArticle(id, articleSettings, newArticleContent);
      setArticleContent(newArticleContent);
    });
  };

  useEffect(() => {
    if (!isEmpty(articleContent) && isEmpty(editor)) {
      setEditor(new EditorJS({
        holder: 'editorjs',
        data: {
          blocks: articleContent.blocks,
        },
        tools: EDITOR_JS_TOOLS,
        onChange: (api, event) => {
          handleUploadEditorContent(api);
        },
        autofocus: true,
        placeholder: 'Start your article here!',
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleContent, editorRef, editor, articleSettings.title, articleSettings]);

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
            updateArticle(id, articleSettings, articleContent);
          }}
          ref={titleRef}
          onChange={(e) => handleArticleSettings('title', e.target.value)}
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
          articleSettings={articleSettings}
          lastSaved={get(articleContent, 'time', 0)}
          onToggleSpellCheck={(e) => handleArticleSettings('toggle_spell_check', e)}
          addTag={(e) => {
            handleArticleSettings('add_tag', e);
          }}
          removeTag={(e) => {
            handleArticleSettings('remove_tag', e);
          }}
        />
      </div>

      <Footer />
    </main>
  );
}

export default ReactEditor;
