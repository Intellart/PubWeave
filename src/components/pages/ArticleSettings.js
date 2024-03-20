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
  Autocomplete, Button, TextField, Alert,
} from '@mui/material';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBan,
  faCheck,
  // faPencil,
  faPlus, faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { actions, selectors } from '../../store/articleStore';
// eslint-disable-next-line no-unused-vars
import { actions as cardanoActions, selectors as cardanoSelectors } from '../../store/cardanoStore';
import { selectors as userSelectors } from '../../store/userStore';
import UserInfoItem from '../elements/UserInfoItem';
import { getSmallReviewCount, getWordCount } from '../../utils/hooks';
import HowItWorks from '../modal/HowItWorks';
import Conditions from '../modal/Conditions';
import Input from '../elements/Input';
import TreasuryModal from '../modal/TreasuryModal';
import ModalWrapper from '../modal/ModalWrapper';

type ReviewFormProps = {
  onSubmit: Function,
  onCancel: Function,
  review?: any,
};

function ReviewForm(props: ReviewFormProps) {
  const reviewers = useSelector((state) => selectors.getReviewers(state), isEqual);
  const article = useSelector((state) => selectors.article(state), isEqual);

  const totalAmount = get(article, 'tx_amount_in_treasury') || 0;

  console.log('props.review', props.review);

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

  const numOfSelectedReviewers = size(values);
  const maxAmountPerReviewer = totalAmount / numOfSelectedReviewers;
  const invalidAmount = toInteger(amount) > totalAmount || toInteger(amount) > maxAmountPerReviewer;

  const isDisabled = !amount || !deadline || isEmpty(values) || invalidAmount;

  return (
    <>

      <Input
        label="Amount"
        value={amount}
        type="number"
        currency="₳"
        error={totalAmount && (toInteger(amount) > totalAmount || toInteger(amount) > maxAmountPerReviewer)}
        onChange={(newValue: string) => setAmount(toInteger(newValue))}
        helperText={!invalidAmount ? `Amount per reviewer needs to be in range 1₳ - ${maxAmountPerReviewer}₳` : 'Amount exceeds total amount in treasury'}
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
            error={isEmpty(searchOptions)}
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
    ...((admin || props.isAuthor) ? [{
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
        readOnly
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
  const fetchArticle = (ind: number) => dispatch(actions.fetchArticle(ind));

  const handleClose = () => {
    fetchArticle(id);
  };

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
        {/* <div className="review-modal-buttons">
          <FontAwesomeIcon
            icon={faXmark}
            className={classNames('review-modal-close')}
            onClick={() => deleteReview(props.review.id)}
          />
          <FontAwesomeIcon
            icon={faPencil}
            className={classNames('review-modal-close',
              { 'review-modal-close-active': editMode })}
            onClick={() => setEditMode(!editMode)}
          />
        </div> */}
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
            isAuthor={props.isAuthor}
          />
        )}
      </div>
      {allReviewsSettled && (
        <ModalWrapper
          // eslint-disable-next-line react/no-unstable-nested-components
          content={(p: { onClose: any }) => (<TreasuryModal {...p} type="spend" />)}
          button={`Pay out to ${size(allAcceptedReviews)} reviewers`}
          title="Treasury"
          enabled={props.isAuthor}
          onClose={handleClose}
        />
        // <Modal
        //   treasuryProps={{
        //     totalAmount: props.txAmount,
        //     amountOfReviews: size(allAcceptedReviews),
        //   }}
        //   enabled
        //   articleId={id}
        //   type="treasury"
        //   shape="button"
        //   text="fillTreasury"
        //   customText={`Pay out to ${size(allAcceptedReviews)} reviewers`}
        // />
      )}
    </section>
  );
}

function ArticleSettings(): Node {
  const { id } = useParams();
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();

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
  const user = useSelector((state) => userSelectors.getUser(state), isEqual);
  // const treasury = useSelector((state) => cardanoSelectors.getTreasury(state), isEqual);
  const reviewers = useSelector((state) => selectors.getReviewers(state), isEqual);

  // console.log('article', article);
  const inlineReviews = groupBy(getSmallReviewCount(get(article, ['content', 'blocks'])),
    (smallReview) => smallReview.dataId);

  const networkType = process.env.REACT_APP_CARDANO_NETWORK_TYPE || 'testnet';
  const isAuthor = get(article, 'author.id') === get(user, 'id');
  const txAmount = get(article, 'tx_amount_in_treasury') || 0;
  const isArticleReady = () => !isEmpty(article) && id && get(article, 'id') === toInteger(id);
  const [isReady, setIsReady] = useState(isArticleReady());

  const {
    isConnected,
  } = useCardano({
    limitNetwork: networkType,
  });

  useEffect(() => {
    fetchReviews(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    fetchAllReviewers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsReady(isArticleReady());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article, id]);

  useEffect(() => {
    if (!isReady) {
      fetchArticle(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article, id, isReady]);

  // const reviewersExist = !isEmpty(reviewers);
  const articleTxId = get(article, 'tx_id');

  const isTreasuryFilled = !!txAmount && articleTxId;
  const fillingNotFinished = !!txAmount && !articleTxId;

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

            {fillingNotFinished && (
              <Alert severity="warning">
                Treasury filling was interrupted, please try again
              </Alert>
            )}

            {isTreasuryFilled ? (
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

              <ModalWrapper
                // eslint-disable-next-line react/no-unstable-nested-components
                content={(p: { onClose: any }) => (<TreasuryModal {...p} type="fill" />)}
                button="Fill treasury"
                title="Treasury"
                enabled={isReady && isAuthor}
                onClose={() => fetchArticle(id)}
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
                  label: 'Treasury filled',
                  error: !isTreasuryFilled,
                  errorMessage: 'Treasury not filled',
                },
                {
                  label: `Reviewers available (${size(reviewers)})`,
                  error: !size(reviewers),
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
                isAuthor={isAuthor}
              />
            ))}
            {/* <Review id={1} amount={8} />
          <Review id={2} amount={9.31} />
          <Review id={2} amount={4.523} /> */}
            <NewReview
              disabled={!isEmpty(reviews) || !isTreasuryFilled}
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
