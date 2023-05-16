import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import {
  findIndex,
  forEach,
  get,
  includes,
  isEqual,
} from 'lodash';
import { toast } from 'react-toastify';
import { EDITOR_JS_TOOLS } from '../../utils/editor_constants';

type Props = {
    blocks: any,
    isReady: boolean,
    criticalSectionIds: Array<string>,
    onChange: (newBlocks: any) => void,
};

function Editor({
  blocks, isReady, criticalSectionIds, onChange,
} : Props) {
  const editor = useRef(null);

  const labelCriticalSections = () => {
    forEach(document.getElementsByClassName('ce-block__content'), (div, divIndex) => {
      if (div) {
        const isCritical = includes(criticalSectionIds, get(blocks[divIndex], 'id'));

        if (isCritical) {
          div.id = 'critical-section';
          div.onclick = null;
        } else {
          div.id = '';
        }
      }
    });

    // forEach(criticalSectionIds, (CSId) => {
    //   const CSInd = findIndex(blocks, (block) => get(block, 'id') === CSId);
    //   const criticalSection = document.getElementsByClassName('ce-block__content')[CSInd];

    //   if (criticalSection) {
    //     criticalSection.id = 'critical-section';

    //     // remove on click listener
    //     criticalSection.onclick = null;
    //   }
    // });
  };

  const checkIfCriticalSection = (newBlocks) => {
    let criticalSectionFound = false;

    // const blockIds = map(blocks, (block) => get(block, 'id'));

    // if (difference(blockIds, criticalSectionIds).length > 0) {
    //   console.log('Critical section deleted');

    //   return true;
    // }

    forEach(newBlocks, (block) => {
      if (includes(criticalSectionIds, get(block, 'id'))) {
        const oldBlockInd = findIndex(blocks, (o) => get(o, 'id') === get(block, 'id'));
        const newBlockInd = findIndex(newBlocks, (o) => get(o, 'id') === get(block, 'id'));

        // console.log(blocks[oldBlockInd], newBlocks[newBlockInd]);

        if (isEqual(blocks[oldBlockInd], newBlocks[newBlockInd])) {
          // console.log('Critical section not changed');

          return;
        }

        criticalSectionFound = true;
      }
    });

    return criticalSectionFound;
  };

  const handleUploadEditorContent = () => {
    editor.current.save().then((newArticleContent: ArticleContent) => {
      if (checkIfCriticalSection(newArticleContent.blocks)) {
        toast.error('You can\'t edit a critical section from another user');

        // load old content
        // api.blocks.clear();
        editor.current.blocks.render({ blocks }).then(() => {
          labelCriticalSections();
        });

        return;
      }

      onChange(newArticleContent);
    });
  };

  useEffect(() => {
    labelCriticalSections();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks, criticalSectionIds]);

  useEffect(() => {
    if (isReady) {
      if (editor.current) {
        editor.current.configuration.onChange = handleUploadEditorContent;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks, isReady]);

  useEffect(() => {
    if (isReady && !editor.current) {
      editor.current = new EditorJS({
        autofocus: true,
        // logLevel: 'ERROR',
        holder: 'editorjs',
        defaultValue: {
          blocks: blocks || [],
        },
        data: {
          blocks: blocks || [],
        },
        tools: EDITOR_JS_TOOLS,

        onReady: () => {
          labelCriticalSections();
        },

        onChange: handleUploadEditorContent,
        placeholder: 'Start your article here!',
      });

      editor.current.isReady
        .then(() => {
          // console.log('Editor.js is ready to work!');
        })
        .catch((reason) => {
          toast.error(`Editor.js initialization failed because of ${reason}`);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  return (<div id="editorjs" />);
}

export default Editor;
