// @flow
// eslint-disable-next-line max-classes-per-file
import Embed from '@editorjs/embed';
import Table from '@editorjs/table';
import List from '@editorjs/list';
import Warning from '@editorjs/warning';
import Raw from '@editorjs/raw';
import HeaderAPI from '@editorjs/header';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import CheckList from '@editorjs/checklist';
import Delimiter from '@editorjs/delimiter';
import InlineCode from '@editorjs/inline-code';
import Tooltip from 'editorjs-tooltip';
import FootnotesTune from '@editorjs/footnotes';
import AttachesTool from '@editorjs/attaches';
import InlineImage from 'editorjs-inline-image';
import React from 'react';
import { createRoot } from 'react-dom/client';

import LatexPlugin from './latex_plugin';
import { ImageWrapper } from './editorExtensions/imageWrapper';
import { WordCounter } from './editorExtensions/wordCounter';
import CodeTool from './editorExtensions/codeHighlight';
// import { MyTune } from './editorExtensions/tuneVersioning';
// import Code from '@editorjs/code';
// import editorjsCodeflask from '@calumk/editorjs-codeflask';
// import CodeBox from '@bomdi/codebox';
// import LinkTool from '@editorjs/link';
// import TextVariantTune from '@editorjs/text-variant-tune';
// import type { ToolConstructable, ToolSettings } from '@editorjs/editorjs';

type Props = {
  versioningBlockId: any,
  versionBlock: any,
};

export function useEditorTools ({ versioningBlockId, versionBlock }: Props): { [toolName: string]: any} {
  class MyTune {
    api: any;

    data: any;

    config: any;

    block: any;

    wrapper: any;

    vb: any;

    vbId: any;

    constructor({
      api, data, config, block,
    }: any) {
      this.api = api;
      this.data = data;
      this.config = config;
      this.block = block;

      this.vbId = versioningBlockId;
      this.vb = versionBlock;

      // console.log('constructor', this.block.id);

      this.wrapper = undefined;
    }

    static get isTune(): any {
      return true;
    }

    static get CSS(): any {
      return {
        toggler: 'cdx-text-variant__toggler', // has svg icon
      };
    }

    render(): any {
      const tuneWrapper = document.createElement('div');
      tuneWrapper.setAttribute('class', '');

      const toggler = document.createElement('div');
      toggler.classList.add(this.api.styles.settingsButton);
      toggler.innerHTML = '😸 Block settings';

      toggler.dataset.name = 'call-out';

      this.api.tooltip.onHover(toggler, 'Block settings', {
        placement: 'top',
        hidingDelay: 500,
      });

      tuneWrapper.appendChild(toggler);

      this.api.listeners.on(tuneWrapper, 'click', (event) => {
        this.tuneClicked(event);

        // console.log('H button clicked');
        // console.log('block', this.block.id);
      });

      return tuneWrapper;
    }

    generateInfoCard(): any {
      const infoCard = document.createElement('div');
      infoCard.classList.add('cdx-versioning-info-card');

      const root = createRoot(infoCard); // createRoot(container!) if you use TypeScript
      root.render(
        <>
          <div className="cdx-versioning-info-card__title">Block settings</div>
          <div className="cdx-versioning-info-card__description">Highlight important information in your article.</div>
          <div className="cdx-versioning-info-card__example">
            <div className="cdx-versioning-info-card__example-title">Example</div>
            <div className="cdx-versioning-info-card__example-content">This is a call-out.</div>
          </div>
          <div className="cdx-versioning-info-card-close">
            <p className="cdx-versioning-info-card-close-text">Close</p>
          </div>

        </>,
      );

      return infoCard;
    }

    toggleButton(event: any, isEnabled: any): any {
      const tune = event.target.closest(`.${this.api.styles.settingsButton}`); // button element
      tune.classList.toggle(this.api.styles.settingsButtonActive, !isEnabled);

      this.variant = !isEnabled ? tune.dataset.name : '';
    }

    tuneClicked(event: any): any {
      const isEnabled = this.vbId.current === this.block.id;

      this.toggleButton(event, isEnabled);

      const blockContent = this.wrapper.querySelector('.ce-block__content');

      // remove cdx-versioning-info-card if it exists
      const existingInfoCard = document.querySelector('.cdx-versioning-info-card');
      if (existingInfoCard) {
        existingInfoCard.remove();

        const allWrappers = document.querySelectorAll('.cdx-versioning-selected');
        allWrappers.forEach((wrapper) => {
          if (wrapper !== this.wrapper) {
            wrapper.classList.remove('cdx-versioning-selected');

            const blockContent2 = wrapper.querySelector('.ce-block__content');

            if (blockContent2) {
              const child = blockContent2.querySelector('.cdx-versioning-info-card');
              if (child) blockContent2.removeChild(child);
            }
          }
        });
      }

      blockContent.appendChild(this.generateInfoCard());

      console.log('CURRENT', this.vbId.current, this.vb.current);
      console.log(blockContent, this.wrapper);

      if (this.vbId.current === this.block.id) {
        this.vbId.current = null;
        this.vb.current = null;
      } else {
        this.vbId.current = this.block.id;
        this.vb.current = this.block;
      }

      // console.log('versioningBlock', versioningBlock);
      // console.log('this.vb', this.vb);
    }

    wrap(blockContent: any) : any {
      this.wrapper = document.createElement('div');
      this.variant = this.data;
      this.wrapper.appendChild(blockContent);

      return this.wrapper;
    }

    set variant(name: any): any {
      this.data = name;
      this.wrapper.classList.toggle('cdx-versioning-selected', this.data === 'call-out');
    }

    save(): any {
      return this.data || '';
    }
  }

  return {
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
    attaches: {
      class: AttachesTool,
      config: {
        uploader: {
        // endpoint: 'http://localhost:8008/uploadFile'
          uploadByFile(file: any):any {
          // your own uploading logic here
            console.log('uploadByFile', file);

            const data = new FormData();
            data.append('file', file);
            data.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || '');
            data.append('cloud_name', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || '');

            return fetch(`${process.env.REACT_APP_CLOUDINARY_UPLOAD_URL || ''}${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || ''}/image/upload`, {
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
        },
      },
    },
    embed: {
      class: Embed,
      inlineToolbar: true,
    },
    paragraph: {
      tunes: ['footnotes', 'myTune'],
    },
    table: Table,
    marker: Marker,
    list: {
      class: List,
      tunes: ['footnotes', 'myTune'],
    },
    math: {
      class: LatexPlugin,
      inlineToolbar: true,
    },
    warning: Warning,
    // code: editorjsCodeflask,
    // codeBox: {
    //   class: CodeBox,
    //   config: {
    //     themeURL: 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.18.1/build/styles/dracula.min.css', // Optional
    //     themeName: 'atom-one-dark', // Optional
    //     useDefaultTheme: 'light', // Optional. This also determines the background color of the language select drop-down
    //   },
    // },
    // code: Code,
    myCode: CodeTool,
    // linkTool: LinkTool,
    image: {
      class: ImageWrapper,
      inlineToolbar: ['link'],
      config: {

        uploader: {

          uploadByFile(file: any):any {
            // your own uploading logic here
            console.log('uploadByFile', file);

            const data = new FormData();
            data.append('file', file);
            data.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || '');
            data.append('cloud_name', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || '');

            return fetch(`${process.env.REACT_APP_CLOUDINARY_UPLOAD_URL || ''}${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || ''}/image/upload`, {
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

          uploadByUrl(url: any): any {
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
    inlineImage: {
      class: InlineImage,
      inlineToolbar: true,
      config: {
        embed: {
          display: true,
        },
        unsplash: {
          appName: 'Science editor image plugin',
          clientId: process.env.REACT_APP_UNSPLASH_ACCESS_KEY,
        },
      },
    },
    raw: Raw,
    header: HeaderAPI,
    quote: Quote,
    checklist: CheckList,
    delimiter: Delimiter,
    inlineCode: InlineCode,
    wordCount: WordCounter,
    footnotes: FootnotesTune,
  // latexInline: LatexInline,
  };
}
