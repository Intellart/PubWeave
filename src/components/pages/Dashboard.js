// @flow
import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  get, isEqual, map,
} from 'lodash';
import {
  faCheck, faPaperPlane, faRotateRight, faXmark,
} from '@fortawesome/free-solid-svg-icons';
import Footer from '../containers/Footer';
import MyDataGrid from '../containers/MyDataGrid';

import { actions } from '../../store/articleStore';

export const statuses = {
  published: {
    value: 'published',
    label: 'Published',
    color: 'primary',
    icon: faCheck,
  },
  requested: {
    value: 'requested',
    label: 'Requested',
    color: 'warning',
    icon: faRotateRight,
  },
  rejected: {
    value: 'rejected',
    label: 'Rejected',
    color: 'error',
    icon: faXmark,
  },
  draft: {
    value: 'draft',
    label: 'Draft',
    color: 'info',
    icon: faPaperPlane,
  },

};

function Dashboard(): Node {
  const articles = useSelector((state) => get(state, 'article.allArticles'), isEqual);

  const dispatch = useDispatch();
  const fetchAllArticles = () => dispatch(actions.fetchAllArticles());
  const deleteArticle = (id) => dispatch(actions.deleteArticle(id));
  const publishArticle = (articleId, status) => dispatch(actions.publishArticle(articleId, status));
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!articles) {
      fetchAllArticles();
    } else {
      setRows(map(articles, (article) => ({
        id: article.id,
        title: article.title,
        status: get(statuses, get(article, 'status', 'draft')),
        firstName: get(article, 'author.firstName', ''),
        email: '',
        ORCID: '123456789',
        registeredOn: '2023-01-25T16:57',
      })));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articles]);

  const onDeleteClick = (id) => {
    deleteArticle(id);
  };

  const handleChangeStatus = (id, newStatus) => {
    // console.log(`Publishing article ${id} with status ${newStatus}`, find(articles, { id }));
    publishArticle(id, newStatus);
  };

  return (
    <main className="about-wrapper">
      <section className="about-section">
        <MyDataGrid
          rows={rows}
          onDelete={onDeleteClick}
          onChangeStatus={handleChangeStatus}
        />
      </section>
      <Footer />
    </main>
  );
}

export default Dashboard;
