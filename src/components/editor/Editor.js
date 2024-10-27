// @flow
import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import {
  findKey,
  forEach,
  get,
  map,
  isEqual,
  size,
  includes,
  filter,
  omit,
  union,
  find,
  values,
  differenceBy,
} from 'lodash';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
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
import { store } from '../../store';
// import useCopy from '../../utils/useCopy';
// import Undo from 'editorjs-undo';
// import DragDrop from 'editorjs-drag-drop';

export const EditorStatus = {
  IN_PROGRESS: 'draft',
  IN_REVIEW: 'reviewing',
  REVIEW_PANE: 'reviewPane',
  REVIEW_PANE_READ_ONLY: 'reviewPaneReadOnly',
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
  onShowHistory?: (sectionId: string) => void,
};

function Editor({
  isReady,
  onChange,
  onShowHistory,
  status,
}: Props): any {
  const editor = useRef(null);
  const EDITOR_JS_TOOLS = useEditorTools();

  const selectedVersioningBlock = useSelector((state) => selectors.getActiveBlock(state), isEqual);
  const content: ArticleContent = useSelector((state) => selectors.articleContent(state), isEqual);
  const blocks = useSelector((state) => selectors.getBlocks(state), isEqual);
  const blockIdQueue = useSelector((state) => selectors.getBlockIdQueue(state), isEqual);
  const user = useSelector((state) => userSelectors.getUser(state), isEqual);
  const activeSections = useSelector((state) => selectors.getActiveSections(state), isEqual);
  const article = useSelector((state) => selectors.article(state), isEqual);
  const userId = get(user, 'id');

  // Permissions ---------------------------------------------------------------
  const readOnly = includes([EditorStatus.PREVIEW, EditorStatus.PUBLISHED], status);
  const currentPermissions = editorPermissions({
    type: get(article, 'article_type'),
    status: status || EditorStatus.IN_PROGRESS,
    userId: get(user, 'id'),
    ownerId: get(article, 'author.id'),
    isReviewer: includes(get(article, 'reviewers', []), get(user, 'id')),
    isCollaborator: includes(map(get(article, 'collaborators', []), 'id'), get(user, 'id')),
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => labelCriticalSections(), [blocks, isReady, blockIdQueue, activeSections]);

  // useEffect(() => {
  //   console.log('activeSections', activeSections);
  // }, [activeSections]);

  /**
   * These are queued blocks that are not in the editor yet, that came from websocket.
   * We need to update the editor with these blocks.
   *
   * Attention: blocks.update triggers onChange event.
   */
  useEffect(() => {
    if (isReady && editor.current) {
      // console.log('blockIdQueue', blockIdQueue);

      forEach(blockIdQueue, (blockIds: BlockIds, category: 'updated' | 'created' | 'deleted') => {
        if (size(blockIds) === 0) return;

        forEach(blockIds, (isInEditor, blockId) => {
          if (isInEditor) return;

          switch (category) {
            case 'updated':
              const block = get(content, `blocks.${blockId}`);
              editor.current?.blocks.update(blockId, block.data);
              break;
            case 'created':
            case 'deleted':
              // editor.current?.blocks.delete(blockId);
              editor.current?.blocks.render({ blocks: convertBlocksToEditorJS(blocks) || [] });
              break;
            default:
              break;
          }
          blockIdQueueComplete(blockId, category);
        });
      },
      );
    }
    labelCriticalSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockIdQueue]);

  /**
   * Handles the onChange event of the editor.
   * @param {any} api - The API object.
   * @param {any} events_ - The events object or array of events.
   */
  const handleOnChange = async (api: any, events_: any) => {
    const events = map(Array.isArray(events_) ? events_ : [events_], (e) => ({
      type: e.type,
      id: e.detail?.target?.id,
    }));

    const { time, version, blocks: blocks_ } = await api.saver.save();

    const newBlocks = map(blocks_, (block, index) => ({
      ...block,
      position: index,
    }));

    const oldBlocks = values(
      store.getState().article.oneArticle.content.blocks,
    );

    const numOfCreated = size(differenceBy(newBlocks, oldBlocks, 'id'));
    const numOfDeleted = size(differenceBy(oldBlocks, newBlocks, 'id'));

    const allIds = union(map(oldBlocks, 'id'), map(newBlocks, 'id'));

    const changedBlockIds = map(
      filter(events, ['type', 'block-changed']),
      'id',
    );

    /**
     * Checks if the block is peaceful:
     *  1. if it is not owned by anyone
     *  OR
     *  2. it is owned by the current user.
     * @param {string} blockId - The block id.
     * */
    const isBlockPeaceful = (
      blockId: string,
      activeSections2: any,
      userId2: number,
    ) => {
      const blockOwner = get(activeSections2, blockId, null);

      return !blockOwner || blockOwner === userId2;
    };

    const {
      // content: { /* time_, */ blocks: blocks_/*  version_ */ },
      activeSections: activeSections_,
    } = store.getState().article;

    const canReviewOrEdit = get(currentPermissions, permissions.REVIEW_OR_EDIT_BLOCKS, false);
    const canAddOrRemove = get(currentPermissions, permissions.ADD_OR_REMOVE_BLOCKS, false);
    const locking = get(currentPermissions, permissions.locking, false);

    const allBlocks = map(allIds, (id) => {
      const oldPosition = get(find(oldBlocks, ['id', id]), 'position');
      const newPosition = get(find(newBlocks, ['id', id]), 'position');

      const isRemoved = newPosition === undefined;
      const isAdded = oldPosition === undefined;

      const block = isRemoved
        ? find(oldBlocks, ['id', id])
        : find(newBlocks, ['id', id]);

      const isChanged = includes(changedBlockIds, id)
        && (!locking || isBlockPeaceful(id, activeSections_, userId));

      const getAction = () => {
        if (isRemoved) {
          return 'block-removed';
        }

        if (isAdded) {
          return 'block-added';
        }

        if (isChanged) {
          return 'block-changed';
        }

        return 'block-ok';
      };

      return {
        ...(isChanged || isAdded ? block : omit(block, ['data'])),
        position: newPosition,
        id,
        action: getAction(),
      };
    });

    labelCriticalSections();

    const allowedToUpdate = !canReviewOrEdit
      // || !allChangedBlocksPeaceful
      || (!canAddOrRemove && (numOfCreated > 0 || numOfDeleted > 0));

    if (allowedToUpdate) {
      editor.current?.blocks.render({
        blocks: convertBlocksToEditorJS(blocks) || [],
      });

      toast.error('Error! You are not allowed to edit this blocks');

      return;
    }

    if (onChange) {
      onChange(allBlocks, time, version);
    }
  };

  const handleOnEditorClick = (e: any) => {
    if (isReady && editor.current) {
      checkLocks();
    }

    if (e.target.tagName === 'M') {
      // select all text in the element
      const range = document.createRange();
      range.selectNodeContents(e.target);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
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
        data: { blocks: convertBlocksToEditorJS(blocks) || [] },
        tools: EDITOR_JS_TOOLS,
        tunes: ['myTune', 'alignmentTune'],
        onChange: handleOnChange,
        placeholder: 'Start your article here!',
        onReady: () => {
          labelCriticalSections();
          if (editor.current) {
            const key = findKey(activeSections, (o) => o === get(user, 'id'));
            const currentBlock = get(content, ['blocks', key], {});
            editor.current.caret.setToBlock(get(currentBlock, 'position', 0));
            // const config = {
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
          }
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  return (
    <>
      <Modal
        type="versioning"
        sectionId={get(selectedVersioningBlock, 'id')}
        enabled={!!get(selectedVersioningBlock, 'id')}
        onViewHistory={() => onShowHistory && onShowHistory(get(selectedVersioningBlock, 'id'))}
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
      />
      <div
        id="editorjs"
        className={classNames('editorjs', { 'editorjs-read-only': readOnly || status === EditorStatus.IN_REVIEW }, `editorjs-${status}`)}
        onClick={handleOnEditorClick}
        style={{ position: 'relative' }}
        onBlur={() => {
          // const activeKey = findKey(activeSections, (o) => o === get(user, 'id'));
          // if (activeKey) {
          //   unlockSection(user.id, activeKey);
          // }
        }}
      />
    </>
  );
}

export default Editor;
