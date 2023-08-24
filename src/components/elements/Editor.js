// @flow
import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import {
  every,
  filter,
  find,
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

  const activeBlock = useSelector((state) => selectors.getActiveBlock(state), isEqual);
  const content: ArticleContent = useSelector((state) => selectors.articleContent(state), isEqual);
  const blockIdUPDATEQueue = useSelector((state) => selectors.getBlockIdQueue(state, 'updated'), isEqual);
  const blockIdCREATEQueue = useSelector((state) => selectors.getBlockIdQueue(state, 'created'), isEqual);
  const blockIdDELETEQueue = useSelector((state) => selectors.getBlockIdQueue(state, 'deleted'), isEqual);
  const user = useSelector((state) => userSelectors.getUser(state), isEqual);

  const dispatch = useDispatch();
  const setActiveBlock = (id: string | null) => dispatch(actions.setActiveBlock(id));
  const blockIdUPDATEQueueRemove = (id: string) => dispatch(actions.blockIdQueueRemove(id, 'updated'));
  const blockIdUPDATEQueueComplete = (id: string) => dispatch(actions.blockIdQueueComplete(id, 'updated'));
  const blockIdCREATEQueueRemove = (id: string) => dispatch(actions.blockIdQueueRemove(id, 'created'));
  const blockIdCREATEQueueComplete = (id: string) => dispatch(actions.blockIdQueueComplete(id, 'created'));
  const blockIdDELETEQueueRemove = (id: string) => dispatch(actions.blockIdQueueRemove(id, 'deleted'));
  const blockIdDELETEQueueComplete = (id: string) => dispatch(actions.blockIdQueueComplete(id, 'deleted'));
  // const unlockSection = (userId: number, sectionId: string) => dispatch(actions.unlockSection(userId, sectionId));

  const { labelCriticalSections, activeSections } = useCriticalSections({ blocks: get(content, 'blocks', {}) });
  const { checkLocks } = useLocking({ blocks: get(content, 'blocks', {}), editor: editor.current });

  useEffect(() => {
    console.log('UE - update queue', blockIdUPDATEQueue);
    if (isReady && editor.current) {
      forEach(blockIdUPDATEQueue, (isInEditor, blockId) => {
        if (isInEditor) return;

        const block = get(content, `blocks.${blockId}`);

        editor.current?.blocks.update(blockId, block.data);
        // editor.current?.blocks.insert(b.type, b.data);
        blockIdUPDATEQueueComplete(blockId);
      });
    }
    labelCriticalSections();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockIdUPDATEQueue]);

  useEffect(() => {
    console.log('UE - create queue', blockIdCREATEQueue);
    if (isReady && editor.current) {
      forEach(blockIdCREATEQueue, (isInEditor, blockId) => {
        if (isInEditor) return;

        editor.current?.blocks.render({ blocks: convertBlocksToEditorJS(get(content, 'blocks', [])) || [] });

        blockIdCREATEQueueComplete(blockId);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockIdCREATEQueue]);

  useEffect(() => {
    console.log('UE - delete queue', blockIdDELETEQueue);
    if (isReady && editor.current) {
      forEach(blockIdDELETEQueue, (isInEditor, blockId) => {
        if (isInEditor) return;

        // editor.current?.blocks.delete(blockId);
        editor.current?.blocks.render({ blocks: convertBlocksToEditorJS(get(content, 'blocks', [])) || [] });

        blockIdDELETEQueueComplete(blockId);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockIdDELETEQueue]);

  const handleUploadEditorContent = () => {
    editor.current?.save().then(
      (newArticleContent: _ContentFromEditor) => {
        console.log('handleUploadEditorContent', blockIdUPDATEQueue);

        const blo = filter(newArticleContent.blocks, (block) => {
          const id = get(block, 'id');
          if (has(blockIdUPDATEQueue, id) || has(blockIdCREATEQueue, id) || has(blockIdDELETEQueue, id)) {
            if (get(blockIdCREATEQueue, id)) {
              blockIdCREATEQueueRemove(id);
            } else if (get(blockIdUPDATEQueue, id)) {
              blockIdUPDATEQueueRemove(id);
            } else if (get(blockIdDELETEQueue, id)) {
              blockIdDELETEQueueRemove(id);
            }

            return false;
          }

          return true;
        });

        const blocksFromEditor: BlocksFromEditor = convertBlocksFromEditorJS(blo);

        // console.log(
        //   'blocksFromEditor',
        //   blocksFromEditor,
        // );

        // if (checkIfCriticalSection(newArticleget(content, 'blocks', []))) {
        //   toast.error('You can\'t edit a critical section from another user');

        //   editor.current?.blocks.render({ blocks }).then(() => {
        //     labelCriticalSections();
        //   });

        //   return;
        // }

        if (size(blo) !== size(newArticleContent.blocks)) return;

        const changedBlocks: BlockCategoriesToChange = getBlockChanges(
          blocksFromEditor,
          get(content, 'blocks', {}),
        );

        if (every(changedBlocks, blocks => isEmpty(blocks))) {
          console.log('No changes');

          return;
        }

        console.log('anyChanges', changedBlocks, get(content, 'blocks', {}), 'activeSections', activeSections);

        if (onChange) {
          onChange(
            {
              created: get(changedBlocks, 'created', []),
              changed: pickBy(get(changedBlocks, 'changed', []), (block) => get(activeSections, block.id, null) && get(activeSections, block.id, null) === get(user, 'id')),
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
  }, [get(content, 'blocks'), isReady, blockIdUPDATEQueue, activeSections]);

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
