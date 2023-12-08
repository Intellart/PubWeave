// @flow
import React from 'react';
import type { Node } from 'react';
import { Link } from 'react-router-dom';
import chatDialoge from '../../images/chatdialoge.png';
import AboutImg from '../../images/About.png';
import TeamImg from '../../images/Teamwork.png';
import stars from '../../images/stars.png';
import MuiTimeline from '../containers/MuiTimeline';
import MultipleObserver, { useScrollTopEffect } from '../../utils/hooks';

function Home(): Node {
  useScrollTopEffect();
  const [currentSection, setCurrentSection] = React.useState('Home');

  return (
    <main className="home-wrapper">
      <MuiTimeline
        sections={['Home', 'About', 'Pricing']}
        activeSection={currentSection}
      />
      <MultipleObserver
        onView={() => {
          setCurrentSection('Home');
        }}
      >
        <section className="hero-section">
          <div className="hero-section-row">
            <div className="hero-section-left">
              <h1>Your proof  of Science </h1>
              <h4>Fast, reliable & unlimited scientific projects.</h4>
              <div className="hero-section-left-buttons">
                <Link to="/blogs"><button className='explore'>Explore</button></Link>
                <button
                  onClick={() => {
                    document.getElementsByClassName('team-section')[0].scrollIntoView({
                      behavior: 'smooth',
                    });
                  }}
                  className='our-mission'
                >Our Mission
                </button>
              </div>
            </div>
            <img
              src={chatDialoge}
              className="hero-section-right"
              alt="chatDialoge"
            />
          </div>
          <div
            className="arrow-down"
            onClick={() => {
              window.scrollTo({
                top: window.innerHeight,
                left: 0,
                behavior: 'smooth',
              });
            }}
          />
        </section>
      </MultipleObserver>
      <MultipleObserver
        onView={() => {
          setCurrentSection('About');
        }}
      >
        <section className="about-section">
          <div className="about-paragraph-img">
            <div className="about-paragraph">
              <h3>About Us</h3>
              <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. <br /> Aenean commodo ligula eget dolor.  Aenean massa. <br /> Cum sociis natoque penatibus et magnis dis parturient montes, <br /> nascetur ridiculus mus. Donec quam felis, ultricies nec, <br /> pellentesque eu, pretium quis, sem. Nulla consequat massa</p>
            </div>
            <img
              src={AboutImg}
              className="about-img"
              alt="aboutImage"
            />
          </div>
        </section>
      </MultipleObserver>
      {/* ---------------------------- */}
      <MultipleObserver
        onView={() => {
          setCurrentSection('Pricing');
        }}
      >
        <section className="team-section">
          <div className="team-punchline-cta-buttons">
            <img src={TeamImg} className="team-img" alt="Teamwork" />
            <div className="team-punchline">
              <h1>Perfect Solution <br />  to Monetize <br /> Scientific Work</h1>
              <h4>Pricing plans that fit like a glove.</h4>
              <div className="team-cta-buttons">
                <Link
                  className='submit-work'
                  to="/blogs"
                >
                  Submit Work
                </Link>
                <Link
                  className='more-info'
                  to="/blogs"
                >
                  More Info
                </Link>
              </div>
              <hr className="divider" />
              <div className="stars-text">
                <img
                  src={stars}
                  className="stars"
                  alt="five-stars"
                />
                <h4><strong>5,600 scientists</strong> trust PubWeave <br /> and they rate it as <strong>5-stars.</strong></h4>
              </div>
            </div>
          </div>
        </section>
      </MultipleObserver>
      {/* --------------------------------- */}
    </main>
  );
}

export default Home;
