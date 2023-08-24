// @flow
import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import {
  every,
  findKey,
  forEach,
  get,
  has,
  isEmpty,
  isEqual,
  pickBy,
  size,
} from 'lodash';
import { toast } from 'react-toastify';
import Undo from 'editorjs-undo';
// import DragDrop from 'editorjs-drag-drop';

import { useDispatch, useSelector } from 'react-redux';
import { useEditorTools } from '../../utils/editor_constants';
import type {
  ArticleContent,
  BlockCategoriesToChange,
  BlockIds,
  BlocksFromEditor,
  _ContentFromEditor,
} from '../../store/articleStore';
import { actions, selectors } from '../../store/articleStore';
import VersioningInfoCard from './VersioningInfoCard';
import {
  convertBlocksFromEditorJS,
  convertBlocksToEditorJS,
  getBlockChanges,
} from '../../utils/hooks';
import { selectors as userSelectors } from '../../store/userStore';
import VersioningTune from '../../utils/editorExtensions/versioningTune';

type Props = {
    isReady: boolean,
    onChange?: (newBlocks: BlockCategoriesToChange, time:number, version: string) => void,
    readOnly?: boolean,
    onShowHistory?: () => void,
};

type CriticalSectionProps = {
    blocks: any,
};

// eslint-disable-next-line no-unused-vars
const useCriticalSections = ({ blocks } : CriticalSectionProps) => {
  const activeSections = useSelector((state) => selectors.getActiveSections(state), isEqual);
  const user = useSelector((state) => userSelectors.getUser(state), isEqual);

  const labelCriticalSections = () => {
    forEach(document.getElementsByClassName('ce-block__content'), (div, divIndex) => {
      if (div) {
        const sectionKey = findKey(blocks, (o) => o.position === divIndex);
        const isCritical = get(activeSections, sectionKey, null)
        && get(activeSections, sectionKey, null) !== get(user, 'id');

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
    console.log('activeSections', activeSections);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSections]);

  return { labelCriticalSections, activeSections };
};

type LockingProps = {
    blocks: any,
    editor: any,
};

const useLocking = ({ blocks, editor } : LockingProps) => {
  const activeSections = useSelector((state) => selectors.getActiveSections(state), isEqual);
  const user = useSelector((state) => userSelectors.getUser(state), isEqual);

  const dispatch = useDispatch();
  const lockSection = (userId: number, sectionId: string) => dispatch(actions.lockSection(userId, sectionId));
  // const unlockSection = (userId: number, sectionId: string) => dispatch(actions.unlockSection(userId, sectionId));

  const checkLocks = () => {
    const blockIndex = editor.blocks.getCurrentBlockIndex();
    if (blockIndex >= 0 && blockIndex < size(blocks)) {
      const blockId = get(editor.blocks.getBlockByIndex(blockIndex), 'id');
      if (blockId) {
        if (!has(activeSections, blockId)) {
          console.log('CARRET AT', blockIndex, '-> ID: ', blockId);
          lockSection(user.id, blockId);
        } /* else {
          unlockSection(user.id, findKey(activeSections, (o) => o === get(user, 'id')));
        } */
      }
    }
  };

  return { checkLocks };
};

function Editor({
  // eslint-disable-next-line no-unused-vars
  isReady, onChange, readOnly, onShowHistory,
} : Props): any {
  const editor = useRef(null);
  const EDITOR_JS_TOOLS = useEditorTools();

  const selectedVersioningBlock = useSelector((state) => selectors.getActiveBlock(state), isEqual);
  const content: ArticleContent = useSelector((state) => selectors.articleContent(state), isEqual);
  const blockIdQueue = useSelector((state) => selectors.getBlockIdQueue(state), isEqual);
  const user = useSelector((state) => userSelectors.getUser(state), isEqual);

  const dispatch = useDispatch();
  const setSelectedVersioningBlock = (id: string | null) => dispatch(actions.setActiveBlock(id));
  const blockIdQueueComplete = (id: string, blockAction: 'updated' | 'created' |'deleted') => dispatch(actions.blockIdQueueComplete(id, blockAction));
  // const unlockSection = (userId: number, sectionId: string) => dispatch(actions.unlockSection(userId, sectionId));

  const { labelCriticalSections, activeSections } = useCriticalSections({ blocks: get(content, 'blocks', {}) });
  const { checkLocks } = useLocking({ blocks: get(content, 'blocks', {}), editor: editor.current });

  useEffect(() => {
    if (isReady && editor.current) {
      forEach(blockIdQueue, (blockIds: BlockIds, category: 'updated' | 'created' |'deleted') => {
        if (size(blockIds) === 0) return;

        forEach(blockIds, (isInEditor, blockId) => {
          if (isInEditor) return;

          if (category === 'updated') {
            const block = get(content, `blocks.${blockId}`);
            editor.current?.blocks.update(blockId, block.data);
          } else if (category === 'created') {
            editor.current?.blocks.render({ blocks: convertBlocksToEditorJS(get(content, 'blocks', [])) || [] });
          } else if (category === 'deleted') {
            // editor.current?.blocks.delete(blockId);
            editor.current?.blocks.render({ blocks: convertBlocksToEditorJS(get(content, 'blocks', [])) || [] });
          }
          blockIdQueueComplete(blockId, category);
        });
      });
    }
    labelCriticalSections();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockIdQueue]);

  const handleUploadEditorContent = () => {
    editor.current?.save().then(
      (newArticleContent: _ContentFromEditor) => {
        console.log('handleUploadEditorContent');

        const blocksFromEditor: BlocksFromEditor = convertBlocksFromEditorJS(newArticleContent.blocks);

        const changedBlocks: BlockCategoriesToChange = getBlockChanges(
          blocksFromEditor,
          get(content, 'blocks', {}),
        );

        if (every(changedBlocks, blocks => isEmpty(blocks))) {
          console.log('No changes');

          return;
        }

        console.log('anyChanges', changedBlocks);

        const allowedToEdit = pickBy(get(changedBlocks, 'changed', []), (block) => (get(activeSections, block.id, null) && get(activeSections, block.id, null) === get(user, 'id')) /* || !get(activeSections, block.id, null) */);

        // if (size(allowedToEdit) !== size(get(changedBlocks, 'changed', {}))) {
        //   editor.current?.blocks.render({ blocks: convertBlocksToEditorJS(get(content, 'blocks', [])) || [] });

        //   toast.error('You are not allowed to edit this block');

        //   return;
        // }

        if (onChange) {
          onChange(
            {
              created: get(changedBlocks, 'created', []),
              changed: size(allowedToEdit) !== size(get(changedBlocks, 'changed', {})) ? {} : allowedToEdit,
              deleted: get(changedBlocks, 'deleted', []),
            },
            get(newArticleContent, 'time'),
            get(newArticleContent, 'version'),
          );
        }
      },
    );
  };

  useEffect(() => {
    if (isReady && !editor.current) {
      editor.current = new EditorJS({
        autofocus: true,
        logLevel: 'ERROR',
        holder: 'editorjs',
        readOnly,
        //
        data: {
          blocks: convertBlocksToEditorJS(get(content, 'blocks', [])) || [],
        },
        tools: EDITOR_JS_TOOLS,
        tunes: ['myTune'],

        onReady: () => {
          labelCriticalSections();
          if (editor.current) {
            const key = findKey(activeSections, (o) => o === get(user, 'id'));
            const currentBlock = get(content, ['blocks', key], {});
            editor.current.caret.setToBlock(get(currentBlock, 'position', 0));
          }
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
  }, [get(content, 'blocks'), isReady, blockIdQueue, activeSections]);

  const getTop = () => {
    const block = document.getElementsByClassName('cdx-versioning-selected')[0];
    const blockTop = get(block, 'offsetTop');
    const blockHeight = get(block, 'offsetHeight');

    return `${blockTop + blockHeight + 10}px`;
  };

  return (
    <div
      id="editorjs"
      onClick={() => {
        if (isReady && editor.current) {
          checkLocks();
        }
      }}
      onBlur={() => {
        // const activeKey = findKey(activeSections, (o) => o === get(user, 'id'));
        // if (activeKey) {
        //   unlockSection(user.id, activeKey);
        // }
      }}
      style={{
        position: 'relative',
      }}
    >
      {get(selectedVersioningBlock, 'id') && (
      <VersioningInfoCard
        style={{
          top: getTop(),
          left: '275px',
          zIndex: 1,
        }}
        block={get(content, ['blocks', selectedVersioningBlock], {})}
        // versionInfo={this.vbInfo}
        onClose={() => {
          VersioningTune.uncheckOldWrapper(VersioningTune.previousWrapper, 'cdx-versioning-selected');
          VersioningTune.setActiveBlockId(null);
          VersioningTune.previousWrapper = null;
          setSelectedVersioningBlock(null);
        }}
      />
      ) }
    </div>

  );
}

export default Editor;
