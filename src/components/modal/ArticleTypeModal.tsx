import { useState } from "react";
import { Chip, Modal as MUIModal } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faNewspaper, faXmark } from "@fortawesome/free-solid-svg-icons";

type Props = {
  enabled: boolean;
  type: any;
  onConvert: () => void;
};

function ArticleTypeModal(props: Props) {
  // const article = useSelector((state) => selectors.article(state), isEqual);
  // const user = useSelector((state) => userSelectors.getUser(state), isEqual);
  const [open, setOpen] = useState(false);

  const handleClick = (e: any) => {
    e.stopPropagation();
    setOpen(false);
  };

  const chipTypeParams = () => {
    switch (props.type) {
      case "blog_article":
        return {
          label: "Blog",
          color: "info",
          icon: <FontAwesomeIcon icon={faNewspaper} />,
          variant: props.enabled ? "default" : "outlined",
        };
      case "scientific_article":
        return {
          label: "Article",
          color: "success",
          icon: <FontAwesomeIcon icon={faNewspaper} />,
          variant: props.enabled ? "default" : "outlined",
        };
      case "preprint":
        return {
          label: "Preprint",
          color: "warning",
          icon: <FontAwesomeIcon icon={faNewspaper} />,
          variant: props.enabled ? "default" : "outlined",
        };
      default:
        return {
          label: "Blog",
          color: "info",
          icon: <FontAwesomeIcon icon={faNewspaper} />,
          variant: props.enabled ? "default" : "outlined",
        };
    }
  };

  const convertToType = () => {
    switch (props.type) {
      case "blog_article":
        return "Preprint";
      case "preprint":
        return "Scientific Article";
      default:
        return "Blog Article";
    }
  };

  return (
    <>
      <Chip
        onClick={(e) => {
          if (
            !props.enabled ||
            !props.type ||
            props.type === "scientific_article"
          ) {
            return;
          }
          e.stopPropagation();
          setOpen(true);
          //
        }}
        className="article-card-side-content-status-chip"
        label={props.type || "Type"}
        {...chipTypeParams()}
      />
      {props.enabled && (
        <MUIModal
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          open={open}
          onClose={handleClick}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="modal-inner">
            <div className="modal-header">
              <h2>Converting to a {convertToType()}</h2>
              <FontAwesomeIcon
                className="icon"
                icon={faXmark}
                onClick={handleClick}
              />
            </div>
            <hr />
            <div className="are-you-sure-modal">
              <h2>
                Are you sure you want to convert this article to a{" "}
                {convertToType()}?
              </h2>
              <div className="modal-buttons">
                <button
                  type="button"
                  className="modal-button"
                  onClick={() => {
                    // navigate('/my-work/choose-type');
                    setOpen(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="modal-button"
                  onClick={() => {
                    props.onConvert();
                    setOpen(false);
                  }}
                >
                  Convert
                </button>
              </div>
            </div>
          </div>
        </MUIModal>
      )}
    </>
  );
}

export default ArticleTypeModal;
