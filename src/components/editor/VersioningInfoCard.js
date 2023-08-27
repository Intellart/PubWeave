import React from 'react';

type VersioningInfoCardProps = {
    // block: any,
    onClose: any,
    // versionInfo: any,
    style: any,
  };

export default function VersioningInfoCard(props:VersioningInfoCardProps) {
  // console.log(props.versionInfo);

  return (
    <div
      className='cdx-versioning-info-card'
      style={props.style}
    >
      <div
        className="cdx-versioning-info-card-close"
        onClick={() => {
          props.onClose();
        }}
      > Close
      </div>
      <button
        type="button"
        className="cdx-versioning-info-card-button"
        onClick={() => {
          // props.versionInfo.current.onViewVersions();
        }}
      >
        Show history
      </button>

      <div className="cdx-versioning-info-card-row">
        <div className="cdx-versioning-info-card-row-item">
          <p className="cdx-versioning-info-card-row-item-title">Block ID</p>
          <p
            className="cdx-versioning-info-card-row-item-value"
            id="cdx-versioning-info-card-block-id"
          >
            {/* {props.block.id} */}
          </p>
        </div>
        <div className="cdx-versioning-info-card-row-item">
          <p className="cdx-versioning-info-card-row-item-title">Last updated</p>
          <p
            className="cdx-versioning-info-card-row-item-value"
            id="cdx-versioning-info-card-last-updated"
          >
            {/* {props.versionInfo.current.lastUpdated} */}
          </p>
        </div>
      </div>
      <div className="cdx-versioning-info-card-row">
        <div className="cdx-versioning-info-card-row-item">
          <p className="cdx-versioning-info-card-row-item-title">Author name</p>
          <p
            className="cdx-versioning-info-card-row-item-value"
            id="cdx-versioning-info-card-author-name"
          >
            {/* {props.versionInfo.current.author} */}
          </p>
        </div>

      </div>

    </div>
  );
}
