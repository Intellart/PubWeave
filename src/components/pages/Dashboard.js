// @flow
import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  get, isEqual, map,
  filter,
} from 'lodash';
import {
  faCheck, faEdit, faPaperPlane, faRotateRight, faStar, faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { Alert, AlertTitle } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MyDataGrid from '../containers/MyDataGrid';

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
  const deleteArticle = (id: number) => dispatch(actions.deleteArticle(id));
  const publishArticle = (articleId: number, status: string) => dispatch(actions.publishArticle(articleId, status));
  const updateArticle = (id: number, payload: any) => dispatch(actions.updateArticle(id, payload));

  const [rows, setRows] = useState<any>([]);

  const handleSetStar = (id: number, value: number) => {
    updateArticle(id, { star: value });
  };

  useEffect(() => {
    if (!articles) {
      fetchAllArticles();
    } else {
      setRows(map(filter(articles, a => a.status !== 'draft'), (article) => ({
        id: article.id,
        title: article.title,
        status: get(statuses, get(article, 'status', 'draft')),
        firstName: get(article, 'author.full_name', ''),
        email: get(article, 'author.email', ''),
        ORCID: get(article, 'author.orcid_id', ''),
        registeredOn: get(article, 'author.created_at', ''),
        category: get(article, 'category', ''),
        star: get(article, 'star', false) || false,
      })));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articles]);

  const onDeleteClick = (id: number) => {
    deleteArticle(id);
  };

  const handleChangeStatus = (id: number, newStatus: string) => {
    publishArticle(id, newStatus);
  };

  const handleChangeTextField = (id: number, field: number, value: number) => {
    updateArticle(id, { [field]: value });
  };

  const handleChangeCategory = (id: number, value: number) => {
    updateArticle(id, { category_id: value });
  };

  return (
    <main className="dashboard-wrapper">
      <section className="dashboard-section">
        <MyDataGrid
          rows={rows}
          onDelete={onDeleteClick}
          onChangeStatus={handleChangeStatus}
          onChangeTextField={handleChangeTextField}
          categories={categories}
          onChangeCategory={handleChangeCategory}
          setStar={handleSetStar}
          onDeleteArticle={deleteArticle}
        />

      </section>
      <Alert
        sx={{ width: '90%' }}
        severity="info"
      >
        <AlertTitle>Instruction</AlertTitle>
        As an admin, you can:<br />
        - Delete an article<br />
        - Publish an article<br />
        - Edit the article <FontAwesomeIcon icon={faEdit} /><br />
        - Change the category of an article<br />
        - Change the status of an article<br />
        - Star an article <FontAwesomeIcon icon={faStar} /><br />
      </Alert>
      <Alert
        sx={{ width: '90%' }}
      >
        <AlertTitle>Legend</AlertTitle>
        Draft &gt; Requested (by author)<br />
        Requested &gt; Published (by admin)<br />
        Requested &gt; Rejected (by admin)
      </Alert>
    </main>
  );
}

export default Dashboard;
