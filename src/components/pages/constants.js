import Embed from '@editorjs/embed';
import Table from '@editorjs/table';
import List from '@editorjs/list';
import Warning from '@editorjs/warning';
import Code from '@editorjs/code';
import LinkTool from '@editorjs/link';
// import Image from '@editorjs/image';
import Raw from '@editorjs/raw';
import Header from '@editorjs/header';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import CheckList from '@editorjs/checklist';
import Delimiter from '@editorjs/delimiter';
import InlineCode from '@editorjs/inline-code';
import SimpleImageApi from '@editorjs/simple-image';

import MathTexApi from 'editorjs-math';
import Tooltip from 'editorjs-tooltip';

class MathTex extends MathTexApi {
  constructor({ data, config, api }) {
    super({ data, config, api });
  }

  enableEditing() {
    super.enableEditing();
    console.log('enableEditing');

    // add button child to this.textNode
    const button = document.createElement('button');
    button.innerText = 'Click me';
    button.addEventListener('click', () => {
      console.log('button clicked');
    });
    this.textNode.appendChild(button);
  }
}

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
    class: MathTex,
    inlineToolbar: true,
  },
  warning: Warning,
  code: Code,
  linkTool: LinkTool,
  image: {
    class: Image,
    inlineToolbar: ['link'],
    config: {
      /**
       * Custom uploader
       */
      uploader: {
        /**
         * Upload file to the server and return an uploaded image data
         * @param {File} file - file selected from the device or pasted by drag-n-drop
         * @return {Promise.<{success, file: {url}}>}
         */
        uploadByFile(file) {
          // your own uploading logic here
          return MyAjax.upload(file).then(() => ({
            success: 1,
            file: {
              url: 'https://codex.so/upload/redactor_images/o_80beea670e49f04931ce9e3b2122ac70.jpg',
              // any other image data you want to store, such as width, height, color, extension, etc
            },
          }));
        },

        /**
         * Send URL-string to the server. Backend should load image by this URL and return an uploaded image data
         * @param {string} url - pasted image URL
         * @return {Promise.<{success, file: {url}}>}
         */
        // eslint-disable-next-line no-unused-vars
        uploadByUrl(url) {
          console.log('uploadByUrl', url);

          // your ajax request for uploading
          return MyAjax.upload(file).then(() => ({
            success: 1,
            file: {
              url: 'https://codex.so/upload/redactor_images/o_e48549d1855c7fc1807308dd14990126.jpg',
              // any other image data you want to store, such as width, height, color, extension, etc
            },
          }));
        },
      },
    },
  },
  simpleImage: {
    class: SimpleImageApi,
    inlineToolbar: ['link'],
    config: {
      uploader: {
        uploadByURL(url) {
          console.log('uploadByURL', url);

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
    },
  },
  raw: Raw,
  header: Header,
  quote: Quote,
  checklist: CheckList,
  delimiter: Delimiter,
  inlineCode: InlineCode,

};
