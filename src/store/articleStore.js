/* eslint-disable no-console */
// @flow
// import React from 'react';
import {
  filter, keyBy, omit, get, map, sample,
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
  likes: number,
  status: string,
  description: string,
  image: string,
  star: boolean,
  category: string,
  created_at: string,
  updated_at: string,
  blog_article_comments: { [number]: Comment },
  tags: Array<string>,
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

};

export const selectors = {
  article: (state: ReduxState): any => state.article.oneArticle,
  articleContent: (state: ReduxState): any => get(state.article.oneArticle, 'content'),
  getUsersArticles: (state: ReduxState): any => filter(state.article.allArticles, (article) => article.user.id === state.user.profile?.id),
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
  flushArticle: (): ReduxAction => ({
    type: types.ART_FLUSH_ARTICLE,
  }),
  fetchCategories: (): ReduxAction => ({
    type: types.ART_FETCH_CATEGORIES,
    payload: API.getRequest('intellart/categories'),
  }),
  fetchTags: (): ReduxAction => ({
    type: types.ART_FETCH_TAGS,
    payload: API.getRequest('intellart/tags'),
  }),
  createComment: (articleId: number, userId: number, content: string): ReduxAction => ({
    type: types.ART_CREATE_COMMENT,
    payload: API.postRequest('pubweave/blog_article_comments',
      {
        blog_article_comment: {
          blog_article_id: articleId,
          commenter_id: userId,
          comment: content,
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
  publishArticle: (id: number, newStatus: string): ReduxAction => ({
    type: types.ART_PUBLISH_ARTICLE,
    payload: API.putRequest(`pubweave/blog_articles/${id}`,
      {
        blog_article: {
          status: newStatus,
        },
      }),
  }),

};

export const reducer = (state: State, action: ReduxActionWithPayload): State => {
  switch (action.type) {
    case types.ART_FLUSH_ARTICLE_FULFILLED:
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
        },
      };

    case types.ART_FETCH_ALL_ARTICLES_FULFILLED:
      console.log(`Fetched all articles: ${get(action.payload, 'length')} articles.`);

      return {
        ...state,
        allArticles: keyBy(action.payload, 'id'),
      };

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

      // case types.ART_FETCH_COMMENTS_FULFILLED:
      //   console.log(`Fetched all comments: ${get(action.payload, 'length')} comments.`);

      //   console.log('new_comments: ', map(state.allArticles, (article) => ({
      //     ...article,
      //     blog_article_comments: map(filter(action.payload, (c) => c.blog_article_id === article.id),
      //       (comment) => ({
      //         ...comment,
      //         commenter_id: action.payload.commenter.id,
      //         commenter_name: action.payload.commenter.full_name,
      //         reply_to: action.payload.reply_to,
      //       }),
      //     ),
      //   })));

      //   return {
      //     ...state,
      //     comments: keyBy(action.payload, 'id'),
      //     allArticles: keyBy(map(state.allArticles, (article) => ({
      //       ...article,
      //       blog_article_comments: map(filter(action.payload, (c) => c.blog_article_id === article.id),
      //         (comment) => ({
      //           ...comment,
      //           commenter_id: action.payload.commenter.id,
      //           commenter_name: action.payload.commenter.full_name,
      //           reply_to: action.payload.reply_to,
      //         }),
      //       ),
      //     })), 'id'),
      //   };

    case types.ART_FETCH_CATEGORIES_FULFILLED:
      console.log(`Fetched all categories: ${get(action.payload, 'length')} categories.`);

      return {
        ...state,
        categories: keyBy(action.payload, 'id'),
      };

    case types.ART_FETCH_TAGS_FULFILLED:
      console.log(`Fetched all tags: ${get(action.payload, 'length')} tags.`);

      return {
        ...state,
        tags: keyBy(map(action.payload, (tag) => ({
          ...tag,
          category: sample(state.categories),
        })), 'id'),
      };

    case types.ART_UPDATE_ARTICLE_FULFILLED:
      toast.success(`Changed article ${action.payload.title} successfully!`);

      return {
        ...state,
        oneArticle: {
          ...state.oneArticle,
          ...action.payload,
          content: state.oneArticle.content,
        },
        allArticles: {
          ...state.allArticles,
          [action.payload.id]: {
            ...state.allArticles[action.payload.id],
            ...action.payload,
          },
        },
      };

    case types.ART_UPDATE_ARTICLE_CONTENT_FULFILLED:
      return {
        ...state,
        oneArticle: {
          content: JSON.parse(get(action.payload, 'content', '{}')),
          ...state.oneArticle,
        },
      };

    case types.ART_UPDATE_ARTICLE_REJECTED:
      toast.error('Error while updating article!');

      return {
        ...state,
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
        allArticles: omit(state.allArticles, action.payload.id),
        ...state,
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

    default:
      return state || {};
  }
};
