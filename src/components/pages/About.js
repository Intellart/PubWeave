// @flow
import React from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import Footer from '../containers/Footer';

function About(): Node {
  return (
    <main className="about-wrapper">
      <section className="about-section" />
      <Footer />
    </main>
  );
}

export default About;
