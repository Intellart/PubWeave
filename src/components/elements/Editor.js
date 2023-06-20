// @flow
import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import {
  find,
  findIndex,
  forEach,
  get,
  includes,
  isEmpty,
  isEqual,
  map,
  some,
} from 'lodash';
import { toast } from 'react-toastify';
import Undo from 'editorjs-undo';
// import DragDrop from 'editorjs-drag-drop';

import { useDispatch, useSelector } from 'react-redux';
import { useEditorTools } from '../../utils/editor_constants';
import type { ArticleContent } from '../../store/articleStore';
import { actions, selectors } from '../../store/articleStore';
import VersioningInfoCard from './VersioningInfoCard';

type Props = {
    isReady: boolean,
    onChange?: (newBlocks: any) => void,
    readOnly?: boolean,
    onShowHistory?: () => void,
};

type CriticalSectionProps = {
    blocks: any,
};

// eslint-disable-next-line no-unused-vars
const useCriticalSections = ({ blocks } : CriticalSectionProps) => {
  const criticalSectionIds = useSelector((state) => selectors.getCriticalSectionIds(state), isEqual);

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
  };

  useEffect(() => {
    labelCriticalSections();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criticalSectionIds]);
};

function Editor({
  // eslint-disable-next-line no-unused-vars
  isReady, onChange, readOnly, onShowHistory,
} : Props): any {
  const editor = useRef(null);
  const EDITOR_JS_TOOLS = useEditorTools();
  // useCriticalSections({ blocks });

  const activeBlock = useSelector((state) => selectors.getActiveBlock(state), isEqual);
  const content = useSelector((state) => selectors.articleContent(state), isEqual);
  const blocksToUpdate = useSelector((state) => selectors.getBlocksToUpdate(state), isEqual);
  const dispatch = useDispatch();
  const setActiveBlock = (id: string | null) => dispatch(actions.setActiveBlock(id));
  const removeFromBlocksToUpdate = (id: string) => dispatch(actions.removeFromBlocksToUpdate(id));

  // eslint-disable-next-line no-unused-vars

  useEffect(() => {
    if (isReady && editor.current) {
      // const block = editor.current.blocks.getById(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  useEffect(() => {
    map(blocksToUpdate, (block, id) => {
      const oldBlock = find(get(content, 'blocks', []), (o) => get(o, 'id') === get(block, 'id'));
      if (isEmpty(oldBlock)) return;
      editor.current?.blocks.update(id, block.data);
      removeFromBlocksToUpdate(id);
    });

    // const oldTime = get(localContent, 'time');
    // const newTime = get(content, 'time');

    // console.log(`New time: ${newTime} - Old time: ${oldTime}`);

    // if (newTime !== oldTime) {
    //   console.log('New content');
    //   forEach(get(content, 'blocks', []), (block) => {
    //     // const oldBlock = find(get(localContent, 'blocks', []), (o) => get(o, 'id') === get(block, 'id'));
    //     const oldBlock = editor.current?.blocks.getById(get(block, 'id'));

    //     if (!oldBlock || isEqual(oldBlock.data, block.data)) {
    //       // console.log('Block not changed', block);
    //     } else {
    //       console.log('Block changed', block);
    //       editor.current?.blocks.update(block.id, block.data);
    //     }
    //   });
    // }

    // const oldBlocks = editor.current?.blocks.getCurrentBlockIndex();

    // console.log(oldBlocks);
  }, [content, blocksToUpdate]);

  // eslint-disable-next-line no-unused-vars
  const checkIfCriticalSection = (newBlocks: any) => {
    // let criticalSectionFound = false;

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

          // return
        }

        // criticalSectionFound = true;
      }
    });

    return false;
  };

  const handleUploadEditorContent = () => {
    editor.current?.save().then((newArticleContent: ArticleContent) => {
      console.log('handleUploadEditorContent');
      // if (checkIfCriticalSection(newArticleget(content, 'blocks', []))) {
      //   toast.error('You can\'t edit a critical section from another user');

      //   editor.current?.blocks.render({ blocks }).then(() => {
      //     labelCriticalSections();
      //   });

      //   return;
      // }

      const anyChanges = some(newArticleContent.blocks, (block) => {
        const oldBlock = find(get(content, 'blocks', []), (o) => get(o, 'id') === get(block, 'id'));
        console.log('test', oldBlock.data, block.data);

        if (isEmpty(oldBlock)) return false;

        return !isEqual(oldBlock.data, block.data);
      });

      console.log('anyChanges', anyChanges);

      if (onChange && anyChanges) onChange(newArticleContent);
    });
  };

  useEffect(() => {
    if (isReady && !editor.current) {
      editor.current = new EditorJS({
        autofocus: true,
        // logLevel: 'ERROR',
        holder: 'editorjs',
        readOnly,
        data: {
          blocks: get(content, 'blocks', []) || [],
        },
        tools: EDITOR_JS_TOOLS,
        tunes: ['myTune'],

        onReady: () => {
          // labelCriticalSections();
        },

        onChange: handleUploadEditorContent,
        // onChange: async () => {
        //   const newContent = await editor.current?.save();

        //   console.log('onChange');
        //   console.log(content, newContent);

        //   if (onChange) onChange(newContent);
        // },

        placeholder: 'Start your article here!',
      });

      editor.current.isReady
        .then(() => {
          const config = {
            shortcuts: {
              undo: 'CMD+X',
              redo: 'CMD+ALT+C',
            },
          };

          // eslint-disable-next-line no-new
          const undo = new Undo({ editor: editor.current, config });
          undo.initialize(get(content, 'blocks', []));
          // eslint-disable-next-line no-new
          // new DragDrop({ blocks, editor: editor.current, configuration: { holder: 'editorjs' } });

          // const toolbar = document.getElementsByClassName('ce-toolbar__actions')[0];
          // const toolbarChild = document.createElement('div');
          // toolbarChild.className = 'ce-toolbar-section-info';
          // toolbarChild.innerHTML = '<div class="ce-toolbar__plus">🧑</div>';
          // toolbarChild.onclick = () => {
          //   console.log('add new block');
          // };
          // toolbar.appendChild(toolbarChild);
        })
        .catch((reason) => {
          toast.error(`Editor.js initialization failed because of ${reason}`);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  useEffect(() => {
    if (isReady) {
      if (editor.current && editor.current.configuration) {
        editor.current.configuration.onChange = handleUploadEditorContent;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [get(content, 'blocks', []), isReady]);

  const getTop = () => {
    const block = document.getElementsByClassName('cdx-versioning-selected')[0];
    const blockTop = get(block, 'offsetTop');
    const blockHeight = get(block, 'offsetHeight');

    return `${blockTop + blockHeight + 10}px`;
  };

  return (
    <div
      id="editorjs"
      style={{
        position: 'relative',
      }}
    >
      {get(activeBlock, 'id') && (
      <VersioningInfoCard
        style={{
          top: getTop(),
          left: '275px',
          zIndex: 1,
        }}
        block={find(get(content, 'blocks', []), (o) => get(o, 'id') === get(activeBlock, 'id'))}
        // versionInfo={this.vbInfo}
        onClose={() => {
          // VersioningTune.uncheckOldWrapper(VersioningTune.previousWrapper, this.toggleClass);
          // VersioningTune.setActiveBlockId(null);
          // VersioningTune.previousWrapper = null;
          setActiveBlock(null);
        }}
      />
      ) }
    </div>

  );
}

export default Editor;
