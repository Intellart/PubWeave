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

import LatexPlugin from './latex_plugin';
import { ImageWrapper } from './editorExtensions/imageWrapper';
import { WordCounter } from './editorExtensions/wordCounter';
import CodeTool from './editorExtensions/codeHighlight';
import { uploadByFile, uploadByUrl } from './hooks';
import VersioningTune from './editorExtensions/versioningTune';
// import { MyTune } from './editorExtensions/tuneVersioning';
// import Code from '@editorjs/code';
// import editorjsCodeflask from '@calumk/editorjs-codeflask';
// import CodeBox from '@bomdi/codebox';
// import LinkTool from '@editorjs/link';
// import TextVariantTune from '@editorjs/text-variant-tune';
// import type { ToolConstructable, ToolSettings } from '@editorjs/editorjs';

export function useEditorTools (): { [toolName: string]: any} {
  return {
  // textVariant: TextVariantTune,
    myTune: {
      class: VersioningTune,
      config: {

      },
    },
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
          uploadByFile: (file: File) => uploadByFile(file, 'file'),
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
          uploadByFile: (file: File) => uploadByFile(file, 'file'),
          uploadByUrl,
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
    inlineCode: {
      class: InlineCode,
      shortcut: 'CMD+SHIFT+O',
    },
    wordCount: WordCounter,
    footnotes: FootnotesTune,
  // latexInline: LatexInline,
  };
}
