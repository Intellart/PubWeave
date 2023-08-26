// @flow
import React from 'react';

type CollabModalProps = {
    // article?: any,
    isOwner: boolean,
};

function CollabModal ({ isOwner }: CollabModalProps): any {
  return (
    <div className="collab-modal">
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
          <button
            className="button is-primary"
            type="button"
          >Add
          </button>
        </div>
      </div>
      <ul className="collaborators">
        <li className="collaborator">
          <p className="collaborator-name">John Doe</p>
          {isOwner && (
          <button
            className="button is-danger"
            type="button"
          >Remove
          </button>
          ) }
        </li>
        <li className="collaborator">
          <p className="collaborator-name">Jane Doe</p>
          {isOwner && (
          <button
            className="button is-danger"
            type="button"
          >Remove
          </button>
          ) }
        </li>
      </ul>

    </div>

  );
}

export default CollabModal;
