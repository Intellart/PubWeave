// @flow
import React, { useState } from 'react';
import { Button, Modal as MUIModal } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

type Props = {
    button: string,
    content: any,
    onClose?: () => void,
    title: string,
    enabled: boolean,
};

function ModalWrapper(props: Props): React$Node {
  const [open, setOpen] = useState(false);
  const handleOpen = (e: any) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if (props.onClose) {
      props.onClose();
    }
  };

  if (!props.enabled) {
    return null;
  }

  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpen}
        disabled={open}
      >
        {props.button}
      </Button>
      <MUIModal
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        open={open}
        onClose={handleClose}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="modal-inner">
          <div className="modal-header">
            <h2>{props.title}</h2>
            <FontAwesomeIcon
              className="icon"
              icon={faXmark}
              onClick={handleClose}
            />
          </div>
          <hr />
          {props.content({ onClose: handleClose })}

        </div>
      </MUIModal>
    </>
  );
}

export default ModalWrapper;
