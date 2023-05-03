// eslint-disable-next-line max-classes-per-file
import Embed from '@editorjs/embed';
import Table from '@editorjs/table';
import List from '@editorjs/list';
import Warning from '@editorjs/warning';
import Code from '@editorjs/code';
import LinkTool from '@editorjs/link';
import Raw from '@editorjs/raw';
import HeaderAPI from '@editorjs/header';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import CheckList from '@editorjs/checklist';
import Delimiter from '@editorjs/delimiter';
import InlineCode from '@editorjs/inline-code';
import Tooltip from 'editorjs-tooltip';
import LatexPlugin from './latex_plugin';
import { ImageWrapper } from './editorExtensions/imageWrapper';
import { WordCounter } from './editorExtensions/wordCounter';
import CodeTool from './editorExtensions/codeHighlight';

export const EDITOR_JS_TOOLS = {
  tooltip: {
    class: Tooltip,
    config: {
      location: 'left',
      highlightColor: '#FFEFD5',
      underline: true,
      backgroundColor: '#154360',
      textColor: '#FDFEFE',
      holder: 'editorId',
    },
  },
  embed: {
    class: Embed,
    inlineToolbar: true,
  },
  table: Table,
  marker: Marker,
  list: List,
  math: {
    class: LatexPlugin,
    inlineToolbar: true,
  },
  warning: Warning,
  code: Code,
  myCode: CodeTool,
  linkTool: LinkTool,
  image: {
    class: ImageWrapper,
    inlineToolbar: ['link'],
    config: {

      uploader: {

        uploadByFile(file) {
        // your own uploading logic here
          // console.log('uploadByFile', file);

          const data = new FormData();
          data.append('file', file);
          data.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
          data.append('cloud_name', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);

          return fetch(`${process.env.REACT_APP_CLOUDINARY_UPLOAD_URL}${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'post',
            body: data,
          }).then((res) => res.json())
            .then((d) => ({
              success: 1,
              file: {
                url: d.url,
              },
            }))
            .catch((/* err */) => {
              // console.log('err', err);
            });
        },

        uploadByUrl(url) {
          // console.log('uploadByUrl', url);

          return new Promise((resolve) => {
            resolve({
              success: 1,
              file: {
                url,
              },
            });
          });
        },
      },
      // actions: [
      //   // {
      //   //   name: 'new_button',
      //   //   icon: '<svg>...</svg>',
      //   //   title: 'New Button',
      //   //   toggle: true,
      //   //   action: (name) => {
      //   //     alert(`${name} button clicked`);
      //   //   },
      //   // },
      // ],
    },
  },
  raw: Raw,
  header: HeaderAPI,
  quote: Quote,
  checklist: CheckList,
  delimiter: Delimiter,
  inlineCode: InlineCode,
  wordCount: WordCounter,
  // latexInline: LatexInline,
};
