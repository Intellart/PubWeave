import { map } from 'lodash';
import React, { useState } from 'react';

type Props = {
  users: Array<Object>,
};

function ActiveUsers(props: Props) {
  const { users } = props;

  const [openModal, setOpenModal] = useState(false);

  return (
    <div
      className="active-users-wrapper"
      onClick={(e) => {
        e.stopPropagation();
        setOpenModal(!openModal);
      }}
    >
      <div key={users[0].id} className="active-user main-user">
        <img src={users[0].image} alt={`Avatar of ${users[0].name}`} />
      </div>
      <div className="active-users">
        {map(users, (user) => (
          <div key={user.id} className="active-user">
            <img src={user.image} alt={`Avatar of ${user.name}`} />
          </div>
        ))}
      </div>
      {openModal && (
        <div className="active-users-modal">
          <div className="active-users-modal-header">
            <div className="active-users-modal-title">Active users</div>
            <div
              className="active-users-modal-close"
              onClick={() => setOpenModal(false)}
            >
              <i className="fas fa-times" />
            </div>
          </div>
          <div className="active-users-modal-body">
            {map(users, (user) => (
              <div key={user.id} className="active-user">
                <img src={user.image} alt={`Avatar of ${user.name}`} />
                <div className="active-user-name">{user.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ActiveUsers;
