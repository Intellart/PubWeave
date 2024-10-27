import { get, isEqual } from "lodash";

import { useSelector } from "react-redux";
import { ReduxState } from "../../types";
import { ArticleContent } from "../../store/article/types";
import articleSelectors from "../../store/article/selectors";

type VersioningInfoCardProps = {
  sectionId?: string;
  onViewHistory?: () => void;
};

export default function VersioningInfoCard(props: VersioningInfoCardProps) {
  const content: ArticleContent = useSelector(
    (state: ReduxState) => articleSelectors.articleContent(state),
    isEqual
  );

  const currentBlock = get(content, ["blocks", props.sectionId], {});

  console.log(props.sectionId, currentBlock);

  const currentlyBeingEditedBy = get(currentBlock, "current_editor_id", "");
  const collaboratorId = get(currentBlock, "collaborator_id", "");

  return (
    <div className="versioning-modal">
      <div className="versioning-modal-row">
        <div className="versioning-modal-row-item">
          <p className="versioning-modal-row-item-title">Block ID</p>
          <p className="versioning-modal-row-item-value">
            {get(currentBlock, "id", "")}
          </p>
        </div>
        <div className="versioning-modal-row-item">
          <p className="versioning-modal-row-item-title">Last updated</p>
          <p className="versioning-modal-row-item-value">
            {get(currentBlock, "time", "")}
          </p>
        </div>
      </div>
      <div className="versioning-modal-row">
        <div className="versioning-modal-row-item">
          <p className="versioning-modal-row-item-title">Author</p>
          <p className="versioning-modal-row-item-value">
            {collaboratorId || ""}
          </p>
        </div>
        <div className="versioning-modal-row-item">
          <p className="versioning-modal-row-item-title">Currently editing</p>
          <p className="versioning-modal-row-item-value">
            {currentlyBeingEditedBy || "/"}
          </p>
        </div>
      </div>
      <div className="versioning-modal-row">
        <div className="versioning-modal-row-item">
          <p className="versioning-modal-row-item-title">Version number</p>
          <p className="versioning-modal-row-item-value">
            v{get(currentBlock, "version_number", "")}
          </p>
        </div>
        <button
          className="versioning-modal-row-item versioning-modal-row-item-button"
          onClick={props.onViewHistory}
        >
          View history
        </button>
      </div>
    </div>
  );
}
