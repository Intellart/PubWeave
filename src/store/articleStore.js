// @flow
// import React from 'react';
import { filter, map } from 'lodash';
import * as API from '../api';
import type { ReduxAction, ReduxActionWithPayload } from '../types';

export type ArticleSettings = {
  title: string,
  category: string,
  description: string,
  author: string,
  wordCount: number,
  spellCheck: boolean,
  tags: Array<string>,
};

export type ArticleContent = {
  blocks: Array<Object>,
  time: number,
  version: string,
};

export type State = {
  oneArticle: {
    articleContent: ArticleContent,
    articleSettings: ArticleSettings,
  },
  allArticles: Array<Object>,
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
  createArticle: (): ReduxAction => ({
    type: types.ART_CREATE_ARTICLE,
    payload: API.postRequest('blog_articles.json',
      {
        blog_article: {
          title: 'Undefined_' + Math.floor(Math.random() * 1000),
          article_content: {
            tags: [],
            time: 0,
            author: '',
            category: '',
            status: 'draft',
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
        allArticles: action.payload,
      };

    case types.ART_UPDATE_ARTICLE_FULFILLED:
      return {
        ...state,
        // oneArticle: {
        //   title: action.payload.title,
        //   article_content: action.payload.article_content,
        // },
        oneArticle: {
          ...state.oneArticle,
          ...action.payload,
        },
        allArticles: map(state.allArticles, (a) => {
          if (a.id === action.payload.id) {
            return {
              ...a,
              ...action.payload,
            };
          }

          return a;
        }),
      };

    case types.ART_CREATE_ARTICLE_FULFILLED:
      return {
        ...state,
        allArticles: [...state.allArticles, action.payload],
      };

    case types.ART_DELETE_ARTICLE_FULFILLED:
      return {
        ...state,
        allArticles: filter(state.allArticles, (article) => article.id !== action.payload.id),
      };

    case types.ART_PUBLISH_ARTICLE_FULFILLED:
      return {
        ...state,
        oneArticle: {
          ...state.oneArticle,
          ...action.payload,
        },
        allArticles: map(state.allArticles, (a) => {
          if (a.id === action.payload.id) {
            return {
              ...action.payload,
            };
          }

          return a;
        }),
      };

    default:
      return state || {};
  }
};
