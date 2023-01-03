// @flow
import React from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import Navbar from '../containers/Navbar';
import Footer from '../containers/Footer';
import FeaturedCard from '../containers/FeaturedCard';
import MyTable from '../containers/MyTable';
import ArticleCard from '../containers/ArticleCard';

function Blogs(): Node {
  return (
    <main className="blogs-wrapper">
      <Navbar />
      <section className="category-highlight">
        <div className="category-highlight-text">
          <div className="all-chips">
            <div className="chip highlighted-chip">
              <div className="chip-content">Technology</div>
            </div>
            <div className="chip">
              <div className="chip-content">Science</div>
            </div>
            <div className="chip">
              <div className="chip-content">Business</div>
            </div>
            <div className="chip">
              <div className="chip-content">Chip Content</div>
            </div>
          </div>
          <h4>Category Name</h4>
          <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit</h2>
          <p>Pellentesque laoreet porta lectus sed ornare. Aenean at nisi dui. Mauris dapibus facilisis <br /> viverra. Sed luctus vitae lacus vel dapibus. Mauris nec diam nulla. Mauris fringilla augue <br /> vitae sollicitudin vestibulum.</p>
          <div className="author">
            <h7>John Doe, Jane Doe...</h7><br />
            <h7>Updated Jan 1, 2022</h7>
          </div>
        </div>
      </section>
      <section className="featured">
        <h2>Browse all categories</h2>
        <p>Category name 1</p>
        <p>Category name 2</p>
        <p>Category name 3</p>
        <p>Category name 4</p>
        <p>Category name 5</p>
        <p>Category name 6</p>
        <hr className="featured-divider" />
        <h2>Featured</h2>
        <FeaturedCard />
        <h2>Latest Blog Posts</h2>
        <MyTable />
        <ArticleCard />
      </section>
      <Footer />
    </main>
  );
}

export default Blogs;
