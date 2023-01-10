// @flow
// import React from 'react';
import { filter, get } from 'lodash';
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

};

export const selectors = {
  article: 'article.oneArticle',
  articleContent: 'article.oneArticle.article_content',
  blocks: 'article.oneArticle.article_content.blocks',
};

export const actions = {
  fetchArticle: (id: number): ReduxAction => ({
    type: types.ART_FETCH_ARTICLE,
    payload: API.getRequest(`blog_articles/${id}`),
  }),
  fetchAllArticles: (): ReduxAction => ({
    type: types.ART_FETCH_ALL_ARTICLES,
    payload: API.getRequest('blog_articles.json'),
  }),
  createArticle: (): ReduxAction => ({
    type: types.ART_CREATE_ARTICLE,
    payload: API.postRequest('blog_articles.json',
      {
        blog_article: {
          title: 'Undefined_' + Math.floor(Math.random() * 1000),
          article_content: {
            blocks: [],
          },
        },
      }),
  }),
  updateArticle: (id: number, articleSettings: any, articleContent: any): ReduxAction => ({
    type: types.ART_UPDATE_ARTICLE,
    payload: API.putRequest(`blog_articles/${id}`,
      {
        blog_article: {
          title: articleSettings.title,
          article_content: {
            blocks: get(articleContent, 'blocks', []),
            time: get(articleContent, 'time', 0),
            tags: get(articleSettings, 'tags', []),
            category: get(articleSettings, 'category', ''),
            author: get(articleSettings, 'author', ''),
          },
        },
      }),
  }),
  deleteArticle: (id: number): ReduxAction => ({
    type: types.ART_DELETE_ARTICLE,
    payload: API.deleteRequest(`blog_articles/${id}`),
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

    default:
      return state || {};
  }
};
