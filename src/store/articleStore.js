// @flow
import {
  filter, keyBy, omit, get, map, set, subtract,
} from 'lodash';
import { toast } from 'react-toastify';
import * as API from '../api';
import type { ReduxAction, ReduxActionWithPayload, ReduxState } from '../types';
import type { User } from './userStore';
import { areBlocksEqual, convertBlocksFromBackend } from '../utils/hooks';
// import { store } from '.';

// ------------ single block --------------------------------------------
export type SimpleBlock = {
  id: string,
  type: string,
  data: Object,
};

export type Block = {|
  ...SimpleBlock,
  time: string,
  position: null | number,
  version_number: number,
  collaborator_id: number,
|};

export type _BlockFromEditor = {|
  ...SimpleBlock,
  tunes?: any,
  |};

export type BlockFromEditor = {|
  ...SimpleBlock,
  tunes?: any,
  position: number,
  |};

export type BlockToChange = {|
  ...SimpleBlock,
  position: number,
  |};

export type Action ='updated' | 'created' | 'deleted';

export type BlockToServer = {|
  ...SimpleBlock,
  action: Action,
|};

// -------------- blocks ---------------------------------------

export type BlockFromBackend = Block;

export type BlocksFromBackend = {
  [string]: BlockFromBackend,
};

export type Blocks = {
  [string]: Block,
};

export type _BlocksFromEditor = {
  [string]: _BlockFromEditor,
};

export type BlocksToChange = {
  [key: string]: BlockToChange,
};

export type BlocksFromEditor = {
  [string]: BlockFromEditor,
};

export type BlocksToServer = {
  [string]: BlockToServer,
};

// -------------- article content ---------------------------------------

export type _ArticleContent = {
  blocks: Array<_BlockFromEditor>,
  time: number,
  version: string,
};

export type _ContentFromEditor = {
  blocks: Array<_BlockFromEditor>,
  time: number,
  version: string,
};

export type ArticleContent = {
  blocks: Blocks,
  time: number,
  version: string,
};

export type ArticleContentToServer = {
  blocks: Array<BlockToServer>,
  time: number,
  version: string,
};

// -------------- categories ---------------------------------------

export type BlockCategoriesToChange = {
  created: BlocksToChange,
  changed: BlocksToChange,
  deleted: BlocksToChange,
};

// -------------- article ---------------------------------------

export type Comment = {
  id: number,
  comment: string,
  likes: number,
  dislikes: number,
  created_at: string,
  updated_at: string,
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
  author: User,
  likes: Array<Object>,
  status: string,
  description: string,
  image: string,
  star: boolean,
  category: string,
  created_at: string,
  updated_at: string,
  comments: { [number]: Comment },
  tags: Array<any>,
  active_sections: {[string]: number },
};

export type BlockIds = {
  [string]: string,
};

export type BlockIdQueue = {
  updated: BlockIds,
  created: BlockIds,
  deleted: BlockIds,
}

export type State = {
  oneArticle: Article | null,
  allArticles: { [number]: Article },
  comments: { [number]: Comment },
  categories: { [string]: Category },
  tags: { [number]: Tag },
  versions: Array<any>,
  activeBlock: {
    id:string,
  },
  activeSections: {[string]: number },
  blockIdQueue: BlockIdQueue,
  critical_section_ids: Array<string>,
};

export const types = {
  TEST_WS_BLOCK_UPDATE: 'TEST_WS_BLOCK_UPDATE',

  SET_LAST_UPDATED_ARTICLE_IDS: 'SET_LAST_UPDATED_ARTICLE_IDS',

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

  ART_FETCH_VERSIONS: 'ART/FETCH_VERSIONS',
  ART_FETCH_VERSIONS_PENDING: 'ART/FETCH_VERSIONS_PENDING',
  ART_FETCH_VERSIONS_REJECTED: 'ART/FETCH_VERSIONS_REJECTED',
  ART_FETCH_VERSIONS_FULFILLED: 'ART/FETCH_VERSIONS_FULFILLED',

  ART_LOCK_SECTION: 'ART/LOCK_SECTION',
  ART_LOCK_SECTION_PENDING: 'ART/LOCK_SECTION_PENDING',
  ART_LOCK_SECTION_REJECTED: 'ART/LOCK_SECTION_REJECTED',
  ART_LOCK_SECTION_FULFILLED: 'ART/LOCK_SECTION_FULFILLED',

  ART_UNLOCK_SECTION: 'ART/UNLOCK_SECTION',
  ART_UNLOCK_SECTION_PENDING: 'ART/UNLOCK_SECTION_PENDING',
  ART_UNLOCK_SECTION_REJECTED: 'ART/UNLOCK_SECTION_REJECTED',
  ART_UNLOCK_SECTION_FULFILLED: 'ART/UNLOCK_SECTION_FULFILLED',

  BLOCK_SET_ACTIVE_BLOCK: 'BLOCK/SET_ACTIVE_BLOCK',

  WS_BLOCK_UPDATE: 'WS/BLOCK_UPDATE',
  WS_BLOCK_UPDATE_REMOVE: 'WS/BLOCK_UPDATE_REMOVE',

  WS_BLOCK_CREATE: 'WS/BLOCK_CREATE',
  WS_BLOCK_CREATE_REMOVE: 'WS/BLOCK_CREATE_REMOVE',

  WS_BLOCK_REMOVE: 'WS/BLOCK_REMOVE',
  WS_BLOCK_REMOVE_REMOVE: 'WS/BLOCK_REMOVE_REMOVE',

  BLOCK_ID_QUEUE_ADD: 'BLOCK_ID_QUEUE_ADD',
  BLOCK_ID_QUEUE_REMOVE: 'BLOCK_ID_QUEUE_REMOVE',
  BLOCK_ID_QUEUE_COMPLETE: 'BLOCK_ID_QUEUE_COMPLETE',

  WS_LOCK_SECTION: 'WS/LOCK_SECTION',
  WS_UNLOCK_SECTION: 'WS/UNLOCK_SECTION',

};

export const selectors = {
  article: (state: ReduxState): Article | null => state.article.oneArticle,
  articleContent: (state: ReduxState): ArticleContent => get(state.article.oneArticle, 'content'),
  getUsersArticles: (state: ReduxState): any => filter(state.article.allArticles, (article) => article.author.id === state.user.profile?.id),
  getBlocks: (state: ReduxState): Array<Block> => get(state.article.oneArticle, 'content.blocks'),
  getAllArticles: (state: ReduxState): any => state.article.allArticles,
  getPublishedArticles: (state: ReduxState): any => filter(state.article.allArticles, (article) => article.status === 'published'),
  getCategories: (state: ReduxState): any => state.article.categories,
  getTags: (state: ReduxState): any => state.article.tags,
  getVersions: (state: ReduxState): any => get(state.article, 'versions', []),
  getActiveBlock: (state: ReduxState): any => state.article.activeBlock,
  getCriticalSectionIds: (state: ReduxState): any => get(state.article, 'critical_section_ids', []),
  getBlockIdQueue: (state: ReduxState, action: Action): BlockIds => get(state.article.blockIdQueue, action, {}),
  getActiveSections: (state: ReduxState): any => get(state.article, 'activeSections', []),
};

export const actions = {
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
  unlockSection: (userId: number, sectionId: string): ReduxAction => ({
    type: types.ART_UNLOCK_SECTION,
    payload: API.putRequest(`pubweave/sections/${sectionId}/unlock`, {
      user_id: userId,
      section_id: sectionId,
    }),
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
  blockIdQueueAdd: (blockId: string, blockAction: 'updated' |'created' | 'deleted'): ReduxAction => ({
    type: types.BLOCK_ID_QUEUE_ADD,
    payload: {
      blockId,
      blockAction,
    },
  }),
  blockIdQueueRemove: (blockId: string, blockAction: 'updated' |'created' | 'deleted'): ReduxAction => ({
    type: types.BLOCK_ID_QUEUE_REMOVE,
    payload: {
      blockId,
      blockAction,
    },
  }),
  blockIdQueueComplete: (blockId: string, blockAction: 'updated' |'created' | 'deleted'): ReduxAction => ({
    type: types.BLOCK_ID_QUEUE_COMPLETE,
    payload: {
      blockId,
      blockAction,
    },
  }),

  setActiveBlock: (blockId:string | null): ReduxAction => ({
    type: types.BLOCK_SET_ACTIVE_BLOCK,
    payload: {
      id: blockId,
    },
  }),
  fetchVersions: (id: number): ReduxAction => ({
    type: types.ART_FETCH_VERSIONS,
    payload: API.getRequest(`pubweave/sections/${id}/version_data`),
  }),
  fetchArticle: (id: number): ReduxAction => ({
    type: types.ART_FETCH_ARTICLE,
    payload: API.getRequest(`pubweave/articles/${id}`),
  }),
  fetchAllArticles: (): ReduxAction => ({
    type: types.ART_FETCH_ALL_ARTICLES,
    payload: API.getRequest('pubweave/articles'),
  }),
  likeComment: (commentId: number): ReduxAction => ({
    type: types.ART_LIKE_COMMENT,
    payload: API.putRequest(`pubweave/comments/${commentId}/like`),
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
    payload: API.getRequest('categories'),
  }),
  addTag: (id: number, tagId: number): ReduxAction => ({
    type: types.ART_ADD_TAG,
    payload: API.postRequest(`pubweave/articles/${id}/add_tag`, {
      article: {
        tag_id: tagId,
      },
    }),
  }),
  removeTag: (id: number, tagId: number): ReduxAction => ({
    type: types.ART_REMOVE_TAG,
    payload: API.putRequest(`pubweave/articles/${id}/remove_tag`, {
      article: {
        tag_id: tagId,
      },
    }),
  }),
  fetchTags: (): ReduxAction => ({
    type: types.ART_FETCH_TAGS,
    payload: API.getRequest('tags'),
  }),
  createComment: (articleId: number, userId: number, content: string, replyTo: number): ReduxAction => ({
    type: types.ART_CREATE_COMMENT,
    payload: API.postRequest('pubweave/comments',
      {
        comment: {
          article_id: articleId,
          commenter_id: userId,
          comment: content,
          reply_to_id: replyTo,
        },
      }),
  }),

  createArticle: (userId: number): ReduxAction => ({
    type: types.ART_CREATE_ARTICLE,
    payload: API.postRequest('pubweave/articles',
      {
        author_id: userId,
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
  likeArticle: (articleId: number): ReduxAction => ({
    type: types.ART_LIKE_ARTICLE,
    payload: API.putRequest(`pubweave/articles/${articleId}/like`),
  }),
  likeArticleRemoval: (articleId: number): ReduxAction => ({
    type: types.ART_LIKE_ARTICLE_REMOVAL,
    payload: API.putRequest(`pubweave/articles/${articleId}/like`),
  }),
  updateArticle: (id: number, payload: any): ReduxAction => ({
    type: types.ART_UPDATE_ARTICLE,
    payload: API.putRequest(`pubweave/articles/${id}`,
      {
        article: {
          ...payload,
        },
      }),
  }),
  updateArticleContentSilently: (id: number, newArticleContent: ArticleContentToServer): ReduxAction => ({
    type: types.ART_UPDATE_ARTICLE_CONTENT,
    payload: API.putRequest(`pubweave/articles/${id}`,
      {
        article: {
          content: newArticleContent,
        },
      }),
  }),

  deleteArticle: (id: number): ReduxAction => ({
    type: types.ART_DELETE_ARTICLE,
    payload: API.deleteRequest(`pubweave/articles/${id}`),
  }),
  // this will be handled by Admin from the backend, see publish and reject actions
  publishArticle: (id: number, newStatus: string): ReduxAction => {
    console.log('publishing article', id, newStatus);

    let route = '';
    if (newStatus === 'published') {
      route = `pubweave/articles/${id}/accept_publishing`;
    } else if (newStatus === 'rejected') {
      route = `pubweave/articles/${id}/reject_publishing`;
    } else if (newStatus === 'requested') {
      route = `pubweave/articles/${id}/request_publishing`;
    }

    return {
      type: types.ART_PUBLISH_ARTICLE,
      payload: API.putRequest(route,
        {
          article: {
            status: newStatus,
          },
        }),
    };
  },

};

export const reducer = (state: State, action: ReduxActionWithPayload): State => {
  switch (action.type) {
    case types.WS_LOCK_SECTION:
    case types.WS_UNLOCK_SECTION:
      console.log('WS_(UN)LOCK_SECTION');

      return {
        ...state,
        activeSections: get(action.payload, 'active_sections', {}),
      };
    case types.WS_BLOCK_UPDATE: {
      console.log('WS_BLOCK_UPDATE');
      console.log(state);

      const { userId, payload: _newBlock } = action.payload;

      if (!state.oneArticle || !_newBlock) {
        return state;
      } else if (get(_newBlock, ['current_editor_id']) === userId) {
        console.log('same author, ignoring');

        return state;
      }

      const newBlock = {
        ..._newBlock,
        addedToEditor: false,
      };

      const oldBlock = get(state.oneArticle, `content.blocks.${_newBlock.id}`);

      if (!oldBlock || areBlocksEqual(newBlock, oldBlock)) {
        console.log('same block or cant find, ignoring');

        return state;
      }

      const oldTime = new Date(oldBlock.time);
      const newTime = new Date(newBlock.time);

      console.log('old time', oldTime, 'new time', newTime);

      // check if difference is bigger than 1 second
      if (Math.abs(subtract(oldTime, newTime)) < 3000 && get(_newBlock, ['current_editor_id']) === userId) {
        console.log('time difference too small, ignoring');

        return {
          ...state,
          activeSections: newBlock.active_sections,
        };
      }

      return {
        ...state,
        activeSections: newBlock.active_sections,
        oneArticle: set(state.oneArticle, `content.blocks.${newBlock.id}`, {
          ...newBlock,
          position: oldBlock.position,
        }),
        blockIdQueue: {
          ...state.blockIdQueue,
          updated: {
            ...state.blockIdQueue.updated,
            [newBlock.id]: false,
          },
        },
      };
    }
    case types.WS_BLOCK_CREATE: {
      console.log('WS_BLOCK_CREATE');

      const { userId, payload: _newBlock } = action.payload;

      if (!state.oneArticle) {
        return state;
      }

      if (get(_newBlock, ['current_editor_id']) === userId) {
        console.log('same author, ignoring');

        return state;
      }

      const findBlock2 = get(state.oneArticle, `content.blocks.${_newBlock.id}`);

      if (findBlock2) {
        return state;
      }

      return {
        ...state,
        oneArticle: set(state.oneArticle, `content.blocks.${_newBlock.id}`, _newBlock),
        activeSections: _newBlock.active_sections,
        blockIdQueue: {
          ...state.blockIdQueue,
          created: {
            ...state.blockIdQueue.created,
            [_newBlock.id]: false,
          },
        },
      };
    }
    case types.WS_BLOCK_REMOVE: {
      console.log('WS_BLOCK_REMOVE');

      const { userId, payload: _newBlock } = action.payload;

      if (get(_newBlock, ['current_editor_id']) === userId) {
        console.log('same author, ignoring');

        return state;
      }

      const findBlock3 = get(state.oneArticle, `content.blocks.${_newBlock.id}`);

      console.log('found block to remove', findBlock3);

      if (!state.oneArticle || !findBlock3) {
        return state;
      }

      return {
        ...state,
        activeSections: _newBlock.active_sections,
        oneArticle: set(state.oneArticle, 'content.blocks', omit(state.oneArticle.content.blocks, _newBlock.id)),
        blockIdQueue: {
          ...state.blockIdQueue,
          deleted: {
            ...state.blockIdQueue.deleted,
            [_newBlock.id]: false,
          },
        },
      };
    }

    case types.ART_FETCH_ARTICLE_FULFILLED:
    case types.ART_UPDATE_ARTICLE_CONTENT_FULFILLED:
      const { time, version, blocks } = get(action.payload, 'content', '{}');

      return {
        ...state,
        oneArticle: {
          ...action.payload,
          comments: keyBy(get(action.payload, 'comments', []), 'id'),
          content: {
            time,
            version,
            blocks: convertBlocksFromBackend(blocks),
          },
          tags: map(get(action.payload, 'tags', []), (t) => ({
            article_id: t.article_id,
            category_id: t.category_id,
            id: null,
            article_tag_link: t.id,
            tag_name: t.tag_name,
          })),
        },
        activeSections: get(action.payload, 'active_sections', {}),
        blockIdQueue: {
          updated: {},
          created: {},
          deleted: {},
        },
      };

    case types.BLOCK_ID_QUEUE_ADD:
      const { blockId: id, blockAction: act } = action.payload;

      return {
        ...state,
        blockIdQueue: {
          ...state.blockIdQueue,
          [act]: {
            ...state.blockIdQueue[act],
            [id]: false,
          },
        },
      };
    case types.BLOCK_ID_QUEUE_REMOVE:
      const { blockId: blockToDel, blockAction: actToDel } = action.payload;

      return {
        ...state,
        // oneArticle: set(state.oneArticle, `content.blocks.${blockToDel}`, {
        //   ...state.blockIdQueue[actToDel][blockToDel],
        //   id: blockToDel,
        // }),
        blockIdQueue: {
          ...state.blockIdQueue,
          [actToDel]: omit(state.blockIdQueue[actToDel], blockToDel),
        },
      };
    case types.BLOCK_ID_QUEUE_COMPLETE:
      const { blockId: blockToComplete, blockAction: actToComplete } = action.payload;

      return {
        ...state,
        blockIdQueue: set(state.blockIdQueue, `${actToComplete}.${blockToComplete}`, true),
      };
    case types.ART_FLUSH_ARTICLE_FULFILLED:
      toast.success('Article flushed.');

      return {
        ...state,
        oneArticle: null,
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

      if (!state.oneArticle) {
        return state;
      }

      return {
        ...state,
        oneArticle: {
          ...state.oneArticle,
          comments: {
            ...state.oneArticle.comments,
            [action.payload.id]: action.payload,
          },
        },
      };

    case types.ART_DELETE_COMMENT_FULFILLED:
      toast.success('Comment deleted successfully!');
      console.log('delete', action.payload);

      if (!state.oneArticle) {
        return state;
      }

      return {
        ...state,
        oneArticle: {
          ...state.oneArticle,
          comments: omit(state.oneArticle.comments, action.payload),
        },
      };

      // COMMENT LIKES ------------------------------------------------------
      // --------------------------------------------------------------------

    case types.ART_LIKE_COMMENT_FULFILLED:
      toast.success('Comment liked successfully!');
      console.log('like', action.payload);

      if (!state.oneArticle) {
        return state;
      }

      return {
        ...state,
        oneArticle: {
          ...state.oneArticle,
          comments: {
            ...state.oneArticle.comments,
            [action.payload.id]: {
              ...state.oneArticle.comments[action.payload.id],
              likes: action.payload.likes,
            },
          },
        },
      };

    case types.ART_UNLIKE_COMMENT_FULFILLED:
      toast.success('Comment unliked successfully!');
      console.log('unlike', action.payload);

      if (!state.oneArticle) {
        return state;
      }

      return {
        ...state,
        oneArticle: {
          ...state.oneArticle,
          comments: {
            ...state.oneArticle.comments,
            [action.payload.id]: {
              ...state.oneArticle.comments[action.payload.id],
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

      if (!state.oneArticle) {
        return state;
      }

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

      if (!state.oneArticle) {
        return state;
      }

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

      if (!state.oneArticle) {
        return state;
      }

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
              article_id: action.payload.article_id,
            },
          ],
        },
      };

    case types.ART_REMOVE_TAG_FULFILLED:
      const removedId: number = action.payload;
      toast.success('Tag removed successfully!');

      if (!state.oneArticle) {
        return state;
      }

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
      const deletedId: number = action.payload;
      toast.success(`Deleted article #${deletedId} successfully!`);

      return {
        ...state,
        allArticles: omit(state.allArticles, deletedId),
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
      //   case types.ART_UPDATE_ARTICLE_CONTENT_FULFILLED:

      //     return state;

    default:
      return state || {};
  }
};
