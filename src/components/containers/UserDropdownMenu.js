import React, { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { store } from '../../store';
import { actions } from '../../store/userStore';

type Props = {
  isAdmin: boolean,
  userId?: number,
};

export default function BasicMenu(props: Props): Node {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    setAnchorEl(null);
    navigate(`/user/${props.userId}`);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    store.dispatch(actions.logoutUser());
  };

  return (
    <div>
      <div
        className='navbar-user'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <FontAwesomeIcon
          className='navbar-user-icon'
          icon={props.isAdmin ? faLock : faUserCircle}
          style={{
            fontSize: '2rem',
            width: '2rem',
            height: '2rem',
          }}
        />
      </div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {props.isAdmin && <MenuItem disabled>ADMIN</MenuItem> }
        <MenuItem onClick={handleProfile}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
