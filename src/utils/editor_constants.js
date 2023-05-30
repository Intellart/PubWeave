// eslint-disable-next-line max-classes-per-file
import Embed from '@editorjs/embed';
import Table from '@editorjs/table';
import List from '@editorjs/list';
import Warning from '@editorjs/warning';
import Code from '@editorjs/code';
// import LinkTool from '@editorjs/link';
import Raw from '@editorjs/raw';
import HeaderAPI from '@editorjs/header';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import CheckList from '@editorjs/checklist';
import Delimiter from '@editorjs/delimiter';
import InlineCode from '@editorjs/inline-code';
import Tooltip from 'editorjs-tooltip';
// import TextVariantTune from '@editorjs/text-variant-tune';
import LatexPlugin from './latex_plugin';
import { ImageWrapper } from './editorExtensions/imageWrapper';
import { WordCounter } from './editorExtensions/wordCounter';
import CodeTool from './editorExtensions/codeHighlight';

export class MyTune {
  constructor({
    api, data, config, block,
  }) {
    this.api = api;
    this.data = data;
    this.config = config;
    this.block = block;

    this.wrapper = undefined;
  }

  static get isTune() {
    return true;
  }

  static get CSS() {
    return {
      toggler: 'cdx-text-variant__toggler', // has svg icon
    };
  }

  render() {
    const tuneWrapper = document.createElement('div');
    tuneWrapper.setAttribute('class', '');

    const toggler = document.createElement('div');
    toggler.classList.add(this.api.styles.settingsButton);
    toggler.innerHTML = '😸 Call-out';

    toggler.dataset.name = 'call-out';

    this.api.tooltip.onHover(toggler, 'Call-out', {
      placement: 'top',
      hidingDelay: 500,
    });

    tuneWrapper.appendChild(toggler);

    this.api.listeners.on(tuneWrapper, 'click', (event) => {
      this.tuneClicked(event);

      console.log('H button clicked');
      console.log('block', this.block.id);
    });

    return tuneWrapper;
  }

  tuneClicked(event) {
    const tune = event.target.closest(`.${this.api.styles.settingsButton}`); // get the closest element with the class
    const isEnabled = tune.classList.contains(this.api.styles.settingsButtonActive);

    tune.classList.toggle(this.api.styles.settingsButtonActive, !isEnabled);

    this.variant = !isEnabled ? tune.dataset.name : '';
  }

  wrap(blockContent) {
    this.wrapper = document.createElement('div');

    this.variant = this.data;

    this.wrapper.appendChild(blockContent);

    return this.wrapper;
  }

  set variant(name) {
    this.data = name;

    // this.variants.forEach((variant) => {
    //   this.wrapper.classList.toggle(`cdx-text-variant--${variant.name}`, variant.name === this.data);
    // });

    this.wrapper.classList.toggle('cdx-text-variant--call-out', this.data === 'call-out');
  }

  save() {
    return this.data || '';
  }
}

export const EDITOR_JS_TOOLS = {
  // textVariant: TextVariantTune,
  myTune: MyTune,
  tooltip: {
    class: Tooltip,
    config: {
      location: 'left',
      highlightColor: '#FFEFD5',
      underline: true,
      backgroundColor: '#154360',
      textColor: '#FDFEFE',
      holder: 'editorjs',
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
  // linkTool: LinkTool,
  image: {
    class: ImageWrapper,
    inlineToolbar: ['link'],
    config: {

      uploader: {

        uploadByFile(file) {
        // your own uploading logic here
          console.log('uploadByFile', file);

          const data = new FormData();
          data.append('file', file);
          data.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
          data.append('cloud_name', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);

          return fetch(`${process.env.REACT_APP_CLOUDINARY_UPLOAD_URL}${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'post',
            body: data,
          }).then((res) => res.json())
            .then((d) => {
              console.log('d', d);

              return {
                success: 1,
                file: {
                  url: d.url,
                  asset_id: d.asset_id,
                  public_id: d.public_id,
                  folder: d.folder,
                  signature: d.signature,
                },
              };
            })
            .catch((/* err */) => {
              // console.log('err', err);
            });
        },

        uploadByUrl(url) {
          console.log('uploadByUrl', url);

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
