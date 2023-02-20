/* eslint-disable no-console */
// @flow
// import React from 'react';
import {
  filter, keyBy, omit, get, map,
} from 'lodash';
import { toast } from 'react-toastify';
import * as API from '../api';
import type { ReduxAction, ReduxActionWithPayload, ReduxState } from '../types';
import type { User } from './userStore';

export type ArticleContent = {
  blocks: Array<Object>,
  time: number,
  version: string,
};

export type Comment = {
  id: number,
  comment: string,
  likes: number,
  dislikes: number,
  created_at: string,
  updated_at: string,
  replies: { [number]: Comment },
  reply_to: number,
};

export type Category = {
  id: number,
  category_name: string,
};

export type Tag = {
  id: number,
  tag: string,
  category: Category,
  created_at: string,
  updated_at: string,
};

export type Article = {
  id: number,
  title: string,
  subtitle: string,
  content: ArticleContent,
  user: User,
  likes: Array<Object>,
  status: string,
  description: string,
  image: string,
  star: boolean,
  category: string,
  created_at: string,
  updated_at: string,
  blog_article_comments: { [number]: Comment },
  tags: Array<any>,
};

export type State = {
  oneArticle: Article,
  allArticles: { [number]: Article },
  comments: { [number]: Comment },
  categories: { [string]: Category },
  tags: { [number]: Tag },
};

export const types = {
  ART_FETCH_ARTICLE: 'ART/FETCH_ARTICLE',
  ART_FETCH_ARTICLE_PENDING: 'ART/FETCH_ARTICLE_PENDING',
  ART_FETCH_ARTICLE_REJECTED: 'ART/FETCH_ARTICLE_REJECTED',
  ART_FETCH_ARTICLE_FULFILLED: 'ART/FETCH_ARTICLE_FULFILLED',

  ART_FETCH_ALL_ARTICLES: 'ART/FETCH_ALL_ARTICLES',
  ART_FETCH_ALL_ARTICLES_PENDING: 'ART/FETCH_ALL_ARTICLES_PENDING',
  ART_FETCH_ALL_ARTICLES_REJECTED: 'ART/FETCH_ALL_ARTICLES_REJECTED',
  ART_FETCH_ALL_ARTICLES_FULFILLED: 'ART/FETCH_ALL_ARTICLES_FULFILLED',

  ART_UPDATE_ARTICLE: 'ART/UPDATE_ARTICLE',
  ART_UPDATE_ARTICLE_PENDING: 'ART/UPDATE_ARTICLE_PENDING',
  ART_UPDATE_ARTICLE_REJECTED: 'ART/UPDATE_ARTICLE_REJECTED',
  ART_UPDATE_ARTICLE_FULFILLED: 'ART/UPDATE_ARTICLE_FULFILLED',

  ART_CREATE_ARTICLE: 'ART/CREATE_ARTICLE',
  ART_CREATE_ARTICLE_PENDING: 'ART/CREATE_ARTICLE_PENDING',
  ART_CREATE_ARTICLE_REJECTED: 'ART/CREATE_ARTICLE_REJECTED',
  ART_CREATE_ARTICLE_FULFILLED: 'ART/CREATE_ARTICLE_FULFILLED',

  ART_DELETE_ARTICLE: 'ART/DELETE_ARTICLE',
  ART_DELETE_ARTICLE_PENDING: 'ART/DELETE_ARTICLE_PENDING',
  ART_DELETE_ARTICLE_REJECTED: 'ART/DELETE_ARTICLE_REJECTED',
  ART_DELETE_ARTICLE_FULFILLED: 'ART/DELETE_ARTICLE_FULFILLED',

  ART_PUBLISH_ARTICLE: 'ART/PUBLISH_ARTICLE',
  ART_PUBLISH_ARTICLE_PENDING: 'ART/PUBLISH_ARTICLE_PENDING',
  ART_PUBLISH_ARTICLE_REJECTED: 'ART/PUBLISH_ARTICLE_REJECTED',
  ART_PUBLISH_ARTICLE_FULFILLED: 'ART/PUBLISH_ARTICLE_FULFILLED',

  ART_UPDATE_ARTICLE_CONTENT: 'ART/UPDATE_ARTICLE_CONTENT',
  ART_UPDATE_ARTICLE_CONTENT_PENDING: 'ART/UPDATE_ARTICLE_CONTENT_PENDING',
  ART_UPDATE_ARTICLE_CONTENT_REJECTED: 'ART/UPDATE_ARTICLE_CONTENT_REJECTED',
  ART_UPDATE_ARTICLE_CONTENT_FULFILLED: 'ART/UPDATE_ARTICLE_CONTENT_FULFILLED',

  ART_FETCH_COMMENTS: 'ART/FETCH_COMMENTS',
  ART_FETCH_COMMENTS_PENDING: 'ART/FETCH_COMMENTS_PENDING',
  ART_FETCH_COMMENTS_REJECTED: 'ART/FETCH_COMMENTS_REJECTED',
  ART_FETCH_COMMENTS_FULFILLED: 'ART/FETCH_COMMENTS_FULFILLED',

  ART_FETCH_CATEGORIES: 'ART/FETCH_CATEGORIES',
  ART_FETCH_CATEGORIES_PENDING: 'ART/FETCH_CATEGORIES_PENDING',
  ART_FETCH_CATEGORIES_REJECTED: 'ART/FETCH_CATEGORIES_REJECTED',
  ART_FETCH_CATEGORIES_FULFILLED: 'ART/FETCH_CATEGORIES_FULFILLED',

  ART_CREATE_COMMENT: 'ART/CREATE_COMMENT',
  ART_CREATE_COMMENT_PENDING: 'ART/CREATE_COMMENT_PENDING',
  ART_CREATE_COMMENT_REJECTED: 'ART/CREATE_COMMENT_REJECTED',
  ART_CREATE_COMMENT_FULFILLED: 'ART/CREATE_COMMENT_FULFILLED',

  ART_FETCH_TAGS: 'ART/FETCH_TAGS',
  ART_FETCH_TAGS_PENDING: 'ART/FETCH_TAGS_PENDING',
  ART_FETCH_TAGS_REJECTED: 'ART/FETCH_TAGS_REJECTED',
  ART_FETCH_TAGS_FULFILLED: 'ART/FETCH_TAGS_FULFILLED',

  ART_FLUSH_ARTICLE: 'ART/FLUSH_ARTICLE',
  ART_FLUSH_ARTICLE_PENDING: 'ART/FLUSH_ARTICLE_PENDING',
  ART_FLUSH_ARTICLE_REJECTED: 'ART/FLUSH_ARTICLE_REJECTED',
  ART_FLUSH_ARTICLE_FULFILLED: 'ART/FLUSH_ARTICLE_FULFILLED',

  ART_ADD_TAG: 'ART/ADD_TAG',
  ART_ADD_TAG_PENDING: 'ART/ADD_TAG_PENDING',
  ART_ADD_TAG_REJECTED: 'ART/ADD_TAG_REJECTED',
  ART_ADD_TAG_FULFILLED: 'ART/ADD_TAG_FULFILLED',

  ART_REMOVE_TAG: 'ART/REMOVE_TAG',
  ART_REMOVE_TAG_PENDING: 'ART/REMOVE_TAG_PENDING',
  ART_REMOVE_TAG_REJECTED: 'ART/REMOVE_TAG_REJECTED',
  ART_REMOVE_TAG_FULFILLED: 'ART/REMOVE_TAG_FULFILLED',

  ART_LIKE_ARTICLE: 'ART/LIKE_ARTICLE',
  ART_LIKE_ARTICLE_PENDING: 'ART/LIKE_ARTICLE_PENDING',
  ART_LIKE_ARTICLE_REJECTED: 'ART/LIKE_ARTICLE_REJECTED',
  ART_LIKE_ARTICLE_FULFILLED: 'ART/LIKE_ARTICLE_FULFILLED',

  ART_LIKE_ARTICLE_REMOVAL: 'ART/LIKE_ARTICLE_REMOVAL',
  ART_LIKE_ARTICLE_REMOVAL_PENDING: 'ART/LIKE_ARTICLE_REMOVAL_PENDING',
  ART_LIKE_ARTICLE_REMOVAL_REJECTED: 'ART/LIKE_ARTICLE_REMOVAL_REJECTED',
  ART_LIKE_ARTICLE_REMOVAL_FULFILLED: 'ART/LIKE_ARTICLE_REMOVAL_FULFILLED',

  ART_LIKE_COMMENT: 'ART/LIKE_COMMENT',
  ART_LIKE_COMMENT_PENDING: 'ART/LIKE_COMMENT_PENDING',
  ART_LIKE_COMMENT_REJECTED: 'ART/LIKE_COMMENT_REJECTED',
  ART_LIKE_COMMENT_FULFILLED: 'ART/LIKE_COMMENT_FULFILLED',

  ART_UNLIKE_COMMENT: 'ART/UNLIKE_COMMENT',
  ART_UNLIKE_COMMENT_PENDING: 'ART/UNLIKE_COMMENT_PENDING',
  ART_UNLIKE_COMMENT_REJECTED: 'ART/UNLIKE_COMMENT_REJECTED',
  ART_UNLIKE_COMMENT_FULFILLED: 'ART/UNLIKE_COMMENT_FULFILLED',

  ART_DELETE_COMMENT: 'ART/DELETE_COMMENT',
  ART_DELETE_COMMENT_PENDING: 'ART/DELETE_COMMENT_PENDING',
  ART_DELETE_COMMENT_REJECTED: 'ART/DELETE_COMMENT_REJECTED',
  ART_DELETE_COMMENT_FULFILLED: 'ART/DELETE_COMMENT_FULFILLED',

};

export const selectors = {
  article: (state: ReduxState): any => state.article.oneArticle,
  articleContent: (state: ReduxState): any => get(state.article.oneArticle, 'content'),
  getUsersArticles: (state: ReduxState): any => filter(state.article.allArticles, (article) => article.user.id === state.user.profile?.id),
  getAllArticles: (state: ReduxState): any => state.article.allArticles,
  getPublishedArticles: (state: ReduxState): any => filter(state.article.allArticles, (article) => article.status === 'published'),
  getCategories: (state: ReduxState): any => state.article.categories,
  getTags: (state: ReduxState): any => state.article.tags,
};

export const actions = {
  fetchArticle: (id: number): ReduxAction => ({
    type: types.ART_FETCH_ARTICLE,
    payload: API.getRequest(`pubweave/blog_articles/${id}`),
  }),
  fetchAllArticles: (): ReduxAction => ({
    type: types.ART_FETCH_ALL_ARTICLES,
    payload: API.getRequest('pubweave/blog_articles'),
  }),
  fetchComments: (): ReduxAction => ({
    type: types.ART_FETCH_COMMENTS,
    payload: API.getRequest('pubweave/blog_article_comments'),
  }),
  likeComment: (commentId: number, userId: number): ReduxAction => ({
    type: types.ART_LIKE_COMMENT,
    payload: API.postRequest('pubweave/blog_article_comment_likes', {
      like: {
        blog_article_comment_id: commentId,
        user_id: userId,
      },
    }),
  }),
  deleteComment: (commentId: number): ReduxAction => ({
    type: types.ART_DELETE_COMMENT,
    payload: API.deleteRequest(`pubweave/blog_article_comments/${commentId}`),
  }),
  unlikeComment: (commentId: number): ReduxAction => ({
    type: types.ART_UNLIKE_COMMENT,
    payload: API.deleteRequest(`pubweave/blog_article_comment_likes/${commentId}`),
  }),
  flushArticle: (): ReduxAction => ({
    type: types.ART_FLUSH_ARTICLE,
  }),
  fetchCategories: (): ReduxAction => ({
    type: types.ART_FETCH_CATEGORIES,
    payload: API.getRequest('categories'),
  }),
  addTag: (articleId: number, tagId: number): ReduxAction => ({
    type: types.ART_ADD_TAG,
    payload: API.postRequest('pubweave/blog_article_tags', {
      blog_article_tag: {
        blog_article_id: articleId,
        tag_id: tagId,
      },
    }),
  }),
  removeTag: (articleTagId: number): ReduxAction => ({
    type: types.ART_REMOVE_TAG,
    payload: API.deleteRequest(`pubweave/blog_article_tags/${articleTagId}`),
  }),
  fetchTags: (): ReduxAction => ({
    type: types.ART_FETCH_TAGS,
    payload: API.getRequest('tags'),
  }),
  createComment: (articleId: number, userId: number, content: string, replyTo: number): ReduxAction => ({
    type: types.ART_CREATE_COMMENT,
    payload: API.postRequest('pubweave/blog_article_comments',
      {
        blog_article_comment: {
          blog_article_id: articleId,
          commenter_id: userId,
          comment: content,
          reply_to_id: replyTo,
        },
      }),
  }),

  createArticle: (userId : number): ReduxAction => ({
    type: types.ART_CREATE_ARTICLE,
    payload: API.postRequest('pubweave/blog_articles',
      {
        user_id: userId,
        title: 'New article',
        content: JSON.stringify({
          time: 0,
          blocks: [
            {
              id: 'Y3pS0lTILC',
              data: {
                text: 'Start your article.',
              },
              type: 'paragraph',
            },
          ],
        }),
      }),
  }),
  likeArticle: (articleId: number, userId: number): ReduxAction => ({
    type: types.ART_LIKE_ARTICLE,
    payload: API.postRequest('pubweave/blog_article_likes',
      {
        like: {
          user_id: userId,
          blog_article_id: articleId,
        },
      }),
  }),
  likeArticleRemoval: (likeArticleLink: number): ReduxAction => ({
    type: types.ART_LIKE_ARTICLE_REMOVAL,
    payload: API.deleteRequest(`pubweave/blog_article_likes/${likeArticleLink}`),
  }),
  updateArticle: (id: number, payload: any): ReduxAction => ({
    type: types.ART_UPDATE_ARTICLE,
    payload: API.putRequest(`pubweave/blog_articles/${id}`,
      {
        blog_article: {
          ...payload,
        },
      }),
  }),

  updateArticleContentSilently: (id: number, newArticleContent: ArticleContent): ReduxAction => ({
    type: types.ART_UPDATE_ARTICLE_CONTENT,
    payload: API.putRequest(`pubweave/blog_articles/${id}`,
      {
        blog_article: {
          content: JSON.stringify(newArticleContent),
        },
      }),
  }),

  deleteArticle: (id: number): ReduxAction => ({
    type: types.ART_DELETE_ARTICLE,
    payload: API.deleteRequest(`pubweave/blog_articles/${id}`),
  }),
  // this will be handled by Admin from the backend, see publish and reject actions
  publishArticle: (id: number, newStatus: string): ReduxAction => {
    console.log('publishing article', id, newStatus);

    let route = '';
    if (newStatus === 'published') {
      route = `pubweave/blog_articles/${id}/accept_publishing`;
    } else if (newStatus === 'rejected') {
      route = `pubweave/blog_articles/${id}/reject_publishing`;
    } else if (newStatus === 'requested') {
      route = `pubweave/blog_articles/${id}/request_publishing`;
    }

    return {
      type: types.ART_PUBLISH_ARTICLE,
      payload: API.putRequest(route,
        {
          blog_article: {
            status: newStatus,
          },
        }),
    };
  },

};

export const reducer = (state: State, action: ReduxActionWithPayload): State => {
  switch (action.type) {
    case types.ART_FLUSH_ARTICLE_FULFILLED:
      toast.success('Article flushed.');

      return {
        ...state,
        oneArticle: {},
      };

    case types.ART_FETCH_ARTICLE_FULFILLED:

      return {
        ...state,
        oneArticle: {
          ...action.payload,
          content: JSON.parse(get(action.payload, 'content', '{}')),
          blog_article_comments: keyBy(get(action.payload, 'blog_article_comments', []), 'id'),
          tags: map(get(action.payload, 'tags', []), (t) => ({
            blog_article_id: t.blog_article_id,
            category_id: t.category_id,
            id: null,
            article_tag_link: t.id,
            tag_name: t.tag_name,
          })),
        },
      };

    case types.ART_FETCH_ALL_ARTICLES_FULFILLED:
      // eslint-disable-next-line no-console
      console.log(`Fetched all articles: ${get(action.payload, 'length')} articles.`);

      return {
        ...state,
        allArticles: keyBy(action.payload, 'id'),
      };

      // COMMENTS ---------------------------------------------------------
      // ------------------------------------------------------------------

    case types.ART_CREATE_COMMENT_FULFILLED:
      toast.success('Comment created successfully!');

      return {
        ...state,
        oneArticle: {
          ...state.oneArticle,
          blog_article_comments: {
            ...state.oneArticle.blog_article_comments,
            [action.payload.id]: action.payload,
          },
        },
      };

    case types.ART_DELETE_COMMENT_FULFILLED:
      toast.success('Comment deleted successfully!');
      console.log('delete', action.payload);

      return {
        ...state,
        oneArticle: {
          ...state.oneArticle,
          blog_article_comments: omit(state.oneArticle.blog_article_comments, action.payload),
        },
      };

      // COMMENT LIKES ------------------------------------------------------
      // --------------------------------------------------------------------

    case types.ART_LIKE_COMMENT_FULFILLED:
      toast.success('Comment liked successfully!');
      console.log('like', action.payload);

      return {
        ...state,
        oneArticle: {
          ...state.oneArticle,
          blog_article_comments: {
            ...state.oneArticle.blog_article_comments,
            [action.payload.id]: {
              ...state.oneArticle.blog_article_comments[action.payload.id],
              likes: action.payload.likes,
            },
          },
        },
      };

    case types.ART_UNLIKE_COMMENT_FULFILLED:
      toast.success('Comment unliked successfully!');
      console.log('unlike', action.payload);

      return {
        ...state,
        oneArticle: {
          ...state.oneArticle,
          blog_article_comments: {
            ...state.oneArticle.blog_article_comments,
            [action.payload.id]: {
              ...state.oneArticle.blog_article_comments[action.payload.id],
              likes: action.payload.likes,
            },
          },
        },
      };

      // LIKES --------------------------------------------------------------
      // --------------------------------------------------------------------

    case types.ART_LIKE_ARTICLE_FULFILLED:
      toast.success('Article liked successfully!');
      console.log('like', action.payload);

      return {
        ...state,
        oneArticle: {
          ...state.oneArticle,
          likes: action.payload.likes,
        },
      };

    case types.ART_LIKE_ARTICLE_REMOVAL_FULFILLED:
      toast.success('Article unliked successfully!');
      console.log('unlike', action.payload);

      return {
        ...state,
        oneArticle: {
          ...state.oneArticle,
          likes: action.payload.likes,
        },
      };

      // CATEGORIES ---------------------------------------------------------
      // --------------------------------------------------------------------

    case types.ART_FETCH_CATEGORIES_FULFILLED:
      // eslint-disable-next-line no-console
      console.log(`Fetched all categories: ${get(action.payload, 'length')} categories.`);

      return {
        ...state,
        categories: keyBy(action.payload, 'id'),
      };

      // TAGS ---------------------------------------------------------------
      // --------------------------------------------------------------------

    case types.ART_FETCH_TAGS_FULFILLED:
      // eslint-disable-next-line no-console
      console.log(`Fetched all tags: ${get(action.payload, 'length')} tags.`);

      // console.log(keyBy(map(action.payload, (tag) => ({
      //   tag_name: tag.tag,
      //   category_id: tag.category_id,
      //   id: tag.id,
      // })), 'id'));

      return {
        ...state,
        tags: keyBy(map(action.payload, (tag) => ({
          tag_name: tag.tag,
          category_id: tag.category_id,
          id: tag.id,
        })), 'id'),
      };

    case types.ART_FETCH_TAGS_REJECTED:
      toast.error('Error while fetching tags!');

      return state;

    case types.ART_ADD_TAG_FULFILLED:
      toast.success('Tag added successfully!');

      return {
        ...state,
        oneArticle: {
          ...state.oneArticle,
          tags: [
            ...state.oneArticle.tags,
            {
              id: action.payload.tag.id,
              article_tag_link: action.payload.id,
              tag_name: action.payload.tag_name,
              category_id: action.payload.category_id,
              blog_article_id: action.payload.blog_article_id,
            },
          ],
        },
      };

    case types.ART_REMOVE_TAG_FULFILLED:
      const removedId: number = action.payload;
      toast.success('Tag removed successfully!');

      return {
        ...state,
        oneArticle: {
          ...state.oneArticle,
          tags: filter(state.oneArticle.tags, (tag) => tag.article_tag_link !== removedId),
        },
      };

      // ARTICLE ------------------------------------------------------------
      // --------------------------------------------------------------------

    case types.ART_UPDATE_ARTICLE_FULFILLED:
      toast.success(`Changed article ${action.payload.title} successfully!`);

      return {
        ...state,
        oneArticle: {
          ...state.oneArticle,
          ...action.payload,
          content: get(state.oneArticle, 'content'),
        },
        allArticles: {
          ...state.allArticles,
          [action.payload.id]: {
            ...state.allArticles[action.payload.id],
            ...action.payload,
          },
        },
      };

    case types.ART_CREATE_ARTICLE_FULFILLED:
      toast.success(`Created article ${action.payload.title} successfully!`);

      return {
        ...state,
        // allArticles: [...state.allArticles, action.payload],
        allArticles: {
          ...state.allArticles,
          [action.payload.id]: action.payload,
        },
      };

    case types.ART_DELETE_ARTICLE_FULFILLED:
      toast.success(`Deleted article ${action.payload.title} successfully!`);

      return {
        ...state,
        allArticles: omit(state.allArticles, action.payload.id),
      };

    case types.ART_PUBLISH_ARTICLE_FULFILLED:
      toast.success(`Changed status of ${action.payload.title} to ${action.payload.status}.`);

      return {
        ...state,
        oneArticle: {
          ...state.oneArticle,
          ...action.payload,
        },
        allArticles: {
          ...state.allArticles,
          [action.payload.id]: {
            ...state.allArticles[action.payload.id],
            ...action.payload,
          },
        },
      };

    case types.ART_UPDATE_ARTICLE_REJECTED:
      toast.error('Error while updating article!');

      return {
        ...state,
      };

      // ARTICLE CONTENT ----------------------------------------------------
      // --------------------------------------------------------------------
    case types.ART_UPDATE_ARTICLE_CONTENT_FULFILLED:
      return {
        ...state,
        oneArticle: {
          ...state.oneArticle,
          content: JSON.parse(get(action.payload, 'content', '{}') || '{}'),
        },
      };

    default:
      return state || {};
  }
};
