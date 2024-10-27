import { faThumbtack, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEqual, map } from "lodash";
import { ReduxState } from "../../types";
import articleActions from "../../store/article/actions";
import articleSelectors from "../../store/article/selectors";

type Props = {
  sectionId: string | null;
  showSidebar: boolean;
  setShowSidebar: Function;
  snapSidebar: boolean;
  setSnapSidebar: Function;
};

function SideBar(props: Props) {
  const { showSidebar, setShowSidebar, snapSidebar, setSnapSidebar } = props;

  const dispatch = useDispatch();
  const fetchVersions = (sectionId: string) =>
    dispatch(articleActions.fetchVersions(sectionId));

  useEffect(() => {
    if (props.sectionId) {
      fetchVersions(props.sectionId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.sectionId]);

  const versions = useSelector(
    (state: ReduxState) => articleSelectors.getVersions(state),
    isEqual
  );

  // console.log('VERSIONS', versions, props.sectionId);

  const [selectedVersion, setSelectedVersion] = useState(0);

  if (!showSidebar) return <div />;

  return (
    <div className="editors-sidebar">
      {selectedVersion !== -1 && <div className="editors-sidebar-version" />}

      <div className="editors-sidebar-top">
        <div className="editors-sidebar-top-snap">
          <FontAwesomeIcon
            icon={faThumbtack}
            onClick={() => setSnapSidebar(!snapSidebar)}
            style={{
              color: snapSidebar ? "#000" : "#ccc",
            }}
          />
        </div>
        <div
          className="editors-sidebar-top-x"
          onClick={() => {
            setSnapSidebar(false);
            setShowSidebar(false);
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </div>
      </div>
      {map(versions, (version, index) => (
        <div
          key={index}
          className="editors-sidebar-item"
          onClick={() => {
            // console.log('VERSION', version);
            if (version.version_number === selectedVersion) {
              setSelectedVersion(-1);
            } else {
              setSelectedVersion(index);
            }
          }}
        >
          <div className="editors-sidebar-item-last-edit">
            <div className="editors-sidebar-item-last-edit-title">
              Version {version.version_number}
            </div>
            <div className="editors-sidebar-item-last-edit-time">
              12/05/2021 12:00
            </div>
          </div>
          <div className="editors-sidebar-item-name">
            <div className="editors-sidebar-item-name-title">
              Colab:{version.collaborator_id}
            </div>
            <div className="editors-sidebar-item-name-action">Show version</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SideBar;
