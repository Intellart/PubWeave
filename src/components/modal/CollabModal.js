// @flow
import {
  includes, map, size, trim,
} from 'lodash';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

type CollabModalProps = {
    collaborators: any,
    isOwner: boolean,
    addCollaborator: any
};

function CollabModal ({ isOwner, collaborators, addCollaborator }: CollabModalProps): any {
  const [collaboratorEmail, setCollaboratorEmail] = useState('');

  const handleAddColab = () => {
    if (includes(map(collaborators, 'email'), trim(collaboratorEmail))) {
      toast.error('User already added.');
      setCollaboratorEmail('');
    } else {
      addCollaborator(collaboratorEmail);
      setCollaboratorEmail('');
    }
  };

  console.log(collaborators);

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
          <input
            value={collaboratorEmail}
            onChange={(e) => setCollaboratorEmail(e.target.value)}
            className="input"
            type="email"
            placeholder="e.g."
          />
          <button
            className="button is-primary"
            type="button"
            onClick={handleAddColab}
          >Add
          </button>
        </div>
      </div>
      <ul className="collaborators">
        {map(collaborators, (collaborator) => (
          <li className="collaborator" key={collaborator.id}>
            <p className="collaborator-name">{collaborator.full_name}</p>
            <p className="collaborator-name">{collaborator.email}</p>
            {isOwner && (
            <button
              disabled
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
