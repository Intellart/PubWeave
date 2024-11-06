// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
import type { Node } from 'react';
import { Link } from 'react-router-dom';

function Footer(): Node {
  return (
    <footer className="footer-pubweave">
      <div className="footer-details">
        <div className="social-networks">
          <h3>Social</h3>
          <div className="icons-social">
            <Link
              to='#'
              onClick={(e) => {
                window.location.href = '#';
                e.preventDefault();
              }}
            >
              <FontAwesomeIcon icon={faTwitter} />
            </Link>
            <Link
              to='#'
              onClick={(e) => {
                window.location.href = '#';
                e.preventDefault();
              }}
            >
              <FontAwesomeIcon icon={faGithub} />
            </Link>
            <Link
              to='#'
              onClick={(e) => {
                window.location.href = '#';
                e.preventDefault();
              }}
            >
              <FontAwesomeIcon icon={faDiscord} />
            </Link>
          </div>
        </div>
        <div className="contact-details">
          <h3>Contact</h3>
          <Link
            to='#'
            onClick={(e) => {
              window.location.href = 'mailto:info@intellart.ca';
              e.preventDefault();
            }}
          >
            <p>info@intellart.ca</p>
          </Link>
        </div>
        <div className="navigation">
          <h3>Navigation</h3>
          <Link
            to='/'
          >
            <p>Home</p>
          </Link>
          <Link
            to='/blogs'
          >
            <p>Blogs</p>
          </Link>
        </div>
      </div>
      <hr className="solid" />
      <div className="copyrights-termsofuse">
        <p>© 2024 Intellart. All rights reserved.</p>
        <p>
          <Link
            to="#"
            onClick={(e) => {
              window.location.href = 'https://veritheum.intellart.ca/terms-of-use';
              e.preventDefault();
            }}
          >
            Terms of Use
          </Link>
          &nbsp; |&nbsp;
          <Link
            to="#"
            onClick={(e) => {
              window.location.href = 'https://veritheum.intellart.ca/cookie-policy';
              e.preventDefault();
            }}
          >
            Cookie Policy
          </Link>
          &nbsp; |&nbsp;
          <Link
            to="#"
            onClick={(e) => {
              window.location.href = 'https://veritheum.intellart.ca/privacy-policy';
              e.preventDefault();
            }}
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
