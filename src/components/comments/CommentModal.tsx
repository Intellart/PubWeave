// import Backdrop from '@mui/material/Backdrop';
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CommentSection from "./CommentSection";
import { useState } from "react";

const style = {
  position: "absolute",
  top: "80%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  height: "40%",
  bgcolor: "background.paper",
  boxShadow: 24,
  overflow: "scroll",
  padding: 0,
  backgroundColor: "#fff",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  p: 3,
};

type Props = {
  enabled: boolean;
  articleId: number;
};

export default function CommentModal(props: Props) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (!props.enabled) {
    return null;
  }

  return (
    <div>
      <div onClick={handleOpen} className="reaction-icon-comment">
        <FontAwesomeIcon
          icon={faComment}
          style={{
            width: 28,
            height: 28,
            color: "#11273F",
          }}
        />
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
        }}
        disableScrollLock
      >
        <Fade in={open}>
          <Box sx={style} className="comment-modal">
            <CommentSection articleId={props.articleId} />
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
