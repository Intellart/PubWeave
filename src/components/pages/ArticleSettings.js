// @flow
import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  isEqual, get, toInteger, isEmpty, map, find,
} from 'lodash';
import { DataGrid } from '@mui/x-data-grid';
import {
  Chip,
  Autocomplete, TextField, Button, Alert,
} from '@mui/material';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight, faGear, faPencil, faPlus, faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router';
import { actions, selectors } from '../../store/articleStore';
import UserInfoInput from '../elements/UserInfoInput';
import UserInfoItem from '../elements/UserInfoItem';

function NewReview() {
  const reviewers = useSelector((state) => selectors.getReviewers(state), isEqual);

  // eslint-disable-next-line no-unused-vars
  const [deadline, setDeadline] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [amount, setAmount] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  if (isEmpty(reviewers)) {
    return null;
  }
  const userItems = map(reviewers, (reviewer) => ({
    label: reviewer.full_name,
    value: reviewer.id,
  }));

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
          <div className="review-modal-top">
            <p className='review-modal-title'>New review</p>
            <FontAwesomeIcon icon={faXmark} className='review-modal-close' onClick={() => setIsModalOpen(false)} />
          </div>

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
  // const articles = useSelector((state) => selectors.getPublishedArticles(state), isEqual);

  const reviewers = useSelector((state) => selectors.getReviewers(state), isEqual);

  const [editMode, setEditMode] = useState(false);

  const reviewStatus = {
    IN_PROGRESS: 'in_progress',
    AWAITING_APPROVAL: 'awaiting_approval',
    REJECTED: 'rejected',
    ACCEPTED: 'accepted',
  };

  const statusColors = {
    [reviewStatus.IN_PROGRESS]: '#FFC107',
    [reviewStatus.AWAITING_APPROVAL]: '#FFC107',
    [reviewStatus.REJECTED]: '#F44336',
    [reviewStatus.ACCEPTED]: '#4CAF50',
  };

  const statusText = {
    [reviewStatus.IN_PROGRESS]: 'In progress',
    [reviewStatus.AWAITING_APPROVAL]: 'Awaiting approval',
    [reviewStatus.REJECTED]: 'Rejected',
    [reviewStatus.ACCEPTED]: 'Accepted',
  };

  const columns: any[] = [
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
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

  const userItems = map(reviewers, (reviewer) => ({
    label: reviewer.full_name,
    value: reviewer.id,
  }));

  const [searchValue, setSearchValue] = useState('');
  const searchOptions = map(userItems, (option) => ({
    label: option.label,
    value: option.id,
  }));

  if (isEmpty(reviewers)) {
    return null;
  }

  const rows = map(props.review.user_reviews, (userReview) => {
    const user = find(reviewers, (reviewer) => reviewer.id === userReview.user_id);

    console.log('user', user);

    return {
      status: userReview.status,
      fullName: user.full_name,
      amount: props.review.amount,
      id: userReview.id,
    };
  });

  console.log('rows', rows);

  return (
    <section className="review-modal">
      <div className="review-modal-top">
        <p className='review-modal-title'>Review #{props.review.id}</p>
        <FontAwesomeIcon
          icon={faPencil}
          className={classNames('review-modal-close',
            { 'review-modal-close-active': editMode })}
          onClick={() => setEditMode(!editMode)}
        />
      </div>

      <div className="review-modal-content">
        <UserInfoInput
          label="Amount"
          value={props.review.amount}
          after="ADA"
          onClick={(e: any) => console.log('clicked', e)}
        />
        <UserInfoInput
          label="Deadline"
          type="date"
          value={props.review.deadline}
          onClick={(e: any) => console.log('clicked', e)}
        />

        {editMode ? (
          <>
            <Autocomplete
              disablePortal
              disabled={false}
              multiple
              limitTags={3}
              value={map(rows, (row) => ({
                label: row.fullName,
                value: row.id,
              })) || []}
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
              onClick={() => setEditMode(false)}
            >
              Submit
            </Button>
          </>
        ) : (
          <DataGrid
            className='review-modal-table'
            rows={rows}
            columns={columns}
            autoHeight
            hideFooter
            sx={{ '&, [class^=MuiDataGrid]': { border: 'none' } }}
          />
        )}
      </div>
    </section>
  );
}

function ArticleSettings(): Node {
  const { id } = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const fetchArticle = (ind: number) => dispatch(actions.fetchArticle(ind));
  const fetchAllReviewers = () => dispatch(actions.fetchAllReviewers());
  const fetchReviews = (ind: number) => dispatch(actions.fetchReviews(ind));

  const reviews = useSelector((state) => selectors.getReviews(state), isEqual);
  const article = useSelector((state) => selectors.article(state), isEqual);
  const reviewers = useSelector((state) => selectors.getReviewers(state), isEqual);

  console.log('reviewers', reviewers);
  console.log('reviews', reviews);

  useEffect(() => {
    fetchReviews(id);
  }, [id]);

  const [isReady, setIsReady] = useState(!isEmpty(article) && id && get(article, 'id') === toInteger(id));

  useEffect(() => {
    fetchAllReviewers();
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
          <UserInfoItem
            label="Total Amount"
            value="150"
            after="ADA"
          />
          <UserInfoItem
            label="Max transaction limit"
            value="10"
            after="ADA"
          />
        </div>
        <Button
          variant="contained"
          size='small'
          className='article-settings-button'
          onClick={() => navigate('/user')}
        >
          <FontAwesomeIcon icon={faGear} />
        </Button>
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
        <div className="article-settings-content article-settings-content-grid">
          {map(reviews, (review) => (
            <Review review={review} key={review.id} />
          ))}
          {/* <Review id={1} amount={8} />
          <Review id={2} amount={9.31} />
          <Review id={2} amount={4.523} /> */}
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
