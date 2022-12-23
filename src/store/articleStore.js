// @flow
// import React from 'react';
import { get } from 'lodash';
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
  articleContent: ArticleContent,
  articleSettings: ArticleSettings,
};

export const types = {
  ART_FETCH_ARTICLE: 'ART/FETCH_ARTICLE',
  ART_FETCH_ARTICLE_PENDING: 'ART/FETCH_ARTICLE_PENDING',
  ART_FETCH_ARTICLE_REJECTED: 'ART/FETCH_ARTICLE_REJECTED',
  ART_FETCH_ARTICLE_FULFILLED: 'ART/FETCH_ARTICLE_FULFILLED',

  ART_UPDATE_ARTICLE: 'ART/UPDATE_ARTICLE',
  ART_UPDATE_ARTICLE_PENDING: 'ART/UPDATE_ARTICLE_PENDING',
  ART_UPDATE_ARTICLE_REJECTED: 'ART/UPDATE_ARTICLE_REJECTED',
  ART_UPDATE_ARTICLE_FULFILLED: 'ART/UPDATE_ARTICLE_FULFILLED',

  ART_CREATE_ARTICLE: 'ART/CREATE_ARTICLE',
  ART_CREATE_ARTICLE_PENDING: 'ART/CREATE_ARTICLE_PENDING',
  ART_CREATE_ARTICLE_REJECTED: 'ART/CREATE_ARTICLE_REJECTED',
  ART_CREATE_ARTICLE_FULFILLED: 'ART/CREATE_ARTICLE_FULFILLED',

};

// export const selectors = {
//   // getUser: (state: ReduxState): User|null => state.user.currentUser,
// };

export const actions = {
  // loginUser: (payload: LoginCredentials): ReduxAction => ({
  //   type: types.USR_LOGIN_USER,
  //   payload: API.postRequest('auth/session', { user: payload }),
  // }),
  // logoutUser: (): ReduxAction => ({
  //   type: types.USR_LOGOUT_USER,
  //   payload: API.deleteRequest('auth/session'),
  // }),
  // clearUser: (): ReduxAction => ({
  //   type: types.USR_CLEAR_USER,
  // }),
  fetchArticle: (id: number): ReduxAction => ({
    type: types.ART_FETCH_ARTICLE,
    payload: API.getRequest(`blog_articles/${id}`),
  }),
  createArticle: (): ReduxAction => ({
    type: types.ART_CREATE_ARTICLE,
    payload: API.postRequest('blog_articles.json',
      {
        blog_article: {
          title: 'Undefined',
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

};

export const reducer = (state: State, action: ReduxActionWithPayload): State => {
  switch (action.type) {
    // case types.USR_LOGIN_USER_FULFILLED:
    //   toast.success('User successfully logged in!');

    //   return { ...state, ...{ profile: action.payload, currentAdmin: null } };

    // case types.USR_LOGOUT_USER_FULFILLED:
    //   toast.success('User successfully logged out!');

    //   return logoutUser();

    // case types.USR_CLEAR_USER:
    //   return logoutUser();

    case types.ART_FETCH_ARTICLE_FULFILLED:

      return {
        ...state,
        ...action.payload,
      };

    case types.ART_UPDATE_ARTICLE_FULFILLED:
      return {
        ...state,
        title: action.payload.title,
        article_content: action.payload.article_content,
      };

    case types.ART_CREATE_ARTICLE_FULFILLED:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state || {};
  }
};

// export async function fetchArticle(id: number): any {
//   const response = await API.getRequest(`blog_articles/${id}`);

//   console.log('response_', response);

//   return response;
// }

// export async function createArticle(id: number, articleSettings: any, articleContent: any) {
//   // API.postRequest('blog_articles/1', { blog_article: { title: 'Test Arqsdstttdrggrtsadiclse', article_content: { test: 'test' } } });
//   await API.putRequest(`blog_articles/${id}`, {
//     blog_article: {
//       title: articleSettings.title,
//       article_content: {
//         ...articleContent,
//         ...articleSettings,
//       },
//     },
//   });
// }

// export async function updateArticle(id: number, articleSettings: any, articleContent: any) {
//   await API.putRequest(`blog_articles/${id}`, {
//     blog_article: {
//       title: articleSettings.title,
//       article_content: {
//         ...articleContent,
//         ...articleSettings,
//       },
//     },
//   });
// }
