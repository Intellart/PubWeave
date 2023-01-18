// @flow
// import React from 'react';
import {
  filter, keyBy, omit,
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

};

export const selectors = {
  article: 'article.oneArticle',
  articleContent: 'article.oneArticle.article_content',
  blocks: 'article.oneArticle.article_content.blocks',
  getUsersArticles: (state: ReduxState): any => filter(state.article.allArticles, (article) => article.user.id === state.user.profile?.id),
  getPublishedArticles: (state: ReduxState): any => filter(state.article.allArticles, (article) => article.status === 'published'),
};

export const actions = {
  fetchArticle: (id: number): ReduxAction => ({
    type: types.ART_FETCH_ARTICLE,
    payload: API.getRequest(`pubweave/blog_articles/${id}`),
  }),
  fetchAllArticles: (): ReduxAction => ({
    type: types.ART_FETCH_ALL_ARTICLES,
    payload: API.getRequest('pubweave/blog_articles.json'),
  }),
  createArticle: (userId : number): ReduxAction => ({
    type: types.ART_CREATE_ARTICLE,
    payload: API.postRequest('pubweave/blog_articles.json',
      {
        user_id: userId,
        title: 'New article',
        content: {
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
        },
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
  deleteArticle: (id: number): ReduxAction => ({
    type: types.ART_DELETE_ARTICLE,
    payload: API.deleteRequest(`pubweave/blog_articles/${id}`),
  }),
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
    case types.ART_FETCH_ARTICLE_FULFILLED:

      return {
        ...state,
        oneArticle: action.payload,
      };

    case types.ART_FETCH_ALL_ARTICLES_FULFILLED:
      return {
        ...state,
        allArticles: keyBy(action.payload, 'id'),
      };

    case types.ART_UPDATE_ARTICLE_FULFILLED:
      toast.success(`Changed article ${action.payload.title} successfully!`);

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
      toast.error(`Error while updating article ${action.payload.title}!`);

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
        oneArticle: {},
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
