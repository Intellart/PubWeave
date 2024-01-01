// @flow
import React, { useState } from 'react';
import type { Node } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
  get, isEqual, map, sortBy, uniqBy,
} from 'lodash';
import {
  Autocomplete, TextField, ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faScroll, faUser } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import logoImg from '../../assets/images/pubweave_logo.png';
import { useOutsideClickEffect, useScreenSize } from '../../utils/hooks';
// import { actions } from '../../store/userStore';
import { store } from '../../store';
import { actions } from '../../store/userStore';
import { selectors } from '../../store/articleStore';
import routes from '../../routes';
import UserDropdownMenu from '../containers/UserDropdownMenu';

type Props = {
  isAuthorized: boolean,
  isAdmin: boolean,
  user?: any,
};
function Navbar(props: Props): Node {
  const articles = useSelector((state) => selectors.getPublishedArticles(state), isEqual);

  const navigate = useNavigate();

  const [searchParam, setSearchParam] = useState('article');
  const [searchValue, setSearchValue] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { isMobile } = useScreenSize();
  const ref = React.useRef<HTMLDivElement | null>(null);
  const buttonRef = React.useRef<HTMLDivElement | null>(null);

  useOutsideClickEffect(() => setMobileMenuOpen(false), [ref, buttonRef]);

  const userItems = uniqBy(map(articles, (article) => ({
    ...article.author,
    label: article.author.full_name,
  })), 'id');

  const articleItems = sortBy(map(articles, (article) => ({
    ...article,
    label: article.title,
  })), 'category');

  const options = searchParam === 'author' ? userItems : articleItems;

  const onClick = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const renderLoginButton = () => {
    if (!isMobile && (props.isAuthorized || props.isAdmin)) {
      const userImage = get(props, 'user.profile_img');

      return <UserDropdownMenu isAdmin={props.isAdmin} userId={get(props, 'user.id')} userImg={userImage} />;
    } else if (isMobile && (props.isAuthorized || props.isAdmin)) {
      return (
        <>
          <Link onClick={onClick} to="/user">
            Profile
          </Link>
          <Link
            to="/home"
            onClick={() => {
              store.dispatch(actions.logoutUser());
              onClick();
            }}
          >
            Logout
          </Link>
        </>
      );
    } else {
      return (
        <Link
          onClick={onClick}
          className="login-button"
          to="/login"
        >Login
        </Link>
      );
    }
  };

  const searchOptions = map(options, (option) => ({
    label: option.label,
    value: option.id,
  }));

  const renderSearch = () => (
    <div className="search-wrapper">

      {!isMobile
      && <Link to="/"><img src={logoImg} alt="PubWeave Logo" className="nav--logo" width="40px" /></Link>}

      <Autocomplete
        disablePortal
        size="small"
        value={searchValue}
        // onInputChange={(event, newInputValue) => {
        //   setSearchValue('2');
        // }}
        className="navbar-search"
        options={searchOptions}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        onChange={(event, newValue) => {
          if (!newValue || !newValue.value) {
            return;
          }
          if (searchParam === 'article') {
            navigate(`/singleblog/${newValue.value}`);
          } else {
            navigate(`/users/${newValue.value}`);
          }

          setSearchValue('');
        }}
        groupBy={(option) => option.category}
        sx={{
          width: 300,
        }}
        // renderOption={(p, option) => (
        //   <div
        //     key={option.id}
        //     className="navbar-search-option"
        //   >
        //     {option.label}
        //   </div>
        // )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={searchParam === 'author' ? 'Search Authors' : 'Search Articles'}
          />
        )}
      />

      <ToggleButtonGroup
        className="search-type"
        value={searchParam}
        exclusive
        onChange={(event, newParam) => {
          setSearchValue('');
          setSearchParam(newParam);
        }}
        aria-label="text alignment"
      >
        <ToggleButton
          className='search-type-button'
          value="author"
        >
          <FontAwesomeIcon className='search-type-button-icon' icon={faUser} />
        </ToggleButton>
        <ToggleButton
          className='search-type-button'
          value="article"
        >
          <FontAwesomeIcon className='search-type-button-icon' icon={faScroll} />
        </ToggleButton>
      </ToggleButtonGroup>

      {/* <input className="input searchbar" type="text" placeholder="Search" /> */}

      {/* <div className="select filter">
        <select>
          <option>Filter</option>
          <option>Author</option>
        </select>
      </div> */}
    </div>
  );

  return (
    <>
      <nav className='navbar'>
        {!isMobile && renderSearch()}

        <div className="navigation">
          <NavLink onClick={onClick} to="/">Home</NavLink>
          <NavLink onClick={onClick} to="/blogs">Blogs </NavLink>
          {(props.isAdmin) && <NavLink onClick={onClick} to="/Dashboard">Dashboard</NavLink>}
          {/* <NavLink onClick={onClick} to="/About">About</NavLink>
          <NavLink onClick={onClick} to="/ContactUs">Contact Us</NavLink> */}
          {!isMobile && props.isAuthorized && <Link onClick={onClick} to={routes.myWork.root} className='submit-work'>My Work</Link>}
          {!isMobile && renderLoginButton()}
          {isMobile && (
          <div ref={buttonRef} className="mobile-burger">
            <FontAwesomeIcon
              className={classNames('burger-icon', { 'burger-icon-open': mobileMenuOpen })}
              icon={faBars}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
          </div>
          )}

        </div>
      </nav>
      {isMobile && (
      <>
        <div className={classNames('navbar-mobile-menu-overlay', { 'mobile-menu-open': mobileMenuOpen })} onClick={() => setMobileMenuOpen(false)} />
        <div ref={ref} className={classNames('navbar-mobile-menu', { 'mobile-menu-open': mobileMenuOpen })}>
          <div className="mobile-menu-items">
            {renderSearch()}
            <hr />
            <div className="mobile-menu-items-buttons">
              {props.isAuthorized && <Link onClick={onClick} to="/submit-work" className='submit-work'>Submit your research</Link>}
              {renderLoginButton()}
            </div>
          </div>
        </div>
      </>
      )}
    </>
  );
}

export default Navbar;
