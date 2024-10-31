import { filter, find, get } from "lodash";
import { ReduxState } from "../../types";
import {
  ActiveSections,
  Article,
  ArticleContent,
  BlockIdQueue,
  Blocks,
  Tags,
} from "./types";

const articleSelectors = {
  article: (state: ReduxState) => state.article.oneArticle,
  userReviewers: (state: ReduxState) => state.article.oneArticle?.reviewers,
  articleContent: (state: ReduxState): ArticleContent | undefined =>
    get(state.article.oneArticle, "content"),
  getUsersArticles: (state: ReduxState) =>
    filter(
      state.article.allArticles,
      (article) =>
        !article.user_review_id &&
        (article.author.id === state.user.profile?.id ||
          article.reviewers?.some(
            (reviewer) => reviewer.user_id === state.user.profile?.id
          ))
    ),
  getBlocks: (state: ReduxState): Blocks | undefined =>
    get(state.article.oneArticle, "content.blocks"),
  getAllArticles: (state: ReduxState) => state.article.allArticles,
  getPublishedArticles: (state: ReduxState): Article[] =>
    filter(
      state.article.allArticles,
      (article) => article.status === "published"
    ),
  getCategories: (state: ReduxState) => state.article.categories,
  getReviews: (state: ReduxState) => state.article.reviews,
  getTags: (state: ReduxState): Tags => state.article.tags,
  getVersions: (state: ReduxState) => get(state.article, "versions", []),
  getActiveBlock: (state: ReduxState) => state.article.activeBlock,
  getCriticalSectionIds: (state: ReduxState) =>
    get(state.article, "critical_section_ids", []),
  getBlockIdQueue: (state: ReduxState): BlockIdQueue =>
    state.article.blockIdQueue,
  getActiveSections: (state: ReduxState): ActiveSections =>
    get(state.article, "activeSections") || {},
  getReviewers: (state: ReduxState) => get(state.article, "reviewers", []),
};

export default articleSelectors;
