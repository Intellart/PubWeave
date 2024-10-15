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
  Autocomplete, Button, TextField, ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faScroll, faUser } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { useCardano } from '@cardano-foundation/cardano-connect-with-wallet';
import { NetworkType } from '@cardano-foundation/cardano-connect-with-wallet-core';
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
  const {
    disconnect,
  } = useCardano({
    limitNetwork: NetworkType.TESTNET,
  });

  const articles = useSelector((state) => selectors.getPublishedArticles(state), isEqual);

  const navigate = useNavigate();

  const searchType = {
    ARTICLE: 'article',
    AUTHOR: 'author',
  };

  const [searchParams, setSearchParams] = useState({
    type: searchType.ARTICLE,
    input: '',
    value: null,
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { isMobile } = useScreenSize();
  const ref = React.useRef<HTMLDivElement | null>(null);
  const buttonRef = React.useRef<HTMLDivElement | null>(null);

  useOutsideClickEffect(() => setMobileMenuOpen(false), [ref, buttonRef]);

  const userItems = uniqBy(map(articles, (article) => ({
    value: article.author.id,
    label: article.author.full_name,
  })), 'id');

  const articleItems = sortBy(map(articles, (article) => ({
    value: article.id,
    label: article.title,
    category: article.category,
  })), 'category');

  const options = {
    article: articleItems,
    author: userItems,
  }[searchParams.type];

  const handleClick = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const renderLoginButton = () => {
    if (!isMobile && (props.isAuthorized || props.isAdmin)) {
      const userImage = get(props, 'user.profile_img');

      return (
        <UserDropdownMenu
          isAdmin={props.isAdmin}
          userId={get(props, 'user.id')}
          userImg={userImage}
          onLogout={() => {
            disconnect();
            store.dispatch(actions.logoutUser());
          }}
        />
      );
    } else if (isMobile && (props.isAuthorized || props.isAdmin)) {
      return (
        <>
          <Link onClick={handleClick} to="/user">
            Profile
          </Link>
          <Link
            to="/home"
            onClick={() => {
              disconnect();
              store.dispatch(actions.logoutUser());
              handleClick();
            }}
          >
            Logout
          </Link>
        </>
      );
    } else {
      return (
        <Link
          onClick={handleClick}
          className="login-button"
          to="/login"
        >Login
        </Link>
      );
    }
  };

  const renderSearch = () => (
    <div className="search-wrapper">

      {!isMobile
      && <Link to="/"><img src={logoImg} alt="PubWeave Logo" className="nav--logo" width="40px" /></Link>}

      <Autocomplete
        disablePortal
        size="small"
        inputValue={searchParams.input}
        onInputChange={(event, newInputValue) => {
          setSearchParams({ ...searchParams, input: newInputValue });
        }}
        value={searchParams.value || null}
        className="navbar-search"
        options={options}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        onChange={(event, newValue) => {
          if (!newValue || !newValue.value) {
            return;
          }

          navigate({
            [searchType.ARTICLE]: `/singleblog/${newValue.value}`,
            [searchType.AUTHOR]: `/users/${newValue.value}`,
          }[searchParams.type]);

          setSearchParams({
            ...searchParams,
            input: '',
            value: newValue,
          });
        }}
        getOptionKey={(option) => option.value}
        groupBy={(option) => (searchType.ARTICLE ? option.category : '')}
        sx={{
          width: 300,
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={searchParams.type === searchType.AUTHOR ? 'Search Authors' : 'Search Articles'}
          />
        )}
      />

      <ToggleButtonGroup
        className="search-type"
        value={searchParams.type}
        exclusive
        onChange={(event, newParam) => {
          if (!newParam) return;
          setSearchParams({
            input: '',
            type: newParam,
            value: null,
          });
        }}
        aria-label="text alignment"
      >
        <ToggleButton
          className='search-type-button'
          value={searchType.AUTHOR}
        >
          <FontAwesomeIcon className='search-type-button-icon' icon={faUser} />
        </ToggleButton>
        <ToggleButton
          className='search-type-button'
          value={searchType.ARTICLE}
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
          <NavLink onClick={handleClick} to="/">Home</NavLink>
          <NavLink onClick={handleClick} to="/blogs">Blogs </NavLink>
          {(props.isAdmin) && <NavLink onClick={handleClick} to="/Dashboard">Dashboard</NavLink>}
          {/* <NavLink onClick={onClick} to="/About">About</NavLink>
          <NavLink onClick={onClick} to="/ContactUs">Contact Us</NavLink> */}
          {!isMobile && props.isAuthorized
          && (
          <Button
            variant="contained"
            onClick={() => {
              handleClick();
              navigate(routes.myWork.root);
            }}
          >
            My Work
          </Button>
          )}
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
              {props.isAuthorized && <Link onClick={handleClick} to="/submit-work" className='submit-work'>Submit your research</Link>}
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
