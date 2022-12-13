// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
import type { Node } from 'react';
import logoImg from '../../images/LogoPubWeave.png';
import 'bulma/css/bulma.min.css';
import chatDialoge from '../../images/chatdialoge.png';
import AboutImg from '../../images/About.png';
import TeamImg from '../../images/Teamwork.png';
import stars from '../../images/stars.png';

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
      <section className="about-section">
        <div className="about-paragraph-img">
          <div className="about-paragraph">
            <h3>About Us</h3>
            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. <br /> Aenean commodo ligula eget dolor.  Aenean massa. <br /> Cum sociis natoque penatibus et magnis dis parturient montes, <br /> nascetur ridiculus mus. Donec quam felis, ultricies nec, <br /> pellentesque eu, pretium quis, sem. Nulla consequat massa</p>
          </div>
          <img src={AboutImg} className="about-img" alt="aboutImage" />
        </div>
      </section>
      {/* ---------------------------- */}
      <section className="team-section">
        <div className="team-punchline-cta-buttons">
          <img src={TeamImg} className="team-img" alt="Teamwork" />
          <div className="team-punchline">
            <h1>Perfect Solution <br />  to Monetize <br /> Scientific Work</h1>
            <h4>Pricing plans that fit like a glove.</h4>
            <div className="team-cta-buttons">
              <button className='submit-work'>Submit Work</button>
              <button className='more-info'>More Info</button>
            </div>
            <hr className="divider" />
            <div className="stars-text">
              <img src={stars} className="stars" alt="five-stars" />
              <h4><strong>5,600 scientists</strong> trust PubWeave <br /> and they rate it as <strong>5-stars.</strong></h4>
            </div>
          </div>
        </div>
      </section>
      {/* --------------------------------- */}
      <footer className="footer-pubweave">
        <div className="footer-details">
          <div className="social-networks">
            <h3>Social</h3>
            <div className="icons-social">
              <FontAwesomeIcon icon={faTwitter} />
              <FontAwesomeIcon icon={faGithub} />
              <FontAwesomeIcon icon={faDiscord} />
            </div>
          </div>
          <div className="contact-details">
            <h3>Contact</h3>
            <p>info@intellart.ca</p>
          </div>
          <div className="navigation">
            <h3>Navigation</h3>
            <p>Home</p>
            <p>About Us</p>
          </div>
        </div>
        <hr className="solid" />
        <div className="copyrights-termsofuse">
          <p>© 2022 Intellart. All rights reserved.</p>
          <p>Terms of Use | Cookie policy | Privacy policy</p>
        </div>
      </footer>
    </main>
  );
}

export default Home;
