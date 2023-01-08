// @flow
import React from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import Navbar from '../containers/Navbar';
import Footer from '../containers/Footer';
import StartEditButtonGrid from '../containers/MyDataGrid';

function About(): Node {
  return (
    <main className="about-wrapper">
      <Navbar />
      <section className="about-section">
        <StartEditButtonGrid />
      </section>
      <Footer />
    </main>
  );
}

export default About;
