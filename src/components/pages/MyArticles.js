/* eslint-disable no-console */
// @flow
import React, { useEffect } from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { get, isEmpty } from 'lodash';
import Navbar from '../containers/Navbar';
import Footer from '../containers/Footer';
import BlogCard from '../containers/BlogCard';

import { actions } from '../../store/articleStore';

import * as API from '../../api';
import { store } from '../../store';

function MyArticles(): Node {
  const [myArticles, setMyArticles] = React.useState([]);

  store.getState();

  const article = useSelector((state) => get(state, 'article'));

  const dispatch = useDispatch();
  const createArticle = () => dispatch(actions.createArticle());

  async function fetchArticles () {
    const response = await API.getRequest('blog_articles');
    setMyArticles(response);
  }

  useEffect(() => {
    fetchArticles();
  }, []);

  console.log(myArticles);

  useEffect(() => {
    if (!article || isEmpty(article)) return;
    window.location.href = `/submit-work/${article.id}`;
  }, [article]);

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
          {myArticles.map((a) => (
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
