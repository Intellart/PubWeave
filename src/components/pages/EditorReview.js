// @flow
import React, { useEffect } from 'react';
import type { Node } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
// import FeaturedImg from '../../images/featured-card.png';
// import { faComment } from '@fortawesome/free-regular-svg-icons';
import { faFacebook, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import Avatar from '@mui/material/Avatar';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  filter,
  find, get, isEmpty, isEqual, map, toInteger,
} from 'lodash';
import { Button, Chip } from '@mui/material';
// import { store } from '../../store';
import { actions, selectors } from '../../store/articleStore';
import { selectors as userSelectors } from '../../store/userStore';
import { useScrollTopEffect } from '../../utils/hooks';
import OrcIDButton from '../elements/OrcIDButton';
import Editor, { EditorStatus } from '../editor/Editor';
import type {
  ArticleContentToServer,
  BlockCategoriesToChange,
} from '../../store/articleStore';
import ReviewEditor from '../editor/ReviewEditor';

function EditorReview(): Node {
  useScrollTopEffect();
  const { id } = useParams();

  const dispatch = useDispatch();
  const fetchArticle = (artId: number) => dispatch(actions.fetchArticle(artId));
  const createArticle = (userId : number, userReviewId?: number) => dispatch(actions.createArticle(userId, userReviewId));
  // const likeArticle = (articleId: number) => dispatch(actions.likeArticle(articleId));
  // const removeArticleLike = (articleId: number) => dispatch(actions.likeArticleRemoval(articleId));
  const updateArticleContentSilently = (articleId:number, newArticleContent: ArticleContentToServer) => dispatch(actions.updateArticleContentSilently(articleId, newArticleContent));

  const article = useSelector((state) => selectors.article(state), isEqual);
  const categories = useSelector((state) => selectors.getCategories(state), isEqual);
  const user = useSelector((state) => userSelectors.getUser(state), isEqual);
  const admin = useSelector((state) => userSelectors.getAdmin(state), isEqual);

  const articleContent = useSelector((state) => selectors.articleContent(state), isEqual);
  const userReview = useSelector((state) => selectors.userReview(state, get(user, 'id')), isEqual);

  const isReady = !isEmpty(article) && id && get(article, 'id') === toInteger(id);

  const isAuthor = get(article, 'author.id') === get(user, 'id') || admin;

  const articleReviewers = get(article, 'reviewers', []);
  const articleReviewContent = get(userReview, 'review_content', '');

  const isReviewReady = isReady
    && get(article, 'status') === EditorStatus.IN_REVIEW
    && !isEmpty(articleReviewers)
    && !isEmpty(userReview);

  const isReviewContentReady = !isEmpty(articleReviewContent);

  const allReviews = filter(articleReviewers, (reviewer) => !isEmpty(reviewer.review_content));

  const showReviews = isAuthor && get(article, 'status') === EditorStatus.IN_REVIEW
  && !isEmpty(allReviews);

  useEffect(() => {
    if (!isReady) {
      fetchArticle(id);
    }
    if (document.body) {
      document.body.spellcheck = false;
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleContent, id, isReady]);

  const handleCreateReviewContent = () => {
    createArticle(get(user, 'id', 1), userReview.id);
  };

  const getRoute = (catId: number) => get(find(categories, (cat) => cat.id === catId), 'category_name');

  const author = get(article, 'author', {});

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <main className="single-blog-wrapper single-blog-wrapper-review">
      <section className="single-blog-highlight unselectable">
        <div className="single-blog-highlight-text">
          <div className="single-blog-highlight-text-left">
            <h1 className="single-blog-highlight-category">{get(article, 'category', '')}</h1>
            <h2 className="single-blog-highlight-title">{get(article, 'title', 'No title')}</h2>
            <p className="single-blog-highlight-description">{get(article, 'description', '')}</p>
            <div className="single-blog-highlight-text-left-tags">
              {map(get(article, 'tags', []), (tag, index) => (
                <Link
                  key={index}
                  to={`/blogs/${getRoute(tag.category_id)}/${tag.tag}`}
                >
                  <Chip
                    variant='outlined'
                    key={tag.id}
                    label={tag.tag}
                    className="single-blog-highlight-text-left-tags-chip"
                  />
                </Link>
              ))}
            </div>
          </div>
          <div className="single-blog-highlight-text-right">
            <div className="single-blog-highlight-text-right-social-icons">
              {get(author, 'social_tw')
              && (
              <a target="_blank" href={get(author, 'social_tw')}>
                <FontAwesomeIcon icon={faTwitter} style={{ width: 35, height: 35 }} />
              </a>
              )}
              {get(author, 'social_ln')
              && (
                <a href={get(author, 'social_ln')}>
                  <FontAwesomeIcon icon={faLinkedin} style={{ width: 35, height: 35 }} />
                </a>
              )}
              {get(author, 'social_fb')
              && (
                <a target="_blank" href={get(author, 'social_fb')}>
                  <FontAwesomeIcon icon={faFacebook} style={{ width: 35, height: 35 }} />
                </a>
              )}
              {get(author, 'social_web')
              && (
                <a target="_blank" href={get(author, 'social_web')}>
                  <FontAwesomeIcon icon={faGlobe} style={{ width: 35, height: 35 }} />
                </a>
              )}
            </div>
            {get(author, 'orcid_id') && (
              <OrcIDButton
                orcid={get(author, 'orcid_id')}
              />
            )}
            <div className="single-blog-highlight-text-right-author">
              <Avatar alt="Remy Sharp" src={get(author, 'profile_img', '')} className="single-blog-highlight-text-right-author-img" />
              <div className="single-blog-highlight-text-right-author-text">
                <p className="single-blog-highlight-text-right-author-text-name">{get(author, 'full_name', '')}</p>
                <p className="single-blog-highlight-text-right-author-text-date">{new Date(get(article, 'created_at', '')).toDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {isReady && (
        <div
          className="editorjs-wrapper"
        >
          <Editor
            isReady={isReady}
            status={EditorStatus.IN_REVIEW}
            onChange={(newBlocks: BlockCategoriesToChange, time:number, version: string) => {
              updateArticleContentSilently(id, {
                time: time || 0,
                version: version || '1',
                blocks: (newBlocks: any),
              });
            }}
          />

        </div>
      )}
      {isReviewReady && (
      <section className="single-blog-reviewer-header single-blog-reviewer-header-closed unselectable">
        {isReviewContentReady
          ? <h2 className="single-blog-reviewer-header-title">Write a review</h2>
          : (
            <Button
              variant="contained"
              className="single-blog-highlight-description"
              onClick={handleCreateReviewContent}
            >Create a review
            </Button>
          )
            }
      </section>
      )}
      {isReviewReady && isReviewContentReady && (
        <div className="editorjs-wrapper">
          <ReviewEditor
            isReady={isReady}
            userId={get(user, 'id', 1)}
            status={EditorStatus.REVIEW_PANE}
            onChange={(newBlocks: BlockCategoriesToChange, time:number, version: string) => {
              updateArticleContentSilently(articleReviewContent.id, {
                time: time || 0,
                version: version || '1',
                blocks: (newBlocks: any),
              });
            }}
          />
        </div>
      )}
      {showReviews && allReviews && map(allReviews, (reviewer) => (
        <React.Fragment key={reviewer.id}>
          <section className="single-blog-reviewer-header">
            <h2 className="single-blog-reviewer-header-title"> {get(reviewer, 'full_name', '')}</h2>
            <div className="single-blog-reviewer-header-right">
              <p className="single-blog-reviewer-header-right-label">Review</p>
              <p className="single-blog-reviewer-header-right-status">
                <Chip
                  label={get({
                    in_progress: 'In progress',
                    accepted: 'Accepted',
                    paid: 'Accepted and paid',
                    rejected: 'Rejected',
                  }, get(reviewer, 'status', ''), '')}
                  variant="default"
                  color={get({
                    in_progress: 'primary',
                    accepted: 'success',
                    paid: 'success',
                    rejected: 'error',
                  }, get(reviewer, 'status', ''), '')}
                />
              </p>
            </div>
          </section>
          <div className="editorjs-wrapper">
            <ReviewEditor
              isReady={isReady}
              status={EditorStatus.REVIEW_PANE_READ_ONLY}
              userId={reviewer.user_id}
            />
          </div>
        </React.Fragment>
      ))}
      {/* <div className="reaction-icons unselectable">
        <LikeButton
          enabled={!isEmpty(user)}
          article={article}
          userId={get(user, 'id', 1)}
          iconType='solid'
        />
        <CommentModal
          enabled
          articleId={id}
        />
        <p>{size(get(article, 'comments', []))}</p>

      </div> */}
    </main>
  );
}

export default EditorReview;
