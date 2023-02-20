// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import { Link } from 'react-router-dom';

function Footer(): Node {
  return (
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
          <Link
            to='#'
            onClick={(e) => {
              window.location.href = 'info@intellart.ca';
              e.preventDefault();
            }}
          >
            <p>info@intellart.ca</p>
          </Link>
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
  );
}

export default Footer;
