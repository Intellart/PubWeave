// @flow
import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import {
  find,
  findIndex,
  forEach,
  get,
  includes,
  isEqual,
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
    blocks: any,
    isReady: boolean,
    criticalSectionIds: Array<string>,
    onChange?: (newBlocks: any) => void,
    readOnly?: boolean,
    versioningBlockId : any,
    onShowHistory?: () => void,
};

function Editor({
  blocks, isReady, criticalSectionIds, onChange, readOnly, versioningBlockId, onShowHistory,
} : Props): any {
  const editor = useRef(null);

  const activeBlock = useSelector((state) => selectors.getActiveBlock(state), isEqual);

  const dispatch = useDispatch();
  const setActiveBlock = (id: string) => dispatch(actions.setActiveBlock(id));

  // const uncheckOldWrapper = (currentVB: any, toggleClass: string) => {
  //   const vbWrapper = currentVB?.closest(`.${toggleClass}`);
  //   if (vbWrapper) vbWrapper.classList.remove(toggleClass);

  //   const infoCard = document.querySelector('.cdx-versioning-info-card');
  //   if (infoCard) infoCard.remove();
  // };

  const versionInfo = useRef({
    version: -1,
    lastUpdated: '25/05/2021 12:00',
    author: 'John Doe',
    onViewVersions: () => {
      if (onShowHistory) onShowHistory();
    },
  });

  const EDITOR_JS_TOOLS = useEditorTools();

  useEffect(() => {
    console.log('TRIGGER', versioningBlockId);
    if (versioningBlockId.current !== null) {
      // const lastUpdated = document.getElementById('cdx-versioning-info-card-last-updated');
      // if (lastUpdated) {
      //   lastUpdated.innerHTML = '25/05/2021 12:00';
      // }
      versionInfo.current = {
        version: 1,
        lastUpdated: new Date().toLocaleString(),
        author: 'John Doe',
        onViewVersions: () => {
          if (onShowHistory) onShowHistory();
        },
      };
    } else {
      // editor.current?.blocks.render({ blocks });
    }
  }, [versioningBlockId.current]);

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

  const checkIfCriticalSection = (newBlocks: any) => {
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
    // console.log('editor content changed');
    // console.log('editor', editor.current);
    editor.current?.save().then((newArticleContent: ArticleContent) => {
      if (checkIfCriticalSection(newArticleContent.blocks)) {
        toast.error('You can\'t edit a critical section from another user');

        // load old content
        // api.blocks.clear();
        editor.current?.blocks.render({ blocks }).then(() => {
          labelCriticalSections();
        });

        return;
      }

      if (onChange) {
        // onChange({
        //   ...newArticleContent,
        //   blocks: map(newArticleContent.blocks, (block) => {
        //     if (get(block, 'id') === versioningBlockId.current) {
        //       return find(blocks, (o) => get(o, 'id') === versioningBlockId.current);
        //     } else {
        //       return block;
        //     }
        //   }),
        // });

        if (versioningBlockId.current !== null) {
          console.log('versioning block id', versioningBlockId.current);
          const oldBlock = find(blocks, (o) => get(o, 'id') === versioningBlockId.current);
          const newBlock = find(newArticleContent.blocks, (o) => get(o, 'id') === versioningBlockId.current);

          console.log('old block', oldBlock);
          console.log('new block', newBlock);
          console.log('isEqual', isEqual(oldBlock.data, newBlock.data));

          if (!isEqual(oldBlock.data, newBlock.data)) {
            versioningBlockId.current = null;
            versionInfo.current.version = -1;
            // editor.current?.blocks.render({ blocks });

            // uncheckOldWrapper(versionBlock.current, 'cdx-versioning-selected');
          }
        }

        onChange(newArticleContent);
      }
    });
  };

  useEffect(() => {
    labelCriticalSections();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criticalSectionIds]);

  useEffect(() => {
    if (isReady) {
      if (editor.current && editor.current.configuration) {
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
        readOnly,
        defaultValue: {
          blocks: blocks || [],
        },
        data: {
          blocks: blocks || [],
        },
        tools: EDITOR_JS_TOOLS,
        tunes: ['myTune'],

        onReady: () => {
          labelCriticalSections();
        },

        onChange: handleUploadEditorContent,
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
          undo.initialize(blocks);
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
        block={find(blocks, (o) => get(o, 'id') === get(activeBlock, 'id'))}
        // versionInfo={this.vbInfo}
        onClose={() => {
          // VersioningTune.uncheckOldWrapper(VersioningTune.previousWrapper, this.toggleClass);
          // VersioningTune.setActiveBlockId(null);
          // VersioningTune.previousWrapper = null;
          console.log('close');
          setActiveBlock(null);
        }}
      />
      ) }
    </div>

  );
}

export default Editor;
