// @flow
import {
  includes, map, size, trim,
} from 'lodash';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { actions } from '../../store/articleStore';

type CollabModalProps = {
    articleId: number,
    collaborators: any,
    isOwner: boolean,
};

function CollabModal ({ isOwner, collaborators, articleId }: CollabModalProps): any {
  const dispatch = useDispatch();

  const addCollaborator = (email: string) => dispatch(actions.addCollaborator(articleId, email));

  const [collaboratorEmail, setCollaboratorEmail] = useState('');

  const handleAddColab = () => {
    if (includes(map(collaborators, 'email'), trim(collaboratorEmail))) {
      toast.error('User already added.');
      setCollaboratorEmail('');

      return;
    }
    addCollaborator(collaboratorEmail);
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
