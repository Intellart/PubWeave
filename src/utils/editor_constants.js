/* eslint-disable no-console */
import Embed from '@editorjs/embed';
import Table from '@editorjs/table';
import List from '@editorjs/list';
import Warning from '@editorjs/warning';
import Code from '@editorjs/code';
import LinkTool from '@editorjs/link';
// import Image from '@editorjs/image';
import Raw from '@editorjs/raw';
import HeaderAPI from '@editorjs/header';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import CheckList from '@editorjs/checklist';
import Delimiter from '@editorjs/delimiter';
import InlineCode from '@editorjs/inline-code';
import SimpleImageApi from '@editorjs/simple-image';

import Tooltip from 'editorjs-tooltip';
import { words } from 'lodash';
import LatexPlugin from './latex_plugin';

export default class Testing {
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
    this.button.classList.add(this.iconClasses.base);
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

    console.log('termWrapper', termWrapper);

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

// class MathTex extends MathTexApi {
//   constructor({ data, config, api }) {
//     super({ data, config, api });
//   }

//   enableEditing() {
//     if (this.textNode) {
//       this.textNode.hidden = false;

//       return false;
//     }

//     this.textNode = document.createElement('math-field');
//     this.textNode.contentEditable = true;
//     this.textNode.id = 'mf';
//     // this.data.text = '\\text{Equation:}';
//     this.textNode.value = this.data.text === 'equation:' ? mfe.value : this.data.text;
//     this.textNode.hidden = true;
//     this.textNode.className = 'text-node';
//     this.textNode.setOptions({
//       virtualKeyboardMode: 'manual',
//       virtualKeyboards: 'numeric symbols',
//     });
//     this._element.appendChild(this.textNode);
//   }
// }

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
  // image: {
  //   class: Image,
  //   inlineToolbar: ['link'],
  // config: {
  //   /**
  //    * Custom uploader
  //    */
  //   uploader: {
  //     /**
  //      * Upload file to the server and return an uploaded image data
  //      * @param {File} file - file selected from the device or pasted by drag-n-drop
  //      * @return {Promise.<{success, file: {url}}>}
  //      */
  //     uploadByFile(file) {
  //       // your own uploading logic here
  //       return MyAjax.upload(file).then(() => ({
  //         success: 1,
  //         file: {
  //           url: 'https://codex.so/upload/redactor_images/o_80beea670e49f04931ce9e3b2122ac70.jpg',
  //           // any other image data you want to store, such as width, height, color, extension, etc
  //         },
  //       }));
  //     },

  //     /**
  //      * Send URL-string to the server. Backend should load image by this URL and return an uploaded image data
  //      * @param {string} url - pasted image URL
  //      * @return {Promise.<{success, file: {url}}>}
  //      */
  //     // eslint-disable-next-line no-unused-vars
  //     uploadByUrl(url) {
  //       console.log('uploadByUrl', url);

  //       // your ajax request for uploading
  //       return MyAjax.upload(file).then(() => ({
  //         success: 1,
  //         file: {
  //           url: 'https://codex.so/upload/redactor_images/o_e48549d1855c7fc1807308dd14990126.jpg',
  //           // any other image data you want to store, such as width, height, color, extension, etc
  //         },
  //       }));
  //     },
  //   },
  // },
  // },
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
  header: HeaderAPI,
  quote: Quote,
  checklist: CheckList,
  delimiter: Delimiter,
  inlineCode: InlineCode,
  testing: Testing,

};
