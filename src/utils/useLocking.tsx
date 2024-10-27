import { useDispatch, useSelector } from "react-redux";
import { isEqual, get, has, size } from "lodash";
import articleSelectors from "../store/article/selectors";
import userSelectors from "../store/user/selectors";
import articleActions from "../store/article/actions";

type LockingProps = {
  blocks: any;
  editor: any;
  enabled: boolean;
};

const useLocking = ({
  blocks,
  editor,
  enabled,
}: LockingProps): { checkLocks: () => void } => {
  const activeSections = useSelector(
    articleSelectors.getActiveSections,
    isEqual
  );
  const user = useSelector(userSelectors.getUser, isEqual);

  const dispatch = useDispatch();
  const lockSection = (userId: number, sectionId: string) =>
    dispatch(articleActions.lockSection(userId, sectionId));
  // const unlockSection = (userId: number, sectionId: string) => dispatch(actions.unlockSection(userId, sectionId));

  const checkLocks = () => {
    if (!enabled || !editor) {
      return;
    }
    const blockIndex = editor.blocks.getCurrentBlockIndex();
    if (blockIndex >= 0 && blockIndex < size(blocks)) {
      const blockId = get(editor.blocks.getBlockByIndex(blockIndex), "id");
      if (blockId) {
        if (!has(activeSections, blockId)) {
          console.log("CARRET AT", blockIndex, "-> ID: ", blockId);
          lockSection(user?.id as number, blockId);
        } /* else {
          unlockSection(user.id, findKey(activeSections, (o) => o === get(user, 'id')));
        } */
      }
    }
  };

  return { checkLocks };
};

export default useLocking;
