// @flow
import React, { useState } from 'react';
import { Chip, Modal as MUIModal } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  get, invert, isEqual, omit, size,
} from 'lodash';
import { faShare, faUsers, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import ShareModal from './ShareModal';
import CollabModal from './CollabModal';
import { selectors } from '../../store/articleStore';
import { useDebounce } from '../../utils/hooks';
import { selectors as userSelectors } from '../../store/userStore';

type Props = {
    shape: 'chip' | 'icon',
    text?: 'showAll' | 'showOnline',
    enabled: boolean,
    isOwner?: boolean,
    type: 'share' | 'collab',
};

function Modal(props: Props): React$Node {
  const article = useSelector((state) => selectors.article(state), isEqual);
  const activeSections = useSelector((state) => selectors.getActiveSections(state), isEqual);
  const user = useSelector((state) => userSelectors.getUser(state), isEqual);

  const [open, setOpen] = useState(false);
  const onlineNum = useDebounce(size(omit(invert(activeSections), user.id)), 1000);

  if (!props.enabled) {
    return null;
  }

  const handleClick = (e: any) => {
    e.stopPropagation();
    setOpen(true);
  };

  const renderText = () => {
    const texts = {
      share: {
        showAll: 'Share',
        showOnline: 'Share',
      },
      collab: {
        showAll: '3 Collaborators',
        showOnline: `${onlineNum} Online`,
      },
    };

    return get(texts, [props.type, props.text], '');
  };

  const renderIcon = () => {
    const icons = {
      share: faShare,
      collab: faUsers,
    };

    return get(icons, props.type, '');
  };

  const chip = (
    <Chip
      icon={<FontAwesomeIcon icon={renderIcon()} />}
      label={renderText()}
      onClick={handleClick}
      variant="default"
      color="warning"
      disabled={open}
    />
  );

  const icon = props.text && onlineNum ? (
    <div
      onClick={handleClick}
      className={classNames('modal-icon-wrapper', { disabled: open })}
    >
      <FontAwesomeIcon
        className="modal-icon-inner"
        icon={renderIcon()}

      />
      <span className="modal-icon-text">{renderText()}</span>
    </div>
  ) : (
    <FontAwesomeIcon
      className={classNames('modal-icon', { disabled: open })}
      icon={renderIcon()}
      onClick={handleClick}
    />
  );

  const renderTitle = () => {
    const titles = {
      share: 'Share',
      collab: 'Collaborators',
    };

    return get(titles, props.type, '');
  };

  const getContent = () => {
    if (props.type === 'share') {
      return (
        <ShareModal
          article={article}
        />
      );
    } else if (props.type === 'collab') {
      return (
        <CollabModal
          isOwner={props.isOwner || false}
        />
      );
    }
  };

  return (
    <>
      {props.shape === 'chip' ? chip : icon}
      <MUIModal
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        open={open}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="modal-inner">
          <div className="modal-header">
            <h2>{renderTitle()}</h2>
            <FontAwesomeIcon
              className="icon"
              icon={faXmark}
              onClick={() => setOpen(false)}
            />
          </div>
          <hr />
          {getContent()}
        </div>
      </MUIModal>
    </>

  );
}

export default Modal;
