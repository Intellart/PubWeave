// @flow
import React from 'react';
import type { Node } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../images/LogoPubWeave.png';
import 'bulma/css/bulma.min.css';

function Navbar(): Node {
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
        <a href="/About">About</a>
        <a href="/About">Contact Us</a>
        <button className='submit-work'>Submit your research</button>
      </div>
    </nav>
  );
}

export default Navbar;
