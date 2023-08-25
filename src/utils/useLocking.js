// @flow
import { useDispatch, useSelector } from 'react-redux';
import {
  isEqual, get, has, size,
} from 'lodash';
import { selectors, actions } from '../store/articleStore';
import { selectors as userSelectors } from '../store/userStore';

type LockingProps = {
    blocks: any,
    editor: any,
    enabled: boolean,
};

const useLocking = ({ blocks, editor, enabled } : LockingProps): { checkLocks: () => void } => {
  const activeSections = useSelector((state) => selectors.getActiveSections(state), isEqual);
  const user = useSelector((state) => userSelectors.getUser(state), isEqual);

  const dispatch = useDispatch();
  const lockSection = (userId: number, sectionId: string) => dispatch(actions.lockSection(userId, sectionId));
  // const unlockSection = (userId: number, sectionId: string) => dispatch(actions.unlockSection(userId, sectionId));

  const checkLocks = () => {
    if (!enabled) return;
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

export default useLocking;
