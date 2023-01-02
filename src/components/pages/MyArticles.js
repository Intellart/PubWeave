/* eslint-disable no-console */
// @flow
import React, { useEffect } from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { get, map } from 'lodash';
import Navbar from '../containers/Navbar';
import Footer from '../containers/Footer';
import BlogCard from '../containers/BlogCard';

import { actions } from '../../store/articleStore';
import { store } from '../../store';

function MyArticles(): Node {
  store.getState();

  const articles = useSelector((state) => get(state, 'article.articles'));

  const dispatch = useDispatch();
  const fetchAllArticles = () => dispatch(actions.fetchAllArticles());
  const createArticle = () => dispatch(actions.createArticle());

  useEffect(() => {
    fetchAllArticles();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articles]);

  console.log(articles);

  // useEffect(() => {
  //   if (!article || isEmpty(article)) return;
  //   window.location.href = `/submit-work/${article.id}`;
  // }, [article]);

  return (
    <main className="my-articles-wrapper">
      <Navbar />
      <section className="articles">
        <div className="articles-title">
          <h1>My Articles in progress</h1>
          <FontAwesomeIcon
            icon={faPlus}
            onClick={() => createArticle()}
          />
        </div>
        <div className="articles-list">
          {map(articles, (a) => (
            <BlogCard
              id={a.id}
              key={a.id}
              title={a.title}
              category={a.article_content.category}
              description={a.article_content.description}
              author={a.article_content.author}
              tags={a.article_content.tags}
              date={a.date}
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
