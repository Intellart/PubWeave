import * as React from 'react';
// import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CommentSection from './CommentSection';

const style = {
  position: 'absolute',
  top: '80%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  height: '40%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  overflow: 'scroll',
  padding: 0,
  backgroundColor: '#c7cdd4',
  p: 3,
};

export default function TransitionsModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}><FontAwesomeIcon
        icon={faComment}
        style={{
          width: 28, height: 28, color: '#11273F', marginLeft: 14,
        }}
      />
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style} className="comment-modal">
            <CommentSection />
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
