// @flow
import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import {
  get,
  map,
  isEqual,
  values,
  find,
  includes,
  omit,
  union,
  filter,
} from 'lodash';

import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { store } from '../../store';
import { useEditorTools } from '../../utils/editor_constants';
import type {
  BlockCategoriesToChange,
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
      get(find(get(store.getState().article.oneArticle, 'reviewers', []), (reviewer) => reviewer.user_id === userId), 'review_content.content.blocks', []),
    );

    const allIds = union(map(oldBlocks, 'id'), map(newBlocks, 'id'));

    const changedBlockIds = map(
      filter(events, ['type', 'block-changed']),
      'id',
    );

    const allBlocks = map(allIds, (id) => {
      const oldPosition = get(find(oldBlocks, ['id', id]), 'position');
      const newPosition = get(find(newBlocks, ['id', id]), 'position');

      const isRemoved = newPosition === undefined;
      const isAdded = oldPosition === undefined;

      const block = isRemoved
        ? find(oldBlocks, ['id', id])
        : find(newBlocks, ['id', id]);

      const isChanged = includes(changedBlockIds, id);

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

    if (onChange) {
      onChange(allBlocks, time, version);
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
        holder: `editorjs-review-${userId}`,
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
      id={`editorjs-review-${userId}`}
      className={classNames('editorjs', { 'editorjs-read-only': readOnly || status === EditorStatus.IN_PROGRESS }, `editorjs-${status}`)}
      onClick={handleOnEditorClick}
      style={{ position: 'relative' }}
      onBlur={() => {
      }}
    />

  );
}

export default ReviewEditor;
