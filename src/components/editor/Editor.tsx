import { useEffect, useRef } from "react";
import EditorJS, { API, BlockMutationEvent } from "@editorjs/editorjs";
import {
  findKey,
  forEach,
  get,
  map,
  isEqual,
  size,
  includes,
  find,
  omit,
  filter,
  union,
  values,
  differenceBy,
} from "lodash";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { useEditorTools } from "../../utils/editor_constants";
import {
  convertBlocksToEditorJS,
  editorPermissions,
  permissions,
} from "../../utils/hooks";
import VersioningTune from "../../utils/editorExtensions/versioningTune.tsx";
import useCriticalSections from "../../utils/useCriticalSections";
import useLocking from "../../utils/useLocking";
import useWebSocket from "../useWebSocket";
import Modal from "../modal/Modal";
import { store } from "../../store/index.tsx";
import {
  Article,
  BlockCategoriesToChange,
  BlockIds,
  FilledBlock,
} from "../../store/article/types.ts";
import articleSelectors from "../../store/article/selectors.ts";
import userSelectors from "../../store/user/selectors.ts";
import articleActions from "../../store/article/actions.ts";
import { groupBlocks, isBlockPeaceful, structureBlock } from "./helpers.ts";
import { Button } from "@mui/material";

export type EditorEventType =
  | "block-added"
  | "block-changed"
  | "block-removed"
  | "block-cleared" // block-removed (old) + block-added (new)
  | "block-replaced" // block-removed (old) + block-added (new) + block-changed
  | "block-filled" // block-added + block-changed
  | "block-ok";

export type EditorEvent = {
  type: EditorEventType;
  id: string;
};

// import useCopy from '../../utils/useCopy';
// import Undo from 'editorjs-undo';
// import DragDrop from 'editorjs-drag-drop';

export const EditorStatus = {
  IN_PROGRESS: "draft",
  IN_REVIEW: "reviewing",
  REVIEW_PANE: "reviewPane",
  REVIEW_PANE_READ_ONLY: "reviewPaneReadOnly",
  PUBLISHED: "published",
  PREVIEW: "preview",
};

export type EditorStat = (typeof EditorStatus)[keyof typeof EditorStatus];

type Props = {
  status: EditorStat;
  isReady: boolean;
  onChange?: (
    newBlocks: FilledBlock[],
    time?: number,
    version?: string
  ) => void;
  onShowHistory?: (sectionId: string) => void;
};

function Editor({ isReady, onChange, onShowHistory, status }: Props): any {
  const editor = useRef<null | EditorJS>(null);
  const EDITOR_JS_TOOLS = useEditorTools();

  const selectedVersioningBlock = useSelector(
    articleSelectors.getActiveBlock,
    isEqual
  );
  const content = useSelector(articleSelectors.articleContent, isEqual);
  const blocks = useSelector(articleSelectors.getBlocks, isEqual);
  const blockIdQueue = useSelector(articleSelectors.getBlockIdQueue, isEqual);
  const user = useSelector(userSelectors.getUser, isEqual);
  const activeSections = useSelector(
    articleSelectors.getActiveSections,
    isEqual
  );

  console.log("blockIdQueue", blockIdQueue);
  const article = useSelector(articleSelectors.article, isEqual);

  const userId = get(user, "id");
  const articleId = get(article, "id");
  const reviewersIds = map(get(article, "reviewers"), "user_id");
  const articleType = get(article, "article_type", "blog_article");

  // Permissions ---------------------------------------------------------------
  const readOnly = includes(
    [EditorStatus.PREVIEW, EditorStatus.PUBLISHED],
    status
  );
  const currentPermissions = editorPermissions({
    type: articleType,
    status: status || EditorStatus.IN_PROGRESS,
    userId: userId,
    ownerId: get(article, "author.id"),
    isReviewer: includes(reviewersIds, userId),
    isCollaborator: includes(
      map(get(article, "collaborators", []), "id"),
      userId
    ),
  });

  const dispatch = useDispatch();
  const setSelectedVersioningBlock = (id: string | null) =>
    dispatch(articleActions.setActiveBlock(id));

  const blockIdQueueComplete = (
    id: string,
    blockAction: "updated" | "created" | "deleted"
  ) => dispatch(articleActions.blockIdQueueComplete(id, blockAction));
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
    articleId,
    enabled: get(currentPermissions, permissions.webSockets, false),
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(
    () => labelCriticalSections(),
    [blocks, isReady, blockIdQueue, activeSections]
  );

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

      forEach(
        blockIdQueue,
        (
          blockIds: BlockIds,
          category: "updated" | "created" | "deleted" | string
        ) => {
          if (size(blockIds) === 0) return;

          forEach(blockIds, (isInEditor, blockId) => {
            if (isInEditor) return;

            switch (category) {
              case "updated":
                const blockData = get(blocks, [blockId, "data"], {});

                console.log("blockData", blockId, blockData);

                editor.current?.blocks.update(blockId, blockData);
                break;
              case "created":
              case "deleted":
                // editor.current?.blocks.delete(blockId);
                editor.current?.blocks.render({
                  blocks: convertBlocksToEditorJS(blocks) || [],
                });
                break;
              default:
                break;
            }
            blockIdQueueComplete(
              blockId,
              category as "updated" | "created" | "deleted"
            );
          });
        }
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
  const handleOnChange = async (
    api: API,
    events_: BlockMutationEvent | BlockMutationEvent[]
  ) => {
    // console.log("handleOnChange", events_);

    const events = map(Array.isArray(events_) ? events_ : [events_], (e) => ({
      type: e.type,
      id: e.detail?.target.id,
    })) as EditorEvent[];

    const { time, version, blocks: blocks_ } = await api.saver.save();

    const newBlocks = map(blocks_ as FilledBlock[], (block, index) => ({
      ...block,
      position: index,
    })) as FilledBlock[];

    const oldBlocks = values(
      store.getState().article.oneArticle.content.blocks
    ) as FilledBlock[];

    const numOfCreated = size(differenceBy(newBlocks, oldBlocks, "id"));
    const numOfDeleted = size(differenceBy(oldBlocks, newBlocks, "id"));

    const allIds = union(map(oldBlocks, "id"), map(newBlocks, "id"));

    const changedBlockIds = map(
      filter(events, ["type", "block-changed"]),
      "id"
    );

    const {
      // content: { /* time_, */ blocks: blocks_/*  version_ */ },
      activeSections: activeSections_,
    } = store.getState().article as Article;

    console.log("newBlocks", newBlocks);

    const locking = get(currentPermissions, permissions.locking, false);

    const allBlocks = map(allIds, (id) => {
      const oldPosition = get(find(oldBlocks, ["id", id]), "position");
      const newPosition = get(find(newBlocks, ["id", id]), "position");

      const isRemoved = newPosition === undefined;
      const isAdded = oldPosition === undefined;

      const block = isRemoved
        ? find(oldBlocks, ["id", id])
        : find(newBlocks as FilledBlock[], ["id", id]);

      const isChanged =
        includes(changedBlockIds, id) &&
        (!locking || isBlockPeaceful(id, activeSections_, userId));

      const getAction = () => {
        if (isRemoved) {
          return "block-removed";
        }

        if (isAdded) {
          return "block-added";
        }

        if (isChanged) {
          return "block-changed";
        }

        return "block-ok";
      };

      return {
        ...(isChanged || isAdded ? block : omit(block, ["data"])),
        position: newPosition,
        id,
        action: getAction(),
      };
    }) as FilledBlock[];

    const canReviewOrEdit = get(
      currentPermissions,
      permissions.REVIEW_OR_EDIT_BLOCKS,
      false
    );
    const canAddOrRemove = get(
      currentPermissions,
      permissions.ADD_OR_REMOVE_BLOCKS,
      false
    );

    labelCriticalSections();

    const allowedToUpdate =
      !canReviewOrEdit ||
      // || !allChangedBlocksPeaceful
      (!canAddOrRemove && (numOfCreated > 0 || numOfDeleted > 0));

    if (allowedToUpdate) {
      // reset the editor with the new blocks
      editor.current?.blocks.render({
        blocks: convertBlocksToEditorJS(blocks) || [],
      });

      toast.error("Error! You are not allowed to edit this blocks");

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

    if (e.target.tagName === "M") {
      // select all text in the element
      const range = document.createRange();
      range.selectNodeContents(e.target);
      const selection = window.getSelection() as Selection;
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  const setEditorJs = () =>
    new EditorJS({
      logLevel: "ERROR" as any,
      holder: "editorjs",
      readOnly,
      // spellcheck: true,
      inlineToolbar: status === EditorStatus.IN_REVIEW ? ["myReview"] : true,
      data: { blocks: convertBlocksToEditorJS(blocks) || [] },
      tools: EDITOR_JS_TOOLS,
      tunes: ["myTune", "alignmentTune"],
      onChange: handleOnChange,
      placeholder: "Start your article here!",
      onReady: () => {
        labelCriticalSections();
        if (editor.current) {
          const key = findKey(activeSections, (o) => o === userId);

          if (key) {
            const currentBlock = get(content, ["blocks", key], {});

            const firstBlock = get(currentBlock, "position", 0);

            editor.current.caret.setToBlock(firstBlock);
          }

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

  useEffect(() => {
    if (isReady && !editor.current) {
      editor.current = setEditorJs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  return (
    <>
      <Modal
        type="versioning"
        sectionId={get(selectedVersioningBlock, "id")}
        enabled={!!get(selectedVersioningBlock, "id")}
        onViewHistory={() =>
          onShowHistory && onShowHistory(get(selectedVersioningBlock, "id"))
        }
        // versionInfo={this.vbInfo}
        onClose={() => {
          VersioningTune.uncheckOldWrapper(
            VersioningTune.previousWrapper,
            "cdx-versioning-selected"
          );
          VersioningTune.setActiveBlockId(null);
          VersioningTune.previousWrapper = null;
          setSelectedVersioningBlock(null);
        }}
      />
      <div
        id="editorjs"
        className={classNames(
          "editorjs",
          {
            "editorjs-read-only": readOnly || status === EditorStatus.IN_REVIEW,
          },
          `editorjs-${status}`
        )}
        onClick={handleOnEditorClick}
        style={{ position: "relative" }}
        onBlur={() => {
          // const activeKey = findKey(activeSections, (o) => o === get(user, 'id'));
          // if (activeKey) {
          //   unlockSection(user.id, activeKey);
          // }
        }}
      ></div>
    </>
  );
}

export default Editor;
