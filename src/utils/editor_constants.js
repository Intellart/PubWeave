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

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPerson } from '@fortawesome/free-solid-svg-icons';
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
  versionInfo: any,
};

type VersioningInfoCardProps = {
  block: any,
  onClose: any,
  versionInfo: any,
};

export function useEditorTools ({ versioningBlockId, versionBlock, versionInfo }: Props): { [toolName: string]: any} {
  function VersioningInfoCard(props:VersioningInfoCardProps) {
    // console.log(props.versionInfo);

    return (
      <>
        <div
          className="cdx-versioning-info-card-close"
          onClick={() => {
            props.onClose();
          }}
        > Close
        </div>
        <button
          type="button"
          className="cdx-versioning-info-card-button"
          onClick={() => {
            props.versionInfo.current.onViewVersions();
          }}
        >
          Show history
        </button>

        <div className="cdx-versioning-info-card-row">
          <div className="cdx-versioning-info-card-row-item">
            <p className="cdx-versioning-info-card-row-item-title">Block ID</p>
            <p
              className="cdx-versioning-info-card-row-item-value"
              id="cdx-versioning-info-card-block-id"
            >
              {props.block.id}
            </p>
          </div>
          <div className="cdx-versioning-info-card-row-item">
            <p className="cdx-versioning-info-card-row-item-title">Last updated</p>
            <p
              className="cdx-versioning-info-card-row-item-value"
              id="cdx-versioning-info-card-last-updated"
            > {props.versionInfo.current.lastUpdated}
            </p>
          </div>
        </div>
        <div className="cdx-versioning-info-card-row">
          <div className="cdx-versioning-info-card-row-item">
            <p className="cdx-versioning-info-card-row-item-title">Author name</p>
            <p
              className="cdx-versioning-info-card-row-item-value"
              id="cdx-versioning-info-card-author-name"
            > {props.versionInfo.current.author}
            </p>
          </div>

        </div>

      </>
    );
  }

  class MyTune {
    api: any;

    data: any;

    config: any;

    block: any;

    wrapper: any;

    vb: any;

    vbId: any;

    toggleClass: string;

    vbInfo: any;

    constructor({
      api, data, config, block,
    }: any) {
      this.api = api;
      this.data = data;
      this.config = config;
      this.block = block;

      this.vbId = versioningBlockId;
      this.vb = versionBlock;
      this.vbInfo = versionInfo;

      this.toggleClass = 'cdx-versioning-selected';

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
      // const tuneWrapper = document.createElement('button');
      // tuneWrapper.classList.add(this.api.styles.settingsButton);

      // const toggler = document.createElement('div');
      // toggler.classList.add(this.api.styles.settingsButton);
      // tuneWrapper.classList.toggle(this.api.styles.settingsButtonActive, this.vbId.current === this.block.id);

      // const root = createRoot(tuneWrapper);
      // root.render(
      //   <div className="cdx-versioning-info-card__title">😸 Block settings</div>,
      // );

      // this.api.tooltip.onHover(tuneWrapper, 'Block settings', {
      //   placement: 'top',
      //   hidingDelay: 500,
      // });

      const svgIcon = document.createElement('div');
      const root2 = createRoot(svgIcon);
      root2.render(
        <FontAwesomeIcon
          className="cdx-svg-icon-versioning"
          icon={faPerson}
        />,
      );

      const svg = svgIcon.querySelector('.cdx-svg-icon-versioning');

      return {
        icon: svg,
        label: 'Block settings',
        toggle: true,
        onActivate: () => {
          this.tuneClicked();
        },
        isActive: this.vbId.current === this.block.id,
      };
    }

    generateInfoCard(): any {
      const infoCard = document.createElement('div');
      infoCard.classList.add('cdx-versioning-info-card');
      infoCard.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      const root = createRoot(infoCard);
      root.render(
        <VersioningInfoCard
          block={this.block}
          versionInfo={this.vbInfo}
          onClose={() => {
            this.uncheckOldWrapper();
            this.vbId.current = null;
            this.vb.current = null;
          }}

        />,
      );

      return infoCard;
    }

    uncheckOldWrapper(): any {
      const vbWrapper = this.vb.current?.closest(`.${this.toggleClass}`);
      if (vbWrapper) vbWrapper.classList.remove(this.toggleClass);

      const infoCard = this.vb.current.querySelector('.cdx-versioning-info-card');
      this.vb.current.removeChild(infoCard);
    }

    checkCurrentWrapper(): any {
      if (this.wrapper) this.wrapper.classList.add(this.toggleClass);
    }

    tuneClicked(): any {
      // this.toggleButton(event);
      const blockContent = this.wrapper.querySelector('.ce-block__content');

      if (this.vbId.current !== null) {
        this.uncheckOldWrapper();
      }

      if (this.vbId.current === this.block.id) {
        this.vbId.current = null;
        this.vb.current = null;
      } else if (this.vbId.current !== this.block.id) {
        this.checkCurrentWrapper();

        this.vbId.current = this.block.id;
        this.vb.current = blockContent;

        blockContent.appendChild(this.generateInfoCard());
      }
    }

    wrap(blockContent: any) : any {
      this.wrapper = document.createElement('div');
      this.wrapper.appendChild(blockContent);

      return this.wrapper;
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
