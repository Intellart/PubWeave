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
// import FootnotesTune from '@editorjs/footnotes';
import AttachesTool from '@editorjs/attaches';
import InlineImage from 'editorjs-inline-image';

import AlignmentTuneTool from 'editorjs-text-alignment-blocktune';
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash';
import LatexPlugin from './latex_plugin';
import { ImageWrapper } from './editorExtensions/imageWrapper';
import { WordCounter } from './editorExtensions/wordCounter';
import CodeTool from './editorExtensions/codeHighlight';
import { uploadByFile, uploadByUrl } from './hooks';
import VersioningTune from './editorExtensions/versioningTune';
import ReviewTool from './editorExtensions/reviewTool';
import { selectors } from '../store/userStore';
// import { Superscript } from './editorExtensions/superscript';
// import { Subscript } from './editorExtensions/subscript';

// import { MyTune } from './editorExtensions/tuneVersioning';
// import Code from '@editorjs/code';
// import editorjsCodeflask from '@calumk/editorjs-codeflask';
// import CodeBox from '@bomdi/codebox';
// import LinkTool from '@editorjs/link';
// import TextVariantTune from '@editorjs/text-variant-tune';
// import type { ToolConstructable, ToolSettings } from '@editorjs/editorjs';

export function useEditorTools (): { [toolName: string]: any} {
  const user = useSelector((state) => selectors.getUser(state), isEqual);

  return {
  // textVariant: TextVariantTune,
    myTune: {
      class: VersioningTune,
      config: {

      },
    },
    // subscript: Subscript,
    // superscript: Superscript,
    alignmentTune: {
      class: AlignmentTuneTool,
      config: {
        default: 'left',
        blocks: {
          header: 'left',
          list: 'left',
        },
      },
    },
    myReview: {
      class: ReviewTool,
      config: {
        userName: user ? user?.full_name : '',
        userId: user ? user?.id : '',
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
      config: {
        services: {
          youtube: true,
          coub: true,
        },
      },
    },
    paragraph: {
      tunes: ['myTune', 'alignmentTune'],
    },
    table: {
      class: Table,
    },
    marker: {
      class: Marker,
    },
    list: {
      class: List,
      tunes: ['myTune'],
      inlineToolbar: true,
    },
    math: {
      class: LatexPlugin,
      inlineToolbar: true,
    },
    warning: {
      class: Warning,
    },
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
    myCode: {
      class: CodeTool,
    },
    // linkTool: LinkTool,
    image: {
      class: ImageWrapper,
      inlineToolbar: true,
      config: {
        // actions: [
        //   {
        //     name: 'center',
        //     icon: '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><!-- Alignment Icon - Left --><rect x="10" y="20" width="20" height="60" fill="#333" /><!-- Alignment Icon - Center --><rect x="40" y="30" width="20" height="40" fill="#333" /><rect x="40" y="30" width="20" height="40" fill="#fff" opacity="0.5" /><!-- Alignment Icon - Right --><rect x="70" y="20" width="20" height="60" fill="#333" /><!-- Alignment Icon - Justify --><rect x="20" y="80" width="60" height="10" fill="#333" /><rect x="20" y="80" width="60" height="10" fill="#fff" opacity="0.5" /></svg>',
        //     title: 'Center Image',
        //     toggle: true,

        //   },
        // ],

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
          display: false,
        },
        unsplash: {
          appName: 'Science editor image plugin',
          clientId: process.env.REACT_APP_UNSPLASH_ACCESS_KEY,
        },
      },
    },
    raw: {
      class: Raw,
      inlineToolbar: true,
    },
    header: {
      class: HeaderAPI,
      tunes: ['alignmentTune'],
      inlineToolbar: true,
    },
    quote: {
      class: Quote,
    },
    checklist: {
      class: CheckList,
    },
    delimiter: {
      class: Delimiter,
    },
    inlineCode: {
      class: InlineCode,
      shortcut: 'CMD+SHIFT+O',
    },
    wordCount: {
      class: WordCounter,
    },
    // footnotes: FootnotesTune,
  // latexInline: LatexInline,
  };
}
