import { get, isEqual, map } from "lodash";
import { useState } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faHistory } from "@fortawesome/free-solid-svg-icons";
import userSelectors from "../../store/user/selectors";

function ActiveUsers() {
  const user = useSelector(userSelectors.getUser, isEqual);

  const users = [
    {
      id: 1,
      name: "John Doe",
      image: get(user, "profile_img"),
      time: "1 hour ago",
    },
    {
      id: 2,
      name: "Jane Doe",
      image: get(user, "profile_img"),
      time: "25 minutes ago",
    },
    {
      id: 3,
      name: "John Doe",
      image: get(user, "profile_img"),
      time: "just now",
    },
  ];

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
      <FontAwesomeIcon icon={faEllipsis} className="ellipsis-icon" />
      <div className="active-users">
        {map(users, (u, i) => (
          <div
            key={u.id}
            className="active-user"
            style={{
              zIndex: i,
              transform: `translateX(${(users.length - i - 1) * 20}px)`,
              opacity: 1 - (users.length - i - 1) * 0.2,
            }}
          >
            <img src={u.image} alt={`Avatar of ${u.name}`} />
          </div>
        ))}
      </div>
      {openModal && (
        <div className="active-users-modal">
          {map(users, (u) => (
            <div key={u.id} className="modal-active-user">
              <img
                className="modal-active-user-img"
                src={u.image}
                alt={`Avatar of ${u.name}`}
              />
              <div className="modal-active-user-name">{u.name}</div>
              <div className="modal-active-user-time">{u.time}</div>
              <FontAwesomeIcon icon={faHistory} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ActiveUsers;
