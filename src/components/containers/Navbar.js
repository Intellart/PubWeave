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
  const navigate = useNavigate();

  const [searchParam, setSearchParam] = useState('author');
  const [searchValue, setSearchValue] = useState('');

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
          value={searchValue}
          onInputChange={(event, newInputValue) => {
            setSearchValue(newInputValue);
          }}
          className="navbar-search"
          options={options}
          onChange={(event, newValue) => {
            if (searchParam === 'article') {
              navigate(`/singleblog/${newValue.id}`);
            }
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
          value={searchParam}
          exclusive
          onChange={(event, newParam) => {
            setSearchValue('');
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
        <NavLink to="/About">About</NavLink>
        <NavLink to="/ContactUs">Contact Us</NavLink>
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
