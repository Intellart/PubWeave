import { OutputData } from "@editorjs/editorjs";
import * as API from "../../api";
import { ReduxAction } from "../../types";
import { ArticleContentToServer, articleTypes as types } from "./types";
import { EditorEvent } from "../../components/editor/Editor";

const articleActions = {
  wsLockBlock: (payload: any): ReduxAction => ({
    type: types.WS_LOCK_SECTION,
    payload,
  }),
  wsUnlockBlock: (payload: any): ReduxAction => ({
    type: types.WS_UNLOCK_SECTION,
    payload,
  }),
  lockSection: (userId: number, sectionId: string): ReduxAction => ({
    type: types.ART_LOCK_SECTION,
    payload: API.putRequest(`pubweave/sections/${sectionId}/lock`, {
      user_id: userId,
      section_id: sectionId,
    }),
  }),
  fetchReviews: (articleId: number): ReduxAction => ({
    type: types.ART_FETCH_REVIEWS,
    payload: API.getRequest(`pubweave/reviews?article_id=${articleId}`),
  }),
  newReview: (
    amount: number,
    articleId: number,
    deadline: string,
    reviewers: Array<number>
  ): ReduxAction => ({
    type: types.ART_CREATE_REVIEW,
    payload: API.postRequest("pubweave/reviews", {
      review: {
        amount,
        article_id: articleId,
        deadline,
        user_ids: reviewers,
      },
    }),
  }),
  deleteReview: (reviewId: number): ReduxAction => ({
    type: types.ART_DELETE_REVIEWS,
    payload: API.deleteRequest(`pubweave/reviews/${reviewId}`),
  }),
  unlockSection: (userId: number, sectionId: string): ReduxAction => ({
    type: types.ART_UNLOCK_SECTION,
    payload: API.putRequest(`pubweave/sections/${sectionId}/unlock`, {
      user_id: userId,
      section_id: sectionId,
    }),
  }),
  unlockArticle: (articleId: number): ReduxAction => ({
    type: types.ART_UNLOCK_ARTICLE,
    payload: API.putRequest(`pubweave/articles/${articleId}/unlock_article`),
  }),
  wsUpdateBlock: (payload: any, userId: number): ReduxAction => ({
    type: types.WS_BLOCK_UPDATE,
    payload: {
      payload,
      userId,
    },
  }),
  wsCreateBlock: (payload: any, userId: number): ReduxAction => ({
    type: types.WS_BLOCK_CREATE,
    payload: {
      payload,
      userId,
    },
  }),
  wsRemoveBlock: (payload: any, userId: number): ReduxAction => ({
    type: types.WS_BLOCK_REMOVE,
    payload: {
      payload,
      userId,
    },
  }),
  blockIdQueueAdd: (
    blockId: string,
    blockAction: "updated" | "created" | "deleted"
  ): ReduxAction => ({
    type: types.BLOCK_ID_QUEUE_ADD,
    payload: {
      blockId,
      blockAction,
    },
  }),
  blockIdQueueRemove: (
    blockId: string,
    blockAction: "updated" | "created" | "deleted"
  ): ReduxAction => ({
    type: types.BLOCK_ID_QUEUE_REMOVE,
    payload: {
      blockId,
      blockAction,
    },
  }),
  blockIdQueueComplete: (
    blockId: string,
    blockAction: "updated" | "created" | "deleted"
  ): ReduxAction => ({
    type: types.BLOCK_ID_QUEUE_COMPLETE,
    payload: {
      blockId,
      blockAction,
    },
  }),

  setActiveBlock: (blockId: string | null): ReduxAction => ({
    type: types.BLOCK_SET_ACTIVE_BLOCK,
    payload: {
      id: blockId,
    },
  }),
  fetchVersions: (id: string): ReduxAction => ({
    type: types.ART_FETCH_VERSIONS,
    payload: API.getRequest(`pubweave/sections/${id}/version_data`),
  }),
  fetchArticle: (id: number | string): ReduxAction => ({
    type: types.ART_FETCH_ARTICLE,
    payload: API.getRequest(`pubweave/articles/${id}`),
  }),
  fetchAllArticles: (): ReduxAction => ({
    type: types.ART_FETCH_ALL_ARTICLES,
    payload: API.getRequest("pubweave/articles"),
  }),
  fetchAllReviewers: (): ReduxAction => ({
    type: types.ART_FETCH_ALL_REVIEWERS,
    payload: API.getRequest("intellart/users/reviewers"),
  }),
  likeComment: (commentId: number): ReduxAction => ({
    type: types.ART_LIKE_COMMENT,
    payload: API.putRequest(`pubweave/comments/${commentId}/like`),
  }),
  unlikeComment: (commentId: number): ReduxAction => ({
    type: types.ART_UNLIKE_COMMENT,
    payload: API.putRequest(`pubweave/comments/${commentId}/dislike`),
  }),
  deleteComment: (commentId: number): ReduxAction => ({
    type: types.ART_DELETE_COMMENT,
    payload: API.deleteRequest(`pubweave/comments/${commentId}`),
  }),
  flushArticle: (): ReduxAction => ({
    type: types.ART_FLUSH_ARTICLE,
  }),
  fetchCategories: (): ReduxAction => ({
    type: types.ART_FETCH_CATEGORIES,
    payload: API.getRequest("categories"),
  }),
  addTag: (id: number, tagId: number): ReduxAction => ({
    type: types.ART_ADD_TAG,
    payload: API.postRequest(`pubweave/articles/${id}/add_tag`, {
      article: {
        tag_id: tagId,
      },
    }),
  }),
  removeTag: (id?: string, tagId?: number): ReduxAction => ({
    type: types.ART_REMOVE_TAG,
    payload: API.putRequest(`pubweave/articles/${id}/remove_tag`, {
      article: {
        tag_id: tagId,
      },
    }),
  }),
  fetchTags: (): ReduxAction => ({
    type: types.ART_FETCH_TAGS,
    payload: API.getRequest("tags"),
  }),
  createComment: (
    articleId: number,
    userId: number,
    content: string,
    replyTo?: number
  ): ReduxAction => ({
    type: types.ART_CREATE_COMMENT,
    payload: API.postRequest("pubweave/comments", {
      comment: {
        article_id: articleId,
        commenter_id: userId,
        comment: content,
        reply_to_id: replyTo,
      },
    }),
  }),
  addCollaborator: (articleId: number, userEmail: string): ReduxAction => ({
    type: types.ART_ADD_COLLABORATOR,
    payload: API.putRequest(`pubweave/articles/${articleId}/add_collaborator`, {
      article: {
        collaborator_email: userEmail,
      },
    }),
  }),
  createArticle: (userId: number, userReviewId?: number): ReduxAction => ({
    type: types.ART_CREATE_ARTICLE,
    payload: API.postRequest("pubweave/articles", {
      author_id: userId,
      title: userReviewId ? "New review" : "New article",
      content: {
        time: 0,
        blocks: [],
      },
      ...(userReviewId ? { user_review_id: userReviewId } : {}),
    }),
  }),
  likeArticle: (articleId: number): ReduxAction => ({
    type: types.ART_LIKE_ARTICLE,
    payload: API.putRequest(`pubweave/articles/${articleId}/like`),
  }),
  likeArticleRemoval: (articleId: number): ReduxAction => ({
    type: types.ART_LIKE_ARTICLE_REMOVAL,
    payload: API.putRequest(`pubweave/articles/${articleId}/like`),
  }),
  updateArticle: (id?: number | string, payload?: any): ReduxAction => ({
    type: types.ART_UPDATE_ARTICLE,
    payload: API.putRequest(`pubweave/articles/${id}`, {
      article: {
        ...payload,
      },
    }),
  }),
  updateArticleContentSilently: (
    id?: number | string,
    newArticleContent?: ArticleContentToServer
  ): ReduxAction => ({
    type: types.ART_UPDATE_ARTICLE_CONTENT,
    payload: API.putRequest(`pubweave/articles/${id}`, {
      article: {
        content: newArticleContent,
      },
    }),
  }),
  updateArticleContentSilentlyNew: (
    id?: number | string,
    outputData?: OutputData & { events?: EditorEvent[] }
  ): ReduxAction => ({
    type: types.ART_UPDATE_ARTICLE_CONTENT_NEW,
    payload: API.putRequest(`pubweave/articles/${id}/update_all_sections`, {
      article: {
        content: outputData,
      },
    }),
  }),

  deleteArticle: (id: number): ReduxAction => ({
    type: types.ART_DELETE_ARTICLE,
    payload: API.deleteRequest(`pubweave/articles/${id}`),
  }),
  convertArticle: (id: number): ReduxAction => ({
    type: types.ART_CONVERT_ARTICLE,
    payload: API.putRequest(`pubweave/articles/${id}/convert`),
  }),
  acceptUserReview: (userReviewId: number): ReduxAction => ({
    type: types.ART_USER_REVIEW_ACCEPT,
    payload: API.putRequest(
      `pubweave/user_reviews/${userReviewId}/accept_review`
    ),
  }),
  rejectUserReview: (userReviewId: number): ReduxAction => ({
    type: types.ART_USER_REVIEW_REJECT,
    payload: API.putRequest(
      `pubweave/user_reviews/${userReviewId}/reject_review`
    ),
  }),
  publishArticle: (id: number, newStatus: string): ReduxAction => {
    // console.log('publishing article', id, newStatus);

    let route = "";
    if (newStatus === "published") {
      route = `pubweave/articles/${id}/accept_publishing`;
    } else if (newStatus === "rejected") {
      route = `pubweave/articles/${id}/reject_publishing`;
    } else if (newStatus === "requested") {
      route = `pubweave/articles/${id}/request_publishing`;
    }

    return {
      type: types.ART_PUBLISH_ARTICLE,
      payload: API.putRequest(route, {
        article: {
          status: newStatus,
        },
      }),
    };
  },
};

export default articleActions;
