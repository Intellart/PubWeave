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
import Navbar from '../containers/Navbar';
import Footer from '../containers/Footer';

// const ReactEditorJS = createReactEditorJS();

function ReactEditor () {
  const editorRef = React.useRef(null);
  const [defaultValue, setDefaultValue] = React.useState(null);
  const equationRef = React.useRef(null);

  async function fetchArticle () {
    if (isEmpty(defaultValue)) {
      const response = await API.getRequest('blog_articles/1');
      if (!isEmpty(response.article_content)) {
        setDefaultValue(response.article_content);
      } else {
        setDefaultValue({ blocks: [] });
      }

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
    <main className="editor-wrapper">
      <Navbar />
      <div ref={editorRef} id="editorjs" />

      <Footer />
    </main>
  );
}

export default ReactEditor;
