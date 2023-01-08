// @flow
import React from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import Navbar from '../containers/Navbar';
import Footer from '../containers/Footer';
import StartEditButtonGrid from '../containers/MyDataGrid';
import CommentModal from '../containers/CommentModal';

function About(): Node {
  return (
    <main className="about-wrapper">
      <Navbar />
      <section className="about-section">
        <StartEditButtonGrid />
        <CommentModal />
      </section>
      <Footer />
    </main>
  );
}

export default About;
