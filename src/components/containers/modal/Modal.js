// @flow
import React from 'react';
import { Modal as MUIModal } from '@mui/material';

type Props = {
    open: boolean,
    onClose: Function,
    children: any,
};

function Modal(props: Props): React$Node {
  return (
    <MUIModal
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      open={props.open}
      onClose={props.onClose}
    >
      {props.children}
    </MUIModal>

  );
}

export default Modal;
