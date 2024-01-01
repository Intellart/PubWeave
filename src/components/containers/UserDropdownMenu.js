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
  userImg?: string,
};

export default function UserDropdownMenu(props: Props): Node {
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
    navigate('/user');
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
        {props.userImg ? (
          <img
            className='navbar-user-icon'
            src={props.userImg}
            alt='user'
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
            }}
          />
        ) : (
          <FontAwesomeIcon
            className='navbar-user-icon'
            icon={props.isAdmin ? faLock : faUserCircle}
            style={{
              fontSize: '2rem',
              width: '2rem',
              height: '2rem',
            }}
          />
        )
        }
      </div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: '#1a1a1a',
            color: 'white',
            borderRadius: '10px',
            boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
            marginTop: '0.5rem',
          },
          '& .MuiMenuItem-root': {
            fontSize: '1.2rem',
            padding: '0.5rem 1rem',
            '&:hover': {
              backgroundColor: '#2a2a2a',
            },
          },
          '& .Mui-disabled': {
            color: '#2a2a2a',
          },
        }}
      >
        {props.isAdmin && <MenuItem disabled>ADMIN</MenuItem> }
        <MenuItem onClick={handleProfile}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
