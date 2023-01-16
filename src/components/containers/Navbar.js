// @flow
import React, { useState } from 'react';
import type { Node } from 'react';
import { Link, NavLink } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
  get, isEqual, map, sortBy, uniqBy,
} from 'lodash';
import {
  Autocomplete, TextField, ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faScroll, faUser } from '@fortawesome/free-solid-svg-icons';
import logoImg from '../../images/LogoPubWeave.png';
import 'bulma/css/bulma.min.css';
import BasicMenu from './UserDropdownMenu';
// import { actions } from '../../store/userStore';

type Props = {
  isAuthorized: boolean,
  isAdmin: boolean,
};
function Navbar(props: Props): Node {
  const articles = useSelector((state) => get(state, 'article.allArticles'), isEqual);

  const [searchParam, setSearchParam] = useState('author');

  const userItems = uniqBy(map(articles, (article) => ({
    ...article.user,
    label: article.user.full_name,
  })), 'id');

  const articleItems = sortBy(map(articles, (article) => ({
    ...article,
    label: article.title,
  })), 'category');

  const options = searchParam === 'author' ? userItems : articleItems;

  return (

    <nav className='navbar'>
      <div className="search-wrapper">

        <Link to="/"><img src={logoImg} alt="PubWeave Logo" className="nav--logo" width="40px" /></Link>

        <Autocomplete
          disablePortal
          className="navbar-search"
          options={options}
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
              label="Search Article"
            />
          )}
        />

        <ToggleButtonGroup
          value={searchParam}
          exclusive
          onChange={(event, newParam) => {
            setSearchParam(newParam);
          }}
          aria-label="text alignment"
        >
          <ToggleButton value="author">
            <FontAwesomeIcon icon={faUser} />
          </ToggleButton>
          <ToggleButton value="article">
            <FontAwesomeIcon icon={faScroll} />
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

      <div className="navigation">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/blogs">Blogs </NavLink>
        {(props.isAuthorized || props.isAdmin) && <NavLink to="/Dashboard">Dashboard</NavLink>}
        <Link to="/About">About</Link>
        <Link to="/About">Contact Us</Link>
        {props.isAuthorized && <Link to="/submit-work" className='submit-work'>Submit your research</Link>}
        {(props.isAuthorized || props.isAdmin)
          ? (<BasicMenu />)
          : (
            <Link
              className="login-button"
              to="/login"
            >Login
            </Link>
          ) }
      </div>
    </nav>
  );
}

export default Navbar;
