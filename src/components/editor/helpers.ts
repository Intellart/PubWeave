import { BlockMutationEvent } from "@editorjs/editorjs";
import { Action, Block, FilledBlock } from "../../store/article/types";
import { SavedData } from "@editorjs/editorjs/types/data-formats";
import { filter, first, get, groupBy, mapValues, size } from "lodash";

export const fetchBlockSavedData = async (
  e: BlockMutationEvent
): Promise<void | SavedData> => {
  return await e.detail.target.save();
};

const convertType = (type: BlockMutationEvent["type"]): Action => {
  return get(
    {
      "block-changed": "changed",
      "block-added": "created",
      "block-removed": "deleted",
      "block-moved": "moved",
    },
    type || "block-changed"
  );
};

export const structureBlock = async (
  e: BlockMutationEvent
): Promise<FilledBlock> => {
  const data = (await fetchBlockSavedData(e)) as SavedData & { tunes: any };

  return {
    action: convertType(e.type),
    position: (e.detail as any).index,
    type: e.detail.target.name,
    ...data,
  };
};

/**
 * For each list of events, we flatten them into one event.
 */
export const flattenEvents = (blockArray: Array<FilledBlock>): FilledBlock => {
  // blockArray has the same id
  const firstBlock = first(blockArray) as FilledBlock;

  switch (size(blockArray)) {
    case 1:
      return firstBlock;
    case 2:
      const createdBlockIndex = firstBlock.action !== "created" ? 1 : 0;

      return {
        ...blockArray[createdBlockIndex],
        data: blockArray[(createdBlockIndex + 1) % 2].data,
      };
    default:
      return firstBlock;
  }
};

/**
 * Checks if the block is peaceful:
 *  1. if it is not owned by anyone
 *  OR
 *  2. it is owned by the current user.
 * @param {string} blockId - The block id.
 * */
export const isBlockPeaceful = (
  blockId: string,
  activeSections: {
    [key: string]: number;
  },
  userId?: number
) => {
  const blockOwner = get(activeSections, blockId, null);

  return !blockOwner || blockOwner === userId;
};

/**
 * For each event, that can be block-changed, block-added, block-removed,
 * we get block/event type, position, and data.
 * e.detail.target.save() returns a promise with ACTUAL block data.
 *
 * Note: block-added and block-removed events can be fired twice for the same block,
 * so we need to group them by block id and then merge them.
 */
export const groupBlocks = (
  blocks: FilledBlock[],
  activeSections_: {
    [key: string]: number;
  },
  userId?: number,
  locking = false
) => {
  const blocksGroupedById = groupBy(blocks, "id");

  const blockFlattened = mapValues(blocksGroupedById, flattenEvents);
  const blocksGroupedByAction = groupBy(blockFlattened, "action");

  const allChangedBlocksPeaceful = filterPeacefulBlocks(
    blocksGroupedByAction.changed,
    activeSections_,
    userId,
    locking
  );

  return {
    updated: allChangedBlocksPeaceful,
    created: blocksGroupedByAction.created,
    deleted: blocksGroupedByAction.deleted,
  };
};

export const filterPeacefulBlocks = (
  blocks: FilledBlock[],
  activeSections: {
    [key: string]: number;
  },
  userId?: number,
  locking = false
): FilledBlock[] =>
  filter(
    blocks,
    (block: FilledBlock) =>
      !locking || isBlockPeaceful(block.id, activeSections, userId)
  );
