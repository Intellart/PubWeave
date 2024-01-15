// @flow
import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import {
  get,
  map,
  groupBy,
  isEqual,
  mapValues,

  find,
} from 'lodash';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { useEditorTools } from '../../utils/editor_constants';
import type {
  Block,
  BlockCategoriesToChange,
  BlocksToChange,
} from '../../store/articleStore';
import { selectors } from '../../store/articleStore';
import {
  convertBlocksToEditorJS,
  // editorPermissions,
  // permissions,
} from '../../utils/hooks';
import type { EditorStatusType } from './Editor';
import { EditorStatus } from './Editor';
// import useCopy from '../../utils/useCopy';
// import Undo from 'editorjs-undo';
// import DragDrop from 'editorjs-drag-drop';

type Props = {
  status: EditorStatusType,
  isReady: boolean,
  userId: number,
  onChange?: (
    newBlocks: BlockCategoriesToChange,
    time: number,
    version: string
  ) => void,
};

function ReviewEditor({
  isReady,
  onChange,
  status,
  userId,
}: Props): any {
  const editor = useRef(null);
  const EDITOR_JS_TOOLS = useEditorTools();

  const article = useSelector((state) => selectors.article(state), isEqual);

  const articleReviewers = get(article, 'reviewers', []);
  const articleReview = find(articleReviewers, (reviewer) => reviewer.user_id === userId);
  const articleReviewContent = get(articleReview, 'review_content', '');

  const blocks = get(articleReviewContent, ['content', 'blocks'], []);

  // Permissions ---------------------------------------------------------------
  const readOnly = status === EditorStatus.REVIEW_PANE_READ_ONLY;
  // const currentPermissions = editorPermissions({
  //   type: get(article, 'article_type'),
  //   status: status || EditorStatus.IN_PROGRESS,
  //   userId: get(user, 'id'),
  //   ownerId: get(article, 'author.id'),
  //   isReviewer: includes(get(article, 'reviewers', []), get(user, 'id')),
  //   isCollaborator: includes(map(get(article, 'collaborators', []), 'id'), get(user, 'id')),
  // });

  /**
   * Handles the onChange event of the editor.
   * @param {any} api - The API object.
   * @param {any} events_ - The events object or array of events.
   */
  const handleOnChange = async (api: any, events_: any) => {
    const events = Array.isArray(events_) ? events_ : [events_];

    /**
     * For each list of events, we flatten them into one event.
     */
    const flattenEvents = (blockArray: Array<Block>): Block | null => {
      const firstEvent = blockArray[0];
      switch (blockArray.length) {
        case 1:
          return {
            ...firstEvent,
            action: firstEvent.action,
          };
        case 2:
          const createdBlockIndex = firstEvent.action !== 'created' ? 1 : 0;

          return {
            ...blockArray[createdBlockIndex],
            data: blockArray[(createdBlockIndex + 1) % 2].data,
          };
        default:
          return null;
      }
    };

    /**
     * For each event, that can be block-changed, block-added, block-removed,
     * we get block/event type, position, and data.
     * e.detail.target.save() returns a promise with ACTUAL block data.
     *
     * Note: block-added and block-removed events can be fired twice for the same block,
     * so we need to group them by block id and then merge them.
     */
    const { created, changed, deleted }: {
      created: BlocksToChange,
      changed: BlocksToChange,
      deleted: BlocksToChange,
    } = groupBy(mapValues(
      groupBy(
        await Promise.all(
          map(events, async (e) => ({
            action: {
              'block-changed': 'changed',
              'block-added': 'created',
              'block-removed': 'deleted',
              'block-moved': 'moved',
            }[e.type || 'block-changed'],
            position: e.detail.index,
            type: e.detail.target.name,
            ...(await e.detail.target.save()),
          })),
        ),
        'id',
      ),
      flattenEvents,
    ), 'action');

    const { time, version } = await api.saver.save();

    if (onChange) {
      onChange({ created, changed, deleted }, time, version);
    }
  };

  const handleOnEditorClick = (e: any) => {
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
        holder: 'editorjs-review',
        readOnly,
        spellcheck: false,
        inlineToolbar: true,
        data: { blocks: convertBlocksToEditorJS(blocks) || [] },
        tools: EDITOR_JS_TOOLS,
        tunes: ['myTune', 'alignmentTune'],
        onChange: handleOnChange,
        placeholder: 'Start your article here!',
        // onReady: () => {
        //   if (editor.current) {
        //   }
        // },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  return (
    <div
      id="editorjs-review"
      className={classNames('editorjs', { 'editorjs-read-only': readOnly || status === EditorStatus.IN_PROGRESS }, `editorjs-${status}`)}
      onClick={handleOnEditorClick}
      style={{ position: 'relative' }}
      onBlur={() => {
      }}
    />

  );
}

export default ReviewEditor;
