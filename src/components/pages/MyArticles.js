/* eslint-disable no-console */
// @flow
import React, { useEffect } from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import Navbar from '../containers/Navbar';
import Footer from '../containers/Footer';
import BlogCard from '../containers/BlogCard';

import * as API from '../../api';

function MyArticles(): Node {
  const [myArticles, setMyArticles] = React.useState([]);

  async function fetchArticles () {
    const response = await API.getRequest('blog_articles');
    setMyArticles(response);
  }

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <main className="my-articles-wrapper">
      <Navbar />
      <section className="articles">
        <div className="articles-title">
          <h1>My Articles</h1>
        </div>
        <div className="articles-list">
          {myArticles.map((article) => (
            <BlogCard
              id={article.id}
              key={article.id}
              title={article.title}
              category={article.category}
              description={article.description}
              author={article.author}
              date={article.date}
            />
          ))}
        </div>
      </section>
      {/* --------------------------------- */}
      <Footer />
    </main>
  );
}

export default MyArticles;
