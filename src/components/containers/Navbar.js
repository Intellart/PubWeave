// @flow
import React from 'react';
import type { Node } from 'react';
import { Link } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
import logoImg from '../../images/LogoPubWeave.png';
import 'bulma/css/bulma.min.css';
import BasicMenu from './UserDropdownMenu';
// import { actions } from '../../store/userStore';

type Props = {
  isAuthorized: boolean,
  isAdmin: boolean,
};
function Navbar(props: Props): Node {
  return (

    <nav className='navbar'>
      <div className="search-wrapper">

        <Link to="/"><img src={logoImg} alt="PubWeave Logo" className="nav--logo" width="40px" /></Link>

        <input className="input searchbar" type="text" placeholder="Search" />

        <div className="select filter">
          <select>
            <option>Filter</option>
            <option>Author</option>
          </select>
        </div>
      </div>

      <div className="navigation">
        <Link to="/">Home</Link>
        <Link to="/blogs">Blogs</Link>
        {(props.isAuthorized || props.isAdmin) && <Link to="/Dashboard">Dashboard</Link>}
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
