// @flow
import React from 'react';
import type { Node } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../images/LogoPubWeave.png';
import 'bulma/css/bulma.min.css';
import BasicMenu from './UserDropdownMenu';

function Navbar(): Node {
  const isUserLoggined = () => {
    if (sessionStorage.getItem('token')) {
      return true;
    }

    return false;
  };

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
        <a href="/Dashboard">Dashboard</a>
        <a href="/About">About</a>
        <a href="/About">Contact Us</a>
        <a href="/submit-work" className='submit-work'>Submit your research</a>
        {isUserLoggined() && BasicMenu()}
      </div>
    </nav>
  );
}

export default Navbar;
