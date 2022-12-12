// @flow
import React from 'react';
import type { Node } from 'react';
import logoImg from '../../images/LogoPubWeave.png';
import 'bulma/css/bulma.min.css';
import chatDialoge from '../../images/chatdialoge.png';

function Home(): Node {
  return (
    <main className="home-wrapper">
      <nav className='navbar'>
        <div className="search-wrapper">

          <img src={logoImg} alt="PubWeave Logo" className="nav--logo" width="40px" />

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

      <section className="hero-section">
        <div className="punchline-cta-buttons">
          <div className="punchline">
            <h1>Your proof  <br />  of Science </h1>
            <h4>Fast, reliable & unlimited scientific projects.</h4>
            <div className="cta-buttons">
              <button className='explore'>Explore</button>
              <button className='our-mission'>Our Mission</button>
            </div>
          </div>
          <img src={chatDialoge} className="chat-dialoge" alt="chatDialoge" />
        </div>
        <div className="arrow-down"> </div>
      </section>
    </main>
  );
}

export default Home;
