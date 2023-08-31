// @flow
import { map, size } from 'lodash';
import React from 'react';

type CollabModalProps = {
    collaborators: any,
    isOwner: boolean,
};

function CollabModal ({ isOwner, collaborators }: CollabModalProps): any {
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
        {map(collaborators, (collaborator) => (
          <li className="collaborator">
            <p className="collaborator-name">{collaborator.name}</p>
            {isOwner && (
            <button
              className="button is-danger"
              type="button"
            >Remove
            </button>
            ) }
          </li>
        ))}

      </ul>
      {size(collaborators) === 0 && (
      <p className="no-collaborators">No collaborators yet</p>
      )}

    </div>

  );
}

export default CollabModal;
