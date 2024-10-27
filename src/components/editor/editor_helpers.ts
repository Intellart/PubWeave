// import { get, groupBy, map, mapValues } from "lodash";
// import { BlocksToChange } from "../../store/types";

// /**
//  * Handles the onChange event of the editor.
//  * @param {any} api - The API object.
//  * @param {any} events_ - The events object or array of events.
//  */
// export const handleOnChange = async (api: any, events_: any) => {
//   const events = Array.isArray(events_) ? events_ : [events_];

//   console.log("events", events);

//   const {
//     // content: { /* time_, */ blocks: blocks_/*  version_ */ },
//     activeSections: activeSections_,
//   } = store.getState().article;

//   const canReviewOrEdit = get(
//     currentPermissions,
//     permissions.REVIEW_OR_EDIT_BLOCKS,
//     false
//   );
//   const canAddOrRemove = get(
//     currentPermissions,
//     permissions.ADD_OR_REMOVE_BLOCKS,
//     false
//   );
//   const locking = get(currentPermissions, permissions.locking, false);

//   /**
//    * For each list of events, we flatten them into one event.
//    */
//   const flattenEvents = (blockArray: Array<Block>): Block | null => {
//     const firstEvent = blockArray[0];
//     switch (blockArray.length) {
//       case 1:
//         return {
//           ...firstEvent,
//           action: firstEvent.action,
//         };
//       case 2:
//         const createdBlockIndex = firstEvent.action !== "created" ? 1 : 0;

//         return {
//           ...blockArray[createdBlockIndex],
//           data: blockArray[(createdBlockIndex + 1) % 2].data,
//         };
//       default:
//         return null;
//     }
//   };

//   /**
//    * For each event, that can be block-changed, block-added, block-removed,
//    * we get block/event type, position, and data.
//    * e.detail.target.save() returns a promise with ACTUAL block data.
//    *
//    * Note: block-added and block-removed events can be fired twice for the same block,
//    * so we need to group them by block id and then merge them.
//    */
//   const { created, changed, deleted } = groupBy(
//     mapValues(
//       groupBy(
//         await Promise.all(
//           map(events, async (e) => ({
//             action: get(
//               {
//                 "block-changed": "changed",
//                 "block-added": "created",
//                 "block-removed": "deleted",
//                 "block-moved": "moved",
//               },
//               e.type || "block-changed"
//             ),
//             position: e.detail.index,
//             type: e.detail.target.name,
//             ...(await e.detail.target.save()),
//           }))
//         ),
//         "id"
//       ),
//       flattenEvents
//     ),
//     "action"
//   ) as {
//     created: BlocksToChange;
//     changed: BlocksToChange;
//     deleted: BlocksToChange;
//   };

//   labelCriticalSections();

//   /**
//    * Checks if the block is peaceful:
//    *  1. if it is not owned by anyone
//    *  OR
//    *  2. it is owned by the current user.
//    * @param {string} blockId - The block id.
//    * */
//   const isBlockPeaceful = (blockId: string) => {
//     const blockOwner = get(activeSections_, blockId, null);
//     const currentUserId = get(user, "id");

//     return !blockOwner || (blockOwner && blockOwner === currentUserId);
//   };

//   const allChangedBlocksPeaceful = filter(
//     changed,
//     (block) => !locking || isBlockPeaceful(block.id)
//   );

//   if (
//     !canReviewOrEdit ||
//     // || !allChangedBlocksPeaceful
//     (!canAddOrRemove && (size(created) > 0 || size(deleted) > 0))
//   ) {
//     editor.current?.blocks.render({
//       blocks: convertBlocksToEditorJS(blocks) || [],
//     });

//     toast.error("Error! You are not allowed to edit this blocks");

//     return;
//   }

//   const { time, version } = await api.saver.save();

//   if (onChange) {
//     onChange(
//       { created, changed: allChangedBlocksPeaceful, deleted },
//       time,
//       version
//     );
//   }
// };
