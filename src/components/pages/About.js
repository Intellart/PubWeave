// @flow
import React from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import Footer from '../containers/Footer';
import CommentModal from '../containers/CommentModal';

function About(): Node {
  return (
    <main className="about-wrapper">
      <section className="about-section">
        <CommentModal />
      </section>
      <Footer />
    </main>
  );
}

export default About;
