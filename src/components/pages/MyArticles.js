// @flow
import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  filter, isEqual, map, slice, size,
} from 'lodash';
import { Chip, Pagination } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { selectors as articleSelectors, actions } from '../../store/articleStore';
import { selectors as userSelectors } from '../../store/userStore';
import ArticleCard from '../containers/ArticleCard';
import { useScrollTopEffect } from '../../utils/hooks';
import routes from '../../routes';
import type { Article } from '../../store/articleStore';

function MyArticles(): Node {
  const [lastKnownSize, setLastKnownSize] = useState(-1);
  const navigate = useNavigate();

  const { type } = useParams();

  // const setting = get(workTypes, type, workTypes.articles);

  useScrollTopEffect();
  const articles = useSelector((state) => articleSelectors.getUsersArticles(state), isEqual);
  const user = useSelector((state) => userSelectors.getUser(state), isEqual);

  // console.log(articles);

  useEffect(() => {
    if (lastKnownSize === size(articles) - 1 && size(articles) > 0) {
      navigate(routes.myWork.project(type, articles[size(articles) - 1].id));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articles, lastKnownSize]);

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'collaborating', name: 'Collaborating' },
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
  const deleteArticle = (id: number) => dispatch(actions.deleteArticle(id));
  const convertArticle = (id: number) => dispatch(actions.convertArticle(id));

  const handleCreateArticle = () => {
    createArticle(user.id);
    setLastKnownSize(size(articles));
  };

  const handleDeleteClick = (id: number) => {
    // eslint-disable-next-line no-restricted-globals, no-alert
    if (confirm('Are you sure you want to delete this article?')) {
      deleteArticle(id);
    }
  };

  const handleArticleClick = (article: Article) => {
    if (article.status === 'published') {
      navigate(routes.blogs.blog(article.id));
    } else {
      navigate(routes.myWork.project(type, article.id));
    }
  };

  return (
    <main className="my-articles-wrapper">
      <section className="articles">
        <div className="articles-title">
          <h1>My work</h1>
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
            <React.Fragment key={a.id}>
              <ArticleCard
                article={a}
                showPublishedChip
                onDelete={handleDeleteClick}
                onClick={() => handleArticleClick(a)}
                onConvert={() => {
                  convertArticle(a.id);
                  window.location.reload();
                }}
              />
              <hr />
            </React.Fragment>
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
