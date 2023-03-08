// @flow
import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  filter, isEqual, map, slice, size,
} from 'lodash';
import { Chip, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { selectors as articleSelectors, actions } from '../../store/articleStore';
import { selectors as userSelectors } from '../../store/userStore';
import ArticleCard from '../containers/ArticleCard';
import { useScrollTopEffect } from '../../utils/hooks';

function MyArticles(): Node {
  const [lastKnownSize, setLastKnownSize] = useState(-1);
  const navigate = useNavigate();

  useScrollTopEffect();
  const articles = useSelector((state) => articleSelectors.getUsersArticles(state), isEqual);
  const user = useSelector((state) => userSelectors.getUser(state), isEqual);

  console.log(articles);

  useEffect(() => {
    if (lastKnownSize === size(articles) - 1 && size(articles) > 0) {
      navigate(`/submit-work/${articles[size(articles) - 1].id}`);
    }
  }, [articles, lastKnownSize]);

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'published', name: 'Published' },
    { id: 'requested', name: 'Requested' },
    { id: 'rejected', name: 'Rejected' },
    { id: 'draft', name: 'Draft' },
  ];
  const [statusCategory, setStatusCategory] = useState('all');

  const itemsPerPage = 5;
  const [page, setPage] = React.useState(1);

  const dispatch = useDispatch();
  const createArticle = (userId : number) => dispatch(actions.createArticle(userId));
  const deleteArticle = (id) => dispatch(actions.deleteArticle(id));

  const handleCreateArticle = () => {
    createArticle(user.id);
    setLastKnownSize(size(articles));
  };

  const handleDeleteClick = (id) => {
    // eslint-disable-next-line no-restricted-globals, no-alert
    if (confirm('Are you sure you want to delete this article?')) {
      deleteArticle(id);
    }
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
              onClick={() => {
                setStatusCategory(c.id);
                setPage(1);
              }}
            />
          ))}
        </div>
        <div className="articles-list">
          {map(slice(filter(articles, a => a.status === statusCategory || statusCategory === 'all'), (page - 1) * itemsPerPage, page * itemsPerPage), (a) => (
            <ArticleCard
              key={a.id}
              article={a}
              showPublishedChip
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
        <Pagination
          count={Math.ceil(filter(articles, a => a.status === statusCategory || statusCategory === 'all').length / itemsPerPage)}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '2rem',
            width: '100%',
          }}
          page={page}
          onChange={(e, value) => {
            setPage(value);
          }}
        />
      </section>
      {/* --------------------------------- */}
    </main>
  );
}

export default MyArticles;
