import { faThumbtack, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty, isEqual } from 'lodash';
import { actions, selectors } from '../../store/articleStore';

type Props = {
  showSidebar: boolean,
  setShowSidebar: Function,
  snapSidebar: boolean,
  setSnapSidebar: Function,
  blockId: any,
};

function SideBar(props: Props) {
  const {
    showSidebar,
    setShowSidebar,
    snapSidebar,
    setSnapSidebar,
    blockId,
  } = props;

  const versions = useSelector((state) => selectors.getVersions(state), isEqual);

  // dispatch
  const dispatch = useDispatch();
  const fetchVersions = (id) => dispatch(actions.fetchVersions(id));

  useEffect(() => {
    if (showSidebar && blockId.current && isEmpty(versions)) {
      fetchVersions(blockId.current);
    }
  }, [showSidebar, blockId.current, versions]);

  if (!showSidebar) return null;

  return (
    <div className='editors-sidebar'>
      <div className='editors-sidebar-top'>
        <div className='editors-sidebar-top-snap'>
          <FontAwesomeIcon
            icon={faThumbtack}
            onClick={() => setSnapSidebar(!snapSidebar)}
            style={{
              color: snapSidebar ? '#000' : '#ccc',
            }}
          />
        </div>
        <div
          className='editors-sidebar-top-x'
          onClick={() => {
            setSnapSidebar(false);
            setShowSidebar(false);
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </div>
      </div>
      <div className='editors-sidebar-item'>
        <div className='editors-sidebar-item-last-edit'>
          <div className='editors-sidebar-item-last-edit-title'>
            Last edit
          </div>
          <div className='editors-sidebar-item-last-edit-time'>
            8 minutes ago
          </div>
        </div>
        <div className='editors-sidebar-item-name'>
          <div className='editors-sidebar-item-name-title'>
            Mark Twain
          </div>
          <div className='editors-sidebar-item-name-action'>
            Show version
          </div>
        </div>
      </div>
      <div className='editors-sidebar-item'>
        <div className='editors-sidebar-item-last-edit'>
          <div className='editors-sidebar-item-last-edit-title'>
            Last edit
          </div>
          <div className='editors-sidebar-item-last-edit-time'>
            8 minutes ago
          </div>
        </div>
        <div className='editors-sidebar-item-name'>
          <div className='editors-sidebar-item-name-title'>
            Mark Twain
          </div>
          <div className='editors-sidebar-item-name-action'>
            Show version
          </div>
        </div>
      </div>
      <div className='editors-sidebar-item'>
        <div className='editors-sidebar-item-last-edit'>
          <div className='editors-sidebar-item-last-edit-title'>
            Last edit
          </div>
          <div className='editors-sidebar-item-last-edit-time'>
            8 minutes ago
          </div>
        </div>
        <div className='editors-sidebar-item-name'>
          <div className='editors-sidebar-item-name-title'>
            Mark Twain
          </div>
          <div className='editors-sidebar-item-name-action'>
            Show version
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
