// @flow
import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  isEqual, get, toInteger, isEmpty, map, uniqBy,
} from 'lodash';
import { DataGrid } from '@mui/x-data-grid';
import {
  Chip,
  Autocomplete, TextField, Button, Alert,
} from '@mui/material';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faPlus } from '@fortawesome/free-solid-svg-icons';
import { actions, selectors } from '../../store/articleStore';
import UserInfoInput from '../elements/UserInfoInput';

function NewReview() {
  const articles = useSelector((state) => selectors.getPublishedArticles(state), isEqual);

  const userItems = uniqBy(map(articles, (article) => ({
    ...article.author,
    label: article.author.full_name,
  })), 'id');

  // eslint-disable-next-line no-unused-vars
  const [deadline, setDeadline] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [amount, setAmount] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const searchOptions = map(userItems, (option) => ({
    label: option.label,
    value: option.id,
  }));

  return (
    <section
      className={classNames('review-modal review-new-modal', { 'review-modal-closed': !isModalOpen })}
      onClick={() => !isModalOpen && setIsModalOpen(true)}
    >
      {isModalOpen ? (
        <>
          <p className='review-modal-title'>New review</p>
          <div className="review-modal-content">
            <UserInfoInput
              label="Amount"
              value={amount}
              after="ADA"
              onClick={(e: any) => setAmount(e.target.value)}
            />
            <UserInfoInput
              label="Deadline"
              type="date"
              value={deadline}
              onClick={(e: any) => setDeadline(e.target.value)}
            />
          </div>
          <Autocomplete
            disablePortal
            disabled={false}
            multiple
            limitTags={3}
            className='review-modal-autocomplete'
            // onChange={(e, values) => onNewTagClick(values)}
            // onInputChange={(e, value) => onNewTagInput(value)}
            searchValue={searchValue}
            onInputChange={(e, value) => setSearchValue(value)}
            // isOptionEqualToValue={(option: BasicOption, value: BasicOption) => option.value === value.value}
            options={searchOptions}
            sx={{
              minWidth: 200, display: 'flex', alignItems: 'center',
            }}
            size="small"
            renderInput={(params) => (
              <TextField
                {...params}
                className='article-config-item-input'
                variant="outlined"
                size="small"
                label="Reviewers"
              />
            )}
          />
          <Button
            variant="contained"
            className='review-modal-button'
            onClick={() => setIsModalOpen(false)}
          >
            Submit
          </Button>
        </>
      ) : (
        <div className='review-modal-title'>
          <FontAwesomeIcon icon={faPlus} />
          <span className='review-modal-title-text'>New review</span>
        </div>
      )}
    </section>
  );
}

function Review(props: any) {
  const reviewStatus = {
    IN_PROGRESS: 'in_progress',
    WAITING_FOR_APPROVAL: 'waiting_for_approval',
    REJECTED: 'rejected',
    APPROVED: 'approved',
  };

  const statusColors = {
    [reviewStatus.IN_PROGRESS]: '#FFC107',
    [reviewStatus.WAITING_FOR_APPROVAL]: '#FFC107',
    [reviewStatus.REJECTED]: '#F44336',
    [reviewStatus.APPROVED]: '#4CAF50',
  };

  const statusText = {
    [reviewStatus.IN_PROGRESS]: 'In progress',
    [reviewStatus.WAITING_FOR_APPROVAL]: 'Waiting for approval',
    [reviewStatus.REJECTED]: 'Rejected',
    [reviewStatus.APPROVED]: 'Approved',
  };

  const columns: any[] = [
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (params: any) => `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      type: 'number',
      width: 80,
      editable: false,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 180,
      editable: false,
      renderCell: (params: any) => {
        const status = get(params, 'row.status');
        const color = statusColors[status] || '#000';
        const text = statusText[status] || 'Unknown';

        return (
          <Chip
            label={text}
            style={{
              backgroundColor: color,
              color: '#fff',
            }}
          />
        );
      },
    },
  ];

  const rows = [
    {
      id: 1, lastName: 'Snow', firstName: 'Jon', amount: props.amount, status: reviewStatus.IN_PROGRESS,
    },
    {
      id: 2, lastName: 'Lannister', firstName: 'Cersei', amount: props.amount, status: reviewStatus.WAITING_FOR_APPROVAL,
    },
    {
      id: 3, lastName: 'Lannister', firstName: 'Jaime', amount: props.amount, status: reviewStatus.REJECTED,
    },
  ];

  return (
    <section className="review-modal">
      <p className='review-modal-title'>Review #{props.id}</p>
      <div className="review-modal-content">
        <UserInfoInput
          label="Amount"
          value={props.amount}
          after="ADA"
          onClick={(e: any) => console.log('clicked', e)}
        />
        <UserInfoInput
          label="Deadline"
          type="date"
          value="2021-10-10"
          onClick={(e: any) => console.log('clicked', e)}
        />
        <DataGrid
          className='review-modal-table'
          rows={rows}
          columns={columns}
          autoHeight
          hideFooter
          sx={{ '&, [class^=MuiDataGrid]': { border: 'none' } }}
        />
      </div>
    </section>
  );
}

function ArticleSettings(): Node {
  const { id } = useParams();
  // const navigate = useNavigate();

  const dispatch = useDispatch();
  const fetchArticle = (ind: number) => dispatch(actions.fetchArticle(ind));

  const article = useSelector((state) => selectors.article(state), isEqual);

  const [isReady, setIsReady] = useState(!isEmpty(article) && id && get(article, 'id') === toInteger(id));

  useEffect(() => {
    setIsReady(!isEmpty(article) && id && get(article, 'id') === toInteger(id));
  }, [article, id]);

  useEffect(() => {
    if (!isReady) {
      fetchArticle(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article, id, isReady]);

  return (
    <main className="article-settings-wrapper">
      <div className="title-wrapper">
        <h1>Article Settings</h1>
      </div>

      <section className="article-settings">
        <p className='article-settings-subtitle'>Treasury information</p>
        <div className="article-settings-conditions">
          <Alert severity="success" className='article-settings-alert'>
            <p className='article-settings-alert-title'>Condition 1.</p>
            <p className='article-settings-alert-content'>Article has to be in Preprint status</p>
          </Alert>
        </div>
        <div className="article-settings-content">
          <UserInfoInput
            label="Total Amount"
            value="150"
            after="ADA"
            onClick={(e: any) => console.log('clicked', e)}
          />
          <UserInfoInput
            label="Max transaction limit"
            value="10"
            after="ADA"
            onClick={(e: any) => console.log('clicked', e)}
          />
        </div>
      </section>

      <section className="article-settings">
        <p className='article-settings-subtitle'>Reviews</p>
        <div className="article-settings-conditions">
          <Alert severity="success" className='article-settings-alert'>
            <p className='article-settings-alert-title'>Condition 1.</p>
            <p className='article-settings-alert-content'>Article has to be in Preprint status</p>
          </Alert>
          <FontAwesomeIcon icon={faChevronRight} className='article-settings-alert-icon' />
          <Alert severity="warning" className='article-settings-alert'>
            <p className='article-settings-alert-title'>Condition 2.</p>
            <p className='article-settings-alert-content'>Can&apos;t connect to the wallet</p>
          </Alert>
        </div>
        <div className="article-settings-content">
          <Review id={1} amount={8} />
          <Review id={2} amount={9.31} />
          <Review id={2} amount={4.523} />
          <NewReview />
        </div>
      </section>

      <section className="article-settings">
        <p className='article-settings-subtitle'>Delete article</p>
        <div className="article-settings-content">
          <Button
            variant="contained"
            className='article-settings-button'
          >
            Delete
          </Button>
        </div>
      </section>

    </main>
  );
}

export default ArticleSettings;
