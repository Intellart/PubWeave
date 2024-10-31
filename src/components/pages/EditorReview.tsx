import { Fragment, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
// import FeaturedImg from '../../images/featured-card.png';
// import { faComment } from '@fortawesome/free-regular-svg-icons';
import {
  faFacebook,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import Avatar from "@mui/material/Avatar";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  camelCase,
  filter,
  find,
  get,
  isEmpty,
  isEqual,
  map,
  toInteger,
} from "lodash";
import { Button, Chip } from "@mui/material";
// import { store } from '../../store';
import { useScrollTopEffect } from "../../utils/hooks";
import OrcIDButton from "../elements/OrcIDButton";
import Editor, { EditorStatus } from "../editor/Editor";
import ReviewEditor from "../editor/ReviewEditor";
import { ReduxState } from "../../types";
import articleActions from "../../store/article/actions";
import {
  ArticleContentToServer,
  Block,
  BlockCategoriesToChange,
  BlockToServer,
} from "../../store/article/types";
import articleSelectors from "../../store/article/selectors";
import userSelectors from "../../store/user/selectors";

function Blogs() {
  useScrollTopEffect();
  const { id } = useParams();

  // store.getState();

  // eslint-disable-next-line no-unused-vars

  const dispatch = useDispatch();
  const fetchArticle = (artId: number) =>
    dispatch(articleActions.fetchArticle(artId));
  const createArticle = (userId: number, userReviewId?: number) =>
    dispatch(articleActions.createArticle(userId, userReviewId));
  // const likeArticle = (articleId: number) => dispatch(actions.likeArticle(articleId));
  // const removeArticleLike = (articleId: number) => dispatch(actions.likeArticleRemoval(articleId));
  const updateArticleContentSilently = (
    articleId: number,
    newArticleContent: ArticleContentToServer
  ) =>
    dispatch(
      articleActions.updateArticleContentSilently(articleId, newArticleContent)
    );

  const article = useSelector(articleSelectors.article, isEqual);
  const categories = useSelector(articleSelectors.getCategories, isEqual);
  const user = useSelector(userSelectors.getUser, isEqual);
  const admin = useSelector(userSelectors.getAdmin, isEqual);

  const articleContent = useSelector(articleSelectors.articleContent, isEqual);
  const userReviewers = useSelector(articleSelectors.userReviewers, isEqual);

  const userReview = find(userReviewers, (reviewer) =>
    isEqual(get(reviewer, "user_id"), get(user, "id"))
  );

  const isReady =
    !isEmpty(article) && id && get(article, "id") === toInteger(id);

  const isAuthor = get(article, "author.id") === get(user, "id") || admin;

  const articleReviewers = get(article, "reviewers", []);
  const articleReviewContent = get(userReview, "review_content", "");

  const isReviewReady =
    isReady &&
    get(article, "status") === EditorStatus.IN_REVIEW &&
    !isEmpty(articleReviewers) &&
    !isEmpty(userReview);

  const isReviewContentReady = !isEmpty(articleReviewContent);

  const allReviews = filter(
    articleReviewers,
    (reviewer) => !isEmpty(reviewer.review_content)
  );

  const showReviews =
    isAuthor &&
    get(article, "status") === EditorStatus.IN_REVIEW &&
    !isEmpty(allReviews);

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
    createArticle(get(user, "id", 1), userReview.id);
  };

  const getRoute = (catId: number) =>
    get(
      find(categories, (cat) => cat.id === catId),
      "category_name"
    );

  const author = get(article, "author", {});

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <main className="single-blog-wrapper single-blog-wrapper-review">
      <section className="single-blog-highlight unselectable">
        <div className="single-blog-highlight-text">
          <div className="single-blog-highlight-text-left">
            <h1 className="single-blog-highlight-category">
              {get(article, "category", "")}
            </h1>
            <h2 className="single-blog-highlight-title">
              {get(article, "title", "No title")}
            </h2>
            <p className="single-blog-highlight-description">
              {get(article, "description", "")}
            </p>
            <div className="single-blog-highlight-text-left-tags">
              {map(get(article, "tags", []), (tag, index) => (
                <Link
                  key={index}
                  to={`/blogs/${getRoute(tag.category_id)}/${tag.tag}`}
                >
                  <Chip
                    variant="outlined"
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
              {get(author, "social_tw") && (
                <a target="_blank" href={get(author, "social_tw")}>
                  <FontAwesomeIcon
                    icon={faTwitter}
                    style={{ width: 35, height: 35 }}
                  />
                </a>
              )}
              {get(author, "social_ln") && (
                <a href={get(author, "social_ln")}>
                  <FontAwesomeIcon
                    icon={faLinkedin}
                    style={{ width: 35, height: 35 }}
                  />
                </a>
              )}
              {get(author, "social_fb") && (
                <a target="_blank" href={get(author, "social_fb")}>
                  <FontAwesomeIcon
                    icon={faFacebook}
                    style={{ width: 35, height: 35 }}
                  />
                </a>
              )}
              {get(author, "social_web") && (
                <a target="_blank" href={get(author, "social_web")}>
                  <FontAwesomeIcon
                    icon={faGlobe}
                    style={{ width: 35, height: 35 }}
                  />
                </a>
              )}
            </div>
            {get(author, "orcid_id") && (
              <OrcIDButton orcid={get(author, "orcid_id") || ""} />
            )}
            <div className="single-blog-highlight-text-right-author">
              <Avatar
                alt="Remy Sharp"
                src={get(author, "profile_img", "")}
                className="single-blog-highlight-text-right-author-img"
              />
              <div className="single-blog-highlight-text-right-author-text">
                <p className="single-blog-highlight-text-right-author-text-name">
                  {get(author, "full_name", "")}
                </p>
                <p className="single-blog-highlight-text-right-author-text-date">
                  {new Date(get(article, "created_at", "")).toDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {isReady && (
        <div className="editorjs-wrapper">
          <Editor
            isReady={isReady}
            status={EditorStatus.IN_REVIEW}
            onChange={(
              newBlocks: BlockCategoriesToChange,
              time: number,
              version: string
            ) => {
              const blocksToAdd: BlockToServer[] = [
                ...map(newBlocks.created, (block: Block) => ({
                  ...block,
                  action: "created",
                })),
                ...map(newBlocks.changed, (block: Block) => ({
                  ...block,
                  action: "updated",
                })),
                ...map(newBlocks.deleted, (block: Block) => ({
                  ...block,
                  action: "deleted",
                })),
              ];

              updateArticleContentSilently(id, {
                time,
                version,
                blocks: blocksToAdd,
              });
            }}
          />
        </div>
      )}
      {isReviewReady && (
        <section className="single-blog-reviewer-header single-blog-reviewer-header-closed unselectable">
          {isReviewContentReady ? (
            <h2 className="single-blog-reviewer-header-title">
              Write a review
            </h2>
          ) : (
            <Button
              variant="contained"
              className="single-blog-highlight-description"
              onClick={handleCreateReviewContent}
            >
              Create a review
            </Button>
          )}
        </section>
      )}
      {isReviewReady && isReviewContentReady && (
        <div className="editorjs-wrapper">
          <ReviewEditor
            isReady={isReady}
            userId={get(user, "id", 1)}
            status={EditorStatus.REVIEW_PANE}
            onChange={(
              newBlocks: BlockCategoriesToChange,
              time: number,
              version: string
            ) => {
              const blocksToAdd: BlockToServer[] = [
                ...map(newBlocks.created, (block: Block) => ({
                  ...block,
                  action: "created",
                })),
                ...map(newBlocks.changed, (block: Block) => ({
                  ...block,
                  action: "updated",
                })),
                ...map(newBlocks.deleted, (block: Block) => ({
                  ...block,
                  action: "deleted",
                })),
              ];

              updateArticleContentSilently(articleReviewContent.id, {
                time,
                version,
                blocks: blocksToAdd,
              });
            }}
          />
        </div>
      )}
      {showReviews &&
        allReviews &&
        map(allReviews, (reviewer) => (
          <Fragment key={reviewer.id}>
            <section className="single-blog-reviewer-header">
              <h2 className="single-blog-reviewer-header-title">
                {" "}
                {get(reviewer, "full_name", "")}
              </h2>
              <div className="single-blog-reviewer-header-right">
                <p className="single-blog-reviewer-header-right-label">
                  Review #{get(reviewer, "review_id", "")}
                </p>
                <p className="single-blog-reviewer-header-right-status">
                  <Chip
                    label={camelCase(get(reviewer, "status", ""))}
                    variant="default"
                    color="primary"
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
          </Fragment>
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

export default Blogs;
