// @flow
import React from 'react';
import ReactDOM from 'react-dom';

function CollabModal (): any {
  return ReactDOM.createPortal(
    <div className="modal is-active">
      <div
        className="modal-background"
      />
      <div className="modal-content">
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="box"
        >
          <div className="field">
            <label
              className="label"
              htmlFor="collaborator-name"
            >Collaborator&apos;s Email
            </label>
            <div
              className="control"
              id="collaborator-name"
            >
              <input className="input" type="email" placeholder="e.g." />
            </div>
          </div>
          <button
            className="button is-primary"
            type="button"
          >Add Collaborator
          </button>
        </div>
      </div>
      <button className="modal-close is-large" aria-label="close" />
    </div>,
    document.body,
  );
}

export default CollabModal;
