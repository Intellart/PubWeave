// @flow
import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import {
  findKey,
  forEach,
  get,
  map,
  groupBy,
  isEqual,
  pickBy,
  mapValues,
  size,
  includes,
} from 'lodash';
import { toast } from 'react-toastify';

// import Undo from 'editorjs-undo';
// import DragDrop from 'editorjs-drag-drop';
import { useDispatch, useSelector } from 'react-redux';
// import type { API, CustomEvent } from '@editorjs/editorjs';
import classNames from 'classnames';
import { useEditorTools } from '../../utils/editor_constants';
import type {
  ArticleContent,
  BlockCategoriesToChange,
  BlockIds,
} from '../../store/articleStore';
import { actions, selectors } from '../../store/articleStore';
import {
  convertBlocksToEditorJS,
  editorPermissions,
  permissions,
} from '../../utils/hooks';
import { selectors as userSelectors } from '../../store/userStore';
import VersioningTune from '../../utils/editorExtensions/versioningTune';
import useCriticalSections from '../../utils/useCriticalSections';
import useLocking from '../../utils/useLocking';
import useWebSocket from '../useWebSocket';
import Modal from '../modal/Modal';
// import useCopy from '../../utils/useCopy';

export const EditorStatus = {
  IN_PROGRESS: 'in-progress',
  IN_REVIEW: 'in-review',
  PUBLISHED: 'published',
  PREVIEW: 'preview',
};

export type EditorStatusType = $Values<typeof EditorStatus>;

type Props = {
  status: EditorStatusType,
  isReady: boolean,
  onChange?: (
    newBlocks: BlockCategoriesToChange,
    time: number,
    version: string
  ) => void,
  showMessages?: boolean,
  onShowHistory?: (sectionId: string) => void,
};

function Editor({
  // eslint-disable-next-line no-unused-vars
  isReady,
  onChange,
  onShowHistory,
  status,
  showMessages,
}: Props): any {
  const editor = useRef(null);
  const EDITOR_JS_TOOLS = useEditorTools();

  const printMessage = (...args: any) => {
    if (showMessages) {
      console.log(...args);
    }
  };

  const readOnly = includes([EditorStatus.PREVIEW, EditorStatus.PUBLISHED], status);

  const selectedVersioningBlock = useSelector(
    (state) => selectors.getActiveBlock(state),
    isEqual,
  );
  const content: ArticleContent = useSelector(
    (state) => selectors.articleContent(state),
    isEqual,
  );
  const blockIdQueue = useSelector(
    (state) => selectors.getBlockIdQueue(state),
    isEqual,
  );
  const user = useSelector((state) => userSelectors.getUser(state), isEqual);
  const blocks = get(content, 'blocks', {});
  const activeSections = useSelector(
    (state) => selectors.getActiveSections(state),
    isEqual,
  );
  const article = useSelector((state) => selectors.article(state), isEqual);
  const currentPermissions = editorPermissions({
    type: get(article, 'article_type'),
    status: status || EditorStatus.IN_PROGRESS,
  });

  const dispatch = useDispatch();
  const setSelectedVersioningBlock = (id: string | null) => dispatch(actions.setActiveBlock(id));
  const blockIdQueueComplete = (
    id: string,
    blockAction: 'updated' | 'created' | 'deleted',
  ) => dispatch(actions.blockIdQueueComplete(id, blockAction));
  // const unlockSection = (userId: number, sectionId: string) => dispatch(actions.unlockSection(userId, sectionId));

  const { labelCriticalSections } = useCriticalSections({
    blocks,
    enabled: get(currentPermissions, permissions.criticalSections, false),
  });
  const { checkLocks } = useLocking({
    blocks,
    editor: editor.current,
    enabled: get(currentPermissions, permissions.locking, false),
  });
  useWebSocket({
    articleId: get(article, 'id'),
    enabled: get(currentPermissions, permissions.webSockets, false),
  });

  useEffect(() => {
    if (isReady && editor.current) {
      forEach(
        blockIdQueue,
        (blockIds: BlockIds, category: 'updated' | 'created' | 'deleted') => {
          if (size(blockIds) === 0) return;

          forEach(blockIds, (isInEditor, blockId) => {
            if (isInEditor) return;

            if (category === 'updated') {
              const block = get(content, `blocks.${blockId}`);
              editor.current?.blocks.update(blockId, block.data);
            } else if (category === 'created') {
              editor.current?.blocks.render({
                blocks: convertBlocksToEditorJS(blocks) || [],
              });
            } else if (category === 'deleted') {
              // editor.current?.blocks.delete(blockId);
              editor.current?.blocks.render({
                blocks: convertBlocksToEditorJS(blocks) || [],
              });
            }
            blockIdQueueComplete(blockId, category);
          });
        },
      );
    }
    labelCriticalSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockIdQueue]);

  const handleUploadEditorContent = async (api: any, event: any) => {
    printMessage('API', api.blocks.getBlockByIndex(0));
    console.log('EVENT', event);

    const events = Array.isArray(event) ? event : [event];

    const data = mapValues(
      groupBy(
        await Promise.all(
          map(events, async (e) => ({
            action: e.type, // block-changed , block-added, block-removed
            position: e.detail.index,
            type: e.detail.target.name,
            ...(await e.detail.target.save()),
          })),
        ),
        'id',
      ),
      (blockArray) => {
        if (blockArray.length === 1) {
          return blockArray[0];
        } else if (blockArray.length === 2) {
          const createdBlockIndex = blockArray[0].action === 'block-added' ? 0 : 1;

          return {
            ...blockArray[createdBlockIndex],
            data: blockArray[createdBlockIndex === 0 ? 1 : 0].data,
          };
        }
      },
    );

    printMessage('data', data);

    labelCriticalSections();

    const blockIsNOTBeingEditedBySomeoneElse = (blockId: string) => {
      const activeBlockId = get(activeSections, blockId, null);

      return (
        (activeBlockId && activeBlockId === get(user, 'id')) || !activeBlockId
      );
    };

    const allowedToEdit = pickBy(
      data,
      (block) => blockIsNOTBeingEditedBySomeoneElse(block.id)
        && block.action === 'block-changed',
    );

    printMessage('allowedToEdit', allowedToEdit);

    if (
      size(allowedToEdit)
      !== size(pickBy(data, (block) => block.action === 'block-changed'))
    ) {
      editor.current?.blocks.render({
        blocks: convertBlocksToEditorJS(blocks) || [],
      });

      toast.error('You are not allowed to edit this block');
    }

    if (onChange) {
      onChange(
        {
          created: pickBy(data, (block) => block.action === 'block-added'),
          changed: allowedToEdit,
          deleted: pickBy(data, (block) => block.action === 'block-removed'),
        },
        events[0].timeStamp,
        '1.0.0',
      );
    }
  };

  useEffect(() => {
    if (isReady && !editor.current) {
      editor.current = new EditorJS({
        logLevel: 'ERROR',
        holder: 'editorjs',
        readOnly,
        spellcheck: false,
        inlineToolbar: status === EditorStatus.IN_REVIEW ? ['myReview'] : true,
        data: {
          blocks: convertBlocksToEditorJS(blocks) || [],
        },
        tools: EDITOR_JS_TOOLS,
        tunes: ['myTune', 'alignmentTune'],

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

      // editor.current.isReady
      //   .then(() => {
      //     // const config = {
      //     //   shortcuts: {
      //     //     undo: 'CMD+X',
      //     //     redo: 'CMD+ALT+C',
      //     //   },
      //     // };
      //     // eslint-disable-next-line no-new
      //     // const undo = new Undo({ editor: editor.current, config });
      //     // undo.initialize(blocks);
      //     // eslint-disable-next-line no-new
      //     // new DragDrop({ blocks, editor: editor.current, configuration: { holder: 'editorjs' } });
      //     // const toolbar = document.getElementsByClassName('ce-toolbar__actions')[0];
      //     // const toolbarChild = document.createElement('div');
      //     // toolbarChild.className = 'ce-toolbar-section-info';
      //     // toolbarChild.innerHTML = '<div class="ce-toolbar__plus">🧑</div>';
      //     // toolbarChild.onclick = () => {
      //     //   console.log('add new block');
      //     // };
      //     // toolbar.appendChild(toolbarChild);
      //   })
      //   .catch((reason) => {
      //     toast.error(`Editor.js initialization failed because of ${reason}`);
      //   });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  useEffect(() => {
    // if (isReady && editor.current && editor.current.configuration) {
    //   editor.current.configuration.onChange = handleUploadEditorContent;
    // }
    labelCriticalSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks, isReady, blockIdQueue, activeSections]);

  // const getTop = () => {
  //   const block = document.getElementsByClassName('cdx-versioning-selected')[0];
  //   const blockTop = get(block, 'offsetTop');
  //   const blockHeight = get(block, 'offsetHeight');

  //   return `${blockTop + blockHeight + 10}px`;
  // };

  return (
    <>
      <Modal
        type="versioning"
        sectionId={get(selectedVersioningBlock, 'id')}
        enabled={!!get(selectedVersioningBlock, 'id')}
        // versionInfo={this.vbInfo}
        onClose={() => {
          VersioningTune.uncheckOldWrapper(
            VersioningTune.previousWrapper,
            'cdx-versioning-selected',
          );
          VersioningTune.setActiveBlockId(null);
          VersioningTune.previousWrapper = null;
          setSelectedVersioningBlock(null);
        }}
        onViewHistory={() => onShowHistory && onShowHistory(get(selectedVersioningBlock, 'id'))
        }
      />
      <div
        id="editorjs"
        className={classNames({
          'editorjs-read-only': readOnly || status === EditorStatus.IN_REVIEW,
        }, `editorjs-${status}`)}
        onClick={(e) => {
          if (isReady && editor.current) {
            checkLocks();
          }

          if (e.target.tagName === 'M') {
            printMessage(e);
            // select all text in the element
            const range = document.createRange();
            range.selectNodeContents(e.target);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
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
          // display: 'none',
        }}
      >
        {/* {popover} */}
      </div>
      {/* <div
        id="readonly-editorjs"
      /> */}
    </>
  );
}

export default Editor;
