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
import MyDataGrid from '../containers/MyDataGrid/MyDataGrid';

import { actions, selectors } from '../../store/articleStore';

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
  // const articles = useSelector((state) => selectors.getUsersArticles(state), isEqual);
  const articles = useSelector((state) => selectors.getAllArticles(state), isEqual);
  const categories = useSelector((state) => selectors.getCategories(state), isEqual);

  const dispatch = useDispatch();
  const fetchAllArticles = () => dispatch(actions.fetchAllArticles());
  const deleteArticle = (id) => dispatch(actions.deleteArticle(id));
  const publishArticle = (articleId, status) => dispatch(actions.publishArticle(articleId, status));
  const updateArticle = (id, payload) => dispatch(actions.updateArticle(id, payload));

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!articles) {
      fetchAllArticles();
    } else {
      setRows(map(articles, (article) => ({
        id: article.id,
        title: article.title,
        status: get(statuses, get(article, 'status', 'draft')),
        firstName: get(article, 'user.full_name', ''),
        email: get(article, 'user.email', ''),
        ORCID: get(article, 'user.orcid_id', ''),
        registeredOn: get(article, 'user.created_at', ''),
        category: get(article, 'category', ''),
      })));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articles]);

  const onDeleteClick = (id) => {
    deleteArticle(id);
  };

  const handleChangeStatus = (id, newStatus) => {
    publishArticle(id, newStatus);
  };

  const handleChangeTextField = (id, field, value) => {
    updateArticle(id, { [field]: value });
  };

  const handleChangeCategory = (id, value) => {
    updateArticle(id, { category_id: value });
  };

  return (
    <main className="about-wrapper">
      <section className="about-section">
        <MyDataGrid
          rows={rows}
          onDelete={onDeleteClick}
          onChangeStatus={handleChangeStatus}
          onChangeTextField={handleChangeTextField}
          categories={categories}
          onChangeCategory={handleChangeCategory}
        />
      </section>
      <Footer />
    </main>
  );
}

export default Dashboard;
