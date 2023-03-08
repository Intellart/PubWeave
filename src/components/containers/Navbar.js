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
import 'bulma/css/bulma.min.css';
import BasicMenu from './UserDropdownMenu';
import { useOutsideClickEffect, useScreenSize } from '../../utils/hooks';
// import { actions } from '../../store/userStore';
import { store } from '../../store';
import { actions } from '../../store/userStore';
import { selectors } from '../../store/articleStore';

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

  const { isMobile, isDesktop } = useScreenSize();
  const ref = React.useRef(null);
  const buttonRef = React.useRef(null);

  useOutsideClickEffect(() => setMobileMenuOpen(false), [ref, buttonRef]);

  const userItems = uniqBy(map(articles, (article) => ({
    ...article.user,
    label: article.user.full_name,
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

      return <BasicMenu isAdmin={props.isAdmin} userId={get(props, 'user.id')} userImg={userImage} />;
    } else if (isMobile && (props.isAuthorized || props.isAdmin)) {
      return (
        <>
          <Link onClick={onClick} to={`/user/${get(props, 'user.id')}`}>
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

  const renderSearch = () => (
    <div className="search-wrapper">

      {isDesktop && <Link to="/"><img src={logoImg} alt="PubWeave Logo" className="nav--logo" width="40px" /></Link> }

      <Autocomplete
        disablePortal
        size="small"
        value={searchValue}
        onInputChange={(event, newInputValue) => {
          setSearchValue(newInputValue);
        }}
        className="navbar-search"
        options={options}
        isOptionEqualToValue={(option, value) => option.full_name === value.value}
        onChange={(event, newValue) => {
          if (searchParam === 'article') {
            navigate(`/singleblog/${newValue.id}`);
          } else {
            navigate(`/blogs/user/${newValue.id}`);
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
          {!isMobile && props.isAuthorized && <Link onClick={onClick} to="/submit-work" className='submit-work'>Submit your research</Link>}
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
