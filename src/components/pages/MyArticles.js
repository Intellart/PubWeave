// @flow
import React, { useState } from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { filter, isEqual, map } from 'lodash';
import { Chip } from '@mui/material';
import Footer from '../containers/Footer';
import { selectors as articleSelectors, actions } from '../../store/articleStore';
import { selectors as userSelectors } from '../../store/userStore';
import ArticleCard from '../containers/ArticleCard';

function MyArticles(): Node {
  const articles = useSelector((state) => articleSelectors.getUsersArticles(state), isEqual);
  const user = useSelector((state) => userSelectors.getUser(state), isEqual);

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'published', name: 'Published' },
    { id: 'requested', name: 'Requested' },
    { id: 'rejected', name: 'Rejected' },
    { id: 'draft', name: 'Draft' },
  ];
  const [statusCategory, setStatusCategory] = useState('all');

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
          <h1>My Articles</h1>
          <FontAwesomeIcon
            className="add-article-icon"
            icon={faPlus}
            onClick={() => handleCreateArticle()}
          />
        </div>
        <div className="articles-filter">
          {map(categories, (c) => (
            <Chip
              key={c.id}
              label={`${c.name} (${filter(articles, a => (c.id !== 'all' ? a.status === c.id : true)).length})`}
              variant={statusCategory === c.id ? 'default' : 'outlined'}
              onClick={() => setStatusCategory(c.id)}
            />
          ))}
        </div>
        <div className="articles-list">
          {map(filter(articles, a => a.status === statusCategory || statusCategory === 'all'), (a) => (
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
