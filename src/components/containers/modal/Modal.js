// @flow
import React, { useState } from 'react';
import { Chip, Modal as MUIModal } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { get, isEqual } from 'lodash';
import { faShare, faUsers, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import ShareModal from './ShareModal';
import CollabModal from './CollabModal';
import { selectors } from '../../../store/articleStore';

type ShareProps = {
    type: 'share',
    enabled: boolean,
};

type CollabProps = {
    type: 'collab',
    enabled: boolean,
    isOwner?: boolean,
    extendedIcon?: boolean,
};

function Modal({
  type, enabled, extendedIcon = false, isOwner = false,
}: ShareProps | CollabProps): any {
  const article = useSelector((state) => selectors.article(state), isEqual);

  const [open, setOpen] = useState(false);

  if (!enabled) {
    return null;
  }

  type ModalType = {
    icon: string,
    title: string,
    content: React$Node,
    extendedText?: string,
  };

  const types : { [string]: ModalType } = {
    share: {
      icon: faShare,
      title: 'Share',
      content: <ShareModal
        article={article}
      />,
    },
    collab: {
      icon: faUsers,
      title: 'Add Collaborators',
      extendedText: '3 Collaborators',
      content: <CollabModal
        // article={article}
        isOwner={isOwner}
      />,
    },
  };

  const shareProps: ModalType = get(types, type, {});

  return (
    <>
      {extendedIcon ? (
        <Chip
          icon={<FontAwesomeIcon icon={shareProps.icon} />}
          label={shareProps.extendedText}
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          variant="default"
          color="warning"

        />
      ) : (
        <FontAwesomeIcon
          className="modal-icon"
          icon={shareProps.icon}
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
        />
      )}
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
            <h2>{shareProps.title}</h2>
            <FontAwesomeIcon
              className="icon"
              icon={faXmark}
              onClick={() => setOpen(false)}
            />
          </div>
          <hr />
          {shareProps.content}
        </div>
      </MUIModal>
    </>

  );
}

export default Modal;
