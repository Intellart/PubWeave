// @flow
import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useParams, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useCardano } from '@cardano-foundation/cardano-connect-with-wallet';

import {
  isEqual, get, toInteger, isEmpty, map, find, groupBy, size, every, filter,
} from 'lodash';
import { DataGrid } from '@mui/x-data-grid';
import {
  Chip,
  Autocomplete, Button, TextField,
} from '@mui/material';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBan,
  faCheck,
  faPlus, faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { actions, selectors } from '../../store/articleStore';
// eslint-disable-next-line no-unused-vars
import { actions as cardanoActions, selectors as cardanoSelectors } from '../../store/cardanoStore';
import { selectors as userSelectors } from '../../store/userStore';
import UserInfoItem from '../elements/UserInfoItem';
import Modal from '../modal/Modal';
import { getSmallReviewCount, getWordCount } from '../../utils/hooks';
import HowItWorks from '../modal/HowItWorks';
import Conditions from '../modal/Conditions';
import Input from '../elements/Input';

type ReviewFormProps = {
  onSubmit: Function,
  onCancel: Function,
  review?: any,
};

function ReviewForm(props: ReviewFormProps) {
  const reviewers = useSelector((state) => selectors.getReviewers(state), isEqual);

  const [deadline, setDeadline] = useState(props.review ? props.review.deadline : new Date().toISOString().split('T')[0]);
  // eslint-disable-next-line no-unused-vars
  const [amount, setAmount] = useState(props.review ? props.review.amount : '');
  const [values, setValues] = useState<Array<number>>(props.review ? map(props.review.user_reviews, (userReview) => {
    const user = find(reviewers, (reviewer) => reviewer.id === userReview.user_id);

    return {
      label: user.full_name,
      value: user.id,
    };
  }) : []);
  const [searchValue, setSearchValue] = useState('');

  const searchOptions = map(reviewers, (reviewer) => ({
    label: reviewer.full_name,
    value: reviewer.id,
  }));

  const handleReviewSubmit = () => {
    if (!amount || !deadline || isEmpty(values)) {
      return;
    }

    props.onSubmit(toInteger(amount), deadline, map(values, (value) => toInteger(value.value)));
  };

  const isDisabled = !amount || !deadline || isEmpty(values);

  return (
    <>

      <Input
        label="Amount"
        value={amount}
        type="number"
        currency="₳"
        onChange={(newValue: string) => setAmount(newValue)}
      />
      <Input
        label="Deadline"
        value={deadline}
        type="date"
        onChange={(newValue: any) => setDeadline(newValue)}
      />
      <Autocomplete
        disablePortal
        multiple
        limitTags={3}
        className='review-modal-autocomplete'
        value={values}
        onChange={(e, newValues) => {
          setValues(newValues);
        }}
        inputValue={searchValue}
        onInputChange={(e, v) => setSearchValue(v)}
        isOptionEqualToValue={(option: any, value: any) => option.value === value.value}
        options={searchOptions}
        sx={{
          minWidth: 200, display: 'flex', alignItems: 'center',
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            className='article-config-item-input'
            variant="outlined"
            label="Reviewers"
            error={isEmpty(values)}
            helperText={size(searchOptions) ? 'Select reviewers (users with valid wallet address)'
              : 'No reviewers (users with valid wallet address) found'}
          />
        )}
      />
      <Button
        disabled={isDisabled}
        variant="contained"
        className='review-modal-button'
        onClick={handleReviewSubmit}
      >
        Submit
      </Button>
    </>
  );
}

type NewReviewProps = {
  disabled?: boolean,
};

function NewReview({ disabled }: NewReviewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { id } = useParams();

  const dispatch = useDispatch();
  const newReview = (amount: number, articleId: number, deadline: string, reviewerIds: number[]) => dispatch(actions.newReview(amount, articleId, deadline, reviewerIds));
  const fetchReviews = (ind: number) => dispatch(actions.fetchReviews(ind));

  return (
    <section
      className={classNames('review-modal review-new-modal', { 'review-modal-closed': !isModalOpen })}
      onClick={() => !disabled && !isModalOpen && setIsModalOpen(true)}
    >
      {isModalOpen ? (
        <>
          <div className="review-modal-top">
            <p className='review-modal-title'>New review</p>
            <FontAwesomeIcon
              icon={faXmark}
              className='review-modal-close'
              onClick={() => setIsModalOpen(false)}
            />
          </div>
          <ReviewForm
            onCancel={() => setIsModalOpen(false)}
            onSubmit={(amount, deadline, reviewerIds) => {
              newReview(amount, toInteger(id), deadline, reviewerIds);
              setIsModalOpen(false);
              fetchReviews(toInteger(id));
            }}
          />
        </>

      ) : (
        <div className='review-modal-title'>
          <FontAwesomeIcon icon={disabled ? faBan : faPlus} />
          <span className='review-modal-title-text'>New review</span>
        </div>
      )}
    </section>
  );
}

function ReviewTable(props: any) {
  const admin = useSelector((state) => userSelectors.getAdmin(state), isEqual);
  const dispatch = useDispatch();
  const acceptUserReview = (userReviewId: number) => dispatch(actions.acceptUserReview(userReviewId));
  const rejectUserReview = (userReviewId: number) => dispatch(actions.rejectUserReview(userReviewId));

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
    {
      field: 'words',
      headerName: 'Words',
      width: 60,
      editable: false,
      valueGetter: (params: any) => {
        const review = get(params, ['row', 'review']);

        if (review) {
          return getWordCount(review.content.blocks);
        }

        return 0;
      },
    },
    {
      field: 'inlineReviews',
      headerName: 'Inline reviews',
      width: 120,
      editable: false,
    },
    ...(admin ? [{
      field: 'approve',
      headerName: 'Approve',
      width: 160,
      editable: false,
      renderCell: (renderProps: any) => (get(renderProps, 'row.status') === 'in_progress' ? (
        <div
          className='review-modal-approve'
          onClick={() => console.log(renderProps)}
          style={{
            display: 'flex',
            gap: '10px',
          }}
        >
          <Button
            variant="contained"
            color="success"
            onClick={() => acceptUserReview(renderProps.row.id)}
          >
            <FontAwesomeIcon icon={faCheck} />
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => rejectUserReview(renderProps.row.id)}
          >
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </div>
      ) : null),
    }] : []),
  ];

  return (
    <div className="review-modal-content">
      <Input
        label="Amount"
        value={props.amount}
        currency="₳"
      />
      <UserInfoItem
        label="Deadline"
        value={props.deadline}
      />
      <DataGrid
        className='review-modal-table'
        rows={props.rows}
        columns={columns}
        autoHeight
        hideFooter
        sx={{
          '&, [class^=MuiDataGrid]': { border: 'none' },
          overflow: 'hidden',
        }}
      />
    </div>

  );
}

function Review(props: any) {
  const { id } = useParams();

  const reviewers = useSelector((state) => selectors.getReviewers(state), isEqual);

  const dispatch = useDispatch();
  const newReview = (amount: number, articleId: number, deadline: string, reviewerIds: number[]) => dispatch(actions.newReview(amount, articleId, deadline, reviewerIds));
  // const deleteReview = (reviewId: number) => dispatch(actions.deleteReview(reviewId));

  const [editMode, setEditMode] = useState(false);

  if (isEmpty(reviewers)) {
    return null;
  }

  const allReviewsSettled = every(props.review.user_reviews, (userReview) => userReview.status !== 'in_progress');
  const allAcceptedReviews = filter(props.review.user_reviews, (userReview) => userReview.status === 'accepted');

  const rows = map(props.review.user_reviews, (userReview) => ({
    status: userReview.status,
    fullName: userReview.full_name,
    amount: props.review.amount,
    id: userReview.id,
    inlineReviews: size(get(props.inlineReviews, userReview.user_id)),
    review: userReview.review_content,
  }));

  return (
    <section className="review-modal">
      <div className="review-modal-top">
        <p className='review-modal-title'>Review #{props.review.id}</p>
        {/* <FontAwesomeIcon
          icon={faXmark}
          className={classNames('review-modal-close')}
          onClick={() => deleteReview(props.review.id)}
        /> */}
        {/* <FontAwesomeIcon
          icon={faPencil}
          className={classNames('review-modal-close',
            { 'review-modal-close-active': editMode })}
          onClick={() => setEditMode(!editMode)}
        /> */}
      </div>

      <div className="review-modal-content">

        {editMode ? (
          <ReviewForm
            review={props.review}
            onCancel={() => setEditMode(false)}
            onSubmit={(amount, deadline, reviewerIds) => {
              newReview(amount, toInteger(id), deadline, reviewerIds);

              setEditMode(false);
            }}
          />
        ) : (
          <ReviewTable
            rows={rows}
            amount={props.review.amount}
            deadline={props.review.deadline}
            article={props.article}
          />
        )}
      </div>
      {allReviewsSettled && (
        // <Button
        //   variant="contained"
        //   className='review-modal-button'
        //   color="success"
        // >
        //   Pay out to {size(allAcceptedReviews)} reviewers
        // </Button>
        <Modal
          treasuryProps={{
            totalAmount: props.txAmount,
            amountOfReviews: size(allAcceptedReviews),
          }}
          enabled
          articleId={id}
          type="treasury"
          shape="button"
          text="fillTreasury"
          customText={`Pay out to ${size(allAcceptedReviews)} reviewers`}
        />
      )}
    </section>
  );
}

function ArticleSettings(): Node {
  const { id } = useParams();
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();

  const tx = searchParams.get('tx');

  const dispatch = useDispatch();
  const fetchArticle = (ind: number) => dispatch(actions.fetchArticle(ind));
  const fetchAllReviewers = () => dispatch(actions.fetchAllReviewers());
  const fetchReviews = (ind: number) => dispatch(actions.fetchReviews(ind));
  // const fetchTreasury = (ind: number, showMessage?: boolean) => dispatch(cardanoActions.fetchTreasury(ind, showMessage));

  // useEffect(() => {
  //   if (id) fetchTreasury(id);
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [id]);

  const reviews = useSelector((state) => selectors.getReviews(state), isEqual);
  const article = useSelector((state) => selectors.article(state), isEqual);
  // const treasury = useSelector((state) => cardanoSelectors.getTreasury(state), isEqual);
  // const reviewers = useSelector((state) => selectors.getReviewers(state), isEqual);

  const inlineReviews = groupBy(getSmallReviewCount(get(article, ['content', 'blocks'])),
    (smallReview) => smallReview.dataId);

  const networkType = process.env.REACT_APP_CARDANO_NETWORK_TYPE || 'testnet';

  const txAmount = get(article, 'tx_amount_in_treasury');
  // console.log(article);
  const {
    // isEnabled,
    isConnected,
    // enabledWallet,
    // stakeAddress,
    // accountBalance,
    // signMessage,
    // usedAddresses,
    // enabledWallet,
    // installedExtensions,
    // connect,
    // disconnect,
    // connectedCip45Wallet,
  } = useCardano({
    limitNetwork: networkType,
  });

  useEffect(() => {
    fetchReviews(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const [isReady, setIsReady] = useState(!isEmpty(article) && id && get(article, 'id') === toInteger(id));

  useEffect(() => {
    fetchAllReviewers();
  }, []);

  useEffect(() => {
    setIsReady(!isEmpty(article) && id && get(article, 'id') === toInteger(id));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article, id]);

  useEffect(() => {
    if (!isReady || !tx) {
      fetchArticle(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article, id, isReady, tx]);

  // const reviewersExist = !isEmpty(reviewers);

  const isTreasuryFilled = !!txAmount;
  const isTreasuryFound = isTreasuryFilled || tx;

  return (
    <main className="article-settings-wrapper">
      <div className='article-settings'>
        <div className="title-wrapper">
          <h1>Article Settings</h1>
        </div>
        <HowItWorks type="review" />

        <section className="article-settings-item">
          <p className='article-settings-subtitle'>Treasury information</p>

          <div className="article-settings-content">
            <Conditions
              steps={[
                {
                  label: 'Article status: Blog',
                  error: get(article, 'article_type') !== 'blog_article',
                  errorMessage: 'Article is not in status: Blog',
                },
                {
                  label: 'Connect wallet',
                  error: !isConnected,
                  errorMessage: 'Please connect wallet on user page',
                },

              ]}
            />

            {(isTreasuryFilled || isTreasuryFound) ? (
              <div className='article-settings-treasury-filled'>
                <Input
                  label="Total Amount"
                  value={txAmount}
                  currency="₳"
                  readOnly
                  helperText={!isTreasuryFilled ? "Treasury exists but it's not filled, please refresh in a minute" : 'Total amount in treasury'}
                  error={!isTreasuryFilled}
                />
                {/* <Button
                variant="outlined"
                color="warning"
                className='article-settings-button'
                onClick={() => fetchTreasury(id, true)}
              >
                <FontAwesomeIcon icon={faRefresh} />&nbsp;Refresh
              </Button> */}
              </div>
            ) : (

              <Modal
                enabled
                articleId={id}
                type="treasury"
                shape="button"
                text="fillTreasury"
              />
            )}
          </div>
        </section>

        <section className="article-settings-item">
          <p className='article-settings-subtitle'>Reviews</p>

          <div className="article-settings-content">
            <Conditions
              steps={[
                {
                  label: 'Create treasury',
                  error: !isTreasuryFound,
                  errorMessage: 'Treasury not found',
                },
                {
                  label: 'Treasury filled',
                  error: !isTreasuryFilled,
                  errorMessage: 'Treasury not filled',
                },
                {
                  label: 'Reviewers available',
                  error: !size(reviews),
                  errorMessage: 'No reviewers available',
                },

              ]}
            />
            {map(reviews, (review) => (
              <Review
                review={review}
                key={review.id}
                inlineReviews={inlineReviews}
                txAmount={txAmount}
              />
            ))}
            {/* <Review id={1} amount={8} />
          <Review id={2} amount={9.31} />
          <Review id={2} amount={4.523} /> */}
            <NewReview
              disabled={!isEmpty(reviews) || !isTreasuryFilled || !isTreasuryFound}
            />
          </div>
        </section>

        <section className="article-settings-item">
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
      </div>

    </main>
  );
}

export default ArticleSettings;
