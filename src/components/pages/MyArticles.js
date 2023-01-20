/* eslint-disable no-console */
// @flow
import React from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { isEqual, map } from 'lodash';
import Footer from '../containers/Footer';
import { selectors as articleSelectors, actions } from '../../store/articleStore';
import { selectors as userSelectors } from '../../store/userStore';
import ArticleCard from '../containers/ArticleCard';

function MyArticles(): Node {
  const articles = useSelector((state) => articleSelectors.getUsersArticles(state), isEqual);
  const user = useSelector((state) => userSelectors.getUser(state), isEqual);

  const dispatch = useDispatch();
  const createArticle = (userId : number) => dispatch(actions.createArticle(userId));
  const deleteArticle = (id) => dispatch(actions.deleteArticle(id));

  const handleCreateArticle = () => {
    createArticle(user.id);
  };

  const handleDeleteClick = (id) => {
    deleteArticle(id);
  };

  return (
    <main className="my-articles-wrapper">
      <section className="articles">
        <div className="articles-title">
          <h1>My Articles in progress</h1>
          <FontAwesomeIcon
            icon={faPlus}
            onClick={() => handleCreateArticle()}
          />
        </div>
        <div className="articles-list">
          {map(articles, (a) => (
            <ArticleCard
              key={a.id}
              article={a}
              showPublishedChip
              onDelete={handleDeleteClick}
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
