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
import { User } from "../user/types";

const articleSelectors = {
  article: (state: ReduxState): Article | null => state.article.oneArticle,
  userReview: (state: ReduxState, userId: number): User | undefined =>
    find(
      state.article.oneArticle?.reviewers,
      (reviewer) => reviewer.user_id === userId
    ),
  articleContent: (state: ReduxState): ArticleContent | undefined =>
    get(state.article.oneArticle, "content"),
  getUsersArticles: (state: ReduxState): any =>
    filter(
      state.article.allArticles,
      (article) =>
        !article.user_review_id &&
        (article.author.id === state.user.profile?.id ||
          article.reviewers?.some(
            (reviewer: any) => reviewer.user_id === state.user.profile?.id
          ))
    ),
  getBlocks: (state: ReduxState): Blocks | undefined =>
    get(state.article.oneArticle, "content.blocks"),
  getAllArticles: (state: ReduxState): any => state.article.allArticles,
  getPublishedArticles: (state: ReduxState): Article[] =>
    filter(
      state.article.allArticles,
      (article) => article.status === "published"
    ),
  getCategories: (state: ReduxState): any => state.article.categories,
  getReviews: (state: ReduxState): any => state.article.reviews,
  getTags: (state: ReduxState): Tags => state.article.tags,
  getVersions: (state: ReduxState): any => get(state.article, "versions", []),
  getActiveBlock: (state: ReduxState): any => state.article.activeBlock,
  getCriticalSectionIds: (state: ReduxState): any =>
    get(state.article, "critical_section_ids", []),
  getBlockIdQueue: (state: ReduxState): BlockIdQueue =>
    state.article.blockIdQueue,
  getActiveSections: (state: ReduxState): ActiveSections =>
    get(state.article, "activeSections") || {},
  getReviewers: (state: ReduxState): any => get(state.article, "reviewers", []),
};

export default articleSelectors;
