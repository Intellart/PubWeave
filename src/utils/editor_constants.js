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
import Image from '@editorjs/image';

import Tooltip from 'editorjs-tooltip';
import { words } from 'lodash';
// import { Cloudinary } from '@cloudinary/url-gen';
// import { AdvancedImage } from '@cloudinary/react';
import LatexPlugin from './latex_plugin';

// const cld = new Cloudinary({
//   cloud: {
//     cloudName: 'demo',
//   },
// });

// cld.image returns a CloudinaryImage with the configuration set.
// const myImage = cld.image('sample');
// const imageLink = myImage.toURL();

class ImageWrapper extends Image {
  render() {
    if (this.readOnly) {
      const wrapper = this.ui.render(this.data);
      // remove div from wrapper
      wrapper.querySelector('.cdx-input').remove();
      wrapper.querySelector('.cdx-button').remove();

      return wrapper;
    }

    return this.ui.render(this.data);
  }

  static get pasteConfig() {
    return {
      /**
       * Paste HTML into Editor
       */
      tags: [
        {
          img: { src: true },
        },
      ],
      /**
       * Paste URL of image into the Editor
       */
      patterns: {
        image: /https?:\/\/\S+\.(gif|jpe?g|tiff|png|svg|webp)(\?.*)?$/i,
      },

      /**
       * Drag n drop file from into the Editor
       */
      files: {
        mimeTypes: ['image/*'],
      },
    };
  }
}

class WordCounter {
  /**
   * Class name for term-tag
   *
   * @type {string}
   */
  static get CSS() {
    return 'cdx-marker';
  }

  /**
   * @param {{api: object}}  - Editor.js API
   */
  constructor({ api }) {
    this.api = api;

    /**
     * Toolbar Button
     *
     * @type {HTMLElement|null}
     */
    this.button = null;

    /**
     * Tag represented the term
     *
     * @type {string}
     */
    this.tag = 'MARK';

    /**
     * CSS classes
     */
    this.iconClasses = {
      base: this.api.styles.inlineToolButton,
      active: this.api.styles.inlineToolButtonActive,
    };
  }

  /**
   * Specifies Tool as Inline Toolbar Tool
   *
   * @return {boolean}
   */
  static get isInline() {
    return true;
  }

  /**
   * Create button element for Toolbar
   *
   * @return {HTMLElement}
   */
  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';
    // this.button.classList.add(this.iconClasses.base);
    this.button.classList.add('my-word-count-button');
    this.button.innerHTML = this.toolboxIcon;

    return this.button;
  }

  /**
   * Wrap/Unwrap selected fragment
   *
   * @param {Range} range - selected fragment
   */
  surround(range) {
    if (!range) {
      return;
    }

    const termWrapper = this.api.selection.findParentTag(this.tag, Marker.CSS);

    // console.log('termWrapper', termWrapper);

    /**
     * If start or end of selection is in the highlighted block
     */
    if (termWrapper) {
      this.unwrap(termWrapper);
    } else {
      this.wrap(range);
    }
  }

  /**
   * Wrap selection with term-tag
   *
   * @param {Range} range - selected fragment
   */
  wrap(range) {
    /**
     * Create a wrapper for highlighting
     */
    const marker = document.createElement(this.tag);

    marker.classList.add(Marker.CSS);

    /**
     * SurroundContent throws an error if the Range splits a non-Text node with only one of its boundary points
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Range/surroundContents}
     *
     * // range.surroundContents(span);
     */
    marker.appendChild(range.extractContents());
    range.insertNode(marker);

    /**
     * Expand (add) selection to highlighted block
     */
    this.api.selection.expandToTag(marker);
  }

  /**
   * Unwrap term-tag
   *
   * @param {HTMLElement} termWrapper - term wrapper tag
   */
  unwrap(termWrapper) {
    /**
     * Expand selection to all term-tag
     */
    this.api.selection.expandToTag(termWrapper);

    const sel = window.getSelection();
    const range = sel.getRangeAt(0);

    const unwrappedContent = range.extractContents();

    /**
     * Remove empty term-tag
     */
    termWrapper.parentNode.removeChild(termWrapper);

    /**
     * Insert extracted content
     */
    range.insertNode(unwrappedContent);

    /**
     * Restore selection
     */
    sel.removeAllRanges();
    sel.addRange(range);
  }

  /**
   * Check and change Term's state for current selection
   */
  checkState() {
    const termTag = this.api.selection.findParentTag(this.tag, Marker.CSS);

    this.button.classList.toggle(this.iconClasses.active, !!termTag);
  }

  /**
   * Get Tool icon's SVG
   * @return {string}
   */
  get toolboxIcon() {
    document.onmousemove = () => {
      const selection = window.getSelection().toString();

      this.button.innerHTML = `${words(selection).length} words`;
    };

    return '';
  }

  /**
   * Sanitizer rule
   * @return {{mark: {class: string}}}
   */
  static get sanitize() {
    return {
      mark: {
        class: Marker.CSS,
      },
    };
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
    class: LatexPlugin,
    inlineToolbar: true,
  },
  warning: Warning,
  code: Code,
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

};
