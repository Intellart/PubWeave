// @flow
import React, { useEffect, useState } from 'react';
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
import VersioningInfoCard from '../editor/VersioningInfoCard';

type Props = {
    shape?: 'chip' | 'icon',
    text?: 'showAll' | 'showOnline',
    enabled: boolean,
    isOwner?: boolean,
    type: 'share' | 'collab' | 'versioning',
    sectionId?: string,
    onClose?: () => void,
    onViewHistory?: () => void,
};

function Modal(props: Props): React$Node {
  const article = useSelector((state) => selectors.article(state), isEqual);
  const activeSections = useSelector((state) => selectors.getActiveSections(state), isEqual);
  const user = useSelector((state) => userSelectors.getUser(state), isEqual);

  const [open, setOpen] = useState(false);
  const onlineNum = useDebounce(size(omit(invert(activeSections), get(user, 'id'))), 1000);

  useEffect(() => {
    if (!props.shape) {
      setOpen(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.enabled]);

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
      versioning: {
        showAll: 'Versioning',
        showOnline: 'Versioning',
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
      versioning: 'Section info',
    };

    return get(titles, props.type, '');
  };

  const handleOnClose = () => {
    setOpen(false);
    if (props.onClose) {
      props.onClose();
    }
  };

  const handleViewHistory = () => {
    if (props.onViewHistory) {
      props.onViewHistory();
    }

    handleOnClose();
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
    } else if (props.type === 'versioning') {
      return (
        <VersioningInfoCard
          sectionId={props.sectionId}
          onViewHistory={handleViewHistory}
          // versionInfo={this.vbInfo}

        />
      );
    }
  };

  return (
    <>
      {props.shape && (props.shape === 'chip' ? chip : icon)}
      <MUIModal
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        open={open}
        onClose={handleOnClose}
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
              onClick={handleOnClose}
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
