/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import EditorJS from '@editorjs/editorjs';
import { createReactEditorJS } from 'react-editor-js';
import { isEmpty } from 'lodash';

import * as API from '../../api';

import { EDITOR_JS_TOOLS } from '../../utils/editor_constants';

import logoImg from '../../images/LogoPubWeave.png';
import 'bulma/css/bulma.min.css';

// const ReactEditorJS = createReactEditorJS();

function ReactEditor () {
  const editorRef = React.useRef(null);
  const [defaultValue, setDefaultValue] = React.useState(null);

  async function fetchArticle () {
    if (isEmpty(defaultValue)) {
      const response = await API.getRequest('blog_articles/1');
      setDefaultValue(response.article_content);
      console.log('response', response);
    }
  }

  fetchArticle();

  useEffect(() => {
    if (!isEmpty(defaultValue)) {
      const editor = new EditorJS({
        holder: 'editorjs',
        data: {
          blocks: defaultValue.blocks,
        },
        tools: EDITOR_JS_TOOLS,
        /**
          * onChange callback
          */
        onChange: (api, event) => {
          // console.log('Now I know that Editor\'s content changed!', event);

          api.saver.save().then((articleContent) => {
            console.log('savedData', articleContent);

            API.putRequest('blog_articles/1', { blog_article: { article_content: articleContent } });
          });
        },
        autofocus: true,
        placeholder: 'Let`s write an awesome story!',
      });
    }
  }, [editorRef, defaultValue]);

  return (
    <main className="home-wrapper">
      <nav className='navbar'>
        <div className="search-wrapper">

          <img src={logoImg} alt="PubWeave Logo" className="nav--logo" width="40px" />

          <input className="input searchbar" type="text" placeholder="Search" />

          <div className="select filter">
            <select>
              <option>Filter</option>
              <option>Author</option>
            </select>
          </div>
        </div>

        <div className="navigation">
          <a href="/About">About</a>
          <a href="/About">Contact Us</a>
          <button className='submit-work'>Submit your research</button>
        </div>
      </nav>
      <div ref={editorRef} id="editorjs" />
    </main>
  );
}

export default ReactEditor;
