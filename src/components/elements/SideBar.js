import { faThumbtack, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

type Props = {
  showSidebar: boolean,
  setShowSidebar: Function,
  snapSidebar: boolean,
  setSnapSidebar: Function,
};

function SideBar(props: Props) {
  const {
    showSidebar,
    setShowSidebar,
    snapSidebar,
    setSnapSidebar,
  } = props;

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
            setShowSidebar(false);
            setSnapSidebar(false);
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
