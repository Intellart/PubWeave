import { EditorEventType } from "../../components/editor/Editor";
import { User } from "../user/types";

export const articleTypes = {
  TEST_WS_BLOCK_UPDATE: "TEST_WS_BLOCK_UPDATE",

  SET_LAST_UPDATED_ARTICLE_IDS: "SET_LAST_UPDATED_ARTICLE_IDS",

  ART_USER_REVIEW_ACCEPT: "ART/USER_REVIEW_ACCEPT",
  ART_USER_REVIEW_ACCEPT_PENDING: "ART/USER_REVIEW_ACCEPT_PENDING",
  ART_USER_REVIEW_ACCEPT_REJECTED: "ART/USER_REVIEW_ACCEPT_REJECTED",
  ART_USER_REVIEW_ACCEPT_FULFILLED: "ART/USER_REVIEW_ACCEPT_FULFILLED",

  ART_USER_REVIEW_REJECT: "ART/USER_REVIEW_REJECT",
  ART_USER_REVIEW_REJECT_PENDING: "ART/USER_REVIEW_REJECT_PENDING",
  ART_USER_REVIEW_REJECT_REJECTED: "ART/USER_REVIEW_REJECT_REJECTED",
  ART_USER_REVIEW_REJECT_FULFILLED: "ART/USER_REVIEW_REJECT_FULFILLED",

  ART_ADD_COLLABORATOR: "ART/ADD_COLLABORATOR",
  ART_ADD_COLLABORATOR_PENDING: "ART/ADD_COLLABORATOR_PENDING",
  ART_ADD_COLLABORATOR_REJECTED: "ART/ADD_COLLABORATOR_REJECTED",
  ART_ADD_COLLABORATOR_FULFILLED: "ART/ADD_COLLABORATOR_FULFILLED",

  ART_FETCH_ARTICLE: "ART/FETCH_ARTICLE",
  ART_FETCH_ARTICLE_PENDING: "ART/FETCH_ARTICLE_PENDING",
  ART_FETCH_ARTICLE_REJECTED: "ART/FETCH_ARTICLE_REJECTED",
  ART_FETCH_ARTICLE_FULFILLED: "ART/FETCH_ARTICLE_FULFILLED",

  ART_FETCH_ALL_ARTICLES: "ART/FETCH_ALL_ARTICLES",
  ART_FETCH_ALL_ARTICLES_PENDING: "ART/FETCH_ALL_ARTICLES_PENDING",
  ART_FETCH_ALL_ARTICLES_REJECTED: "ART/FETCH_ALL_ARTICLES_REJECTED",
  ART_FETCH_ALL_ARTICLES_FULFILLED: "ART/FETCH_ALL_ARTICLES_FULFILLED",

  ART_FETCH_ALL_REVIEWERS: "ART/FETCH_ALL_REVIEWERS",
  ART_FETCH_ALL_REVIEWERS_PENDING: "ART/FETCH_ALL_REVIEWERS_PENDING",
  ART_FETCH_ALL_REVIEWERS_REJECTED: "ART/FETCH_ALL_REVIEWERS_REJECTED",
  ART_FETCH_ALL_REVIEWERS_FULFILLED: "ART/FETCH_ALL_REVIEWERS_FULFILLED",

  ART_UPDATE_ARTICLE: "ART/UPDATE_ARTICLE",
  ART_UPDATE_ARTICLE_PENDING: "ART/UPDATE_ARTICLE_PENDING",
  ART_UPDATE_ARTICLE_REJECTED: "ART/UPDATE_ARTICLE_REJECTED",
  ART_UPDATE_ARTICLE_FULFILLED: "ART/UPDATE_ARTICLE_FULFILLED",

  ART_CREATE_ARTICLE: "ART/CREATE_ARTICLE",
  ART_CREATE_ARTICLE_PENDING: "ART/CREATE_ARTICLE_PENDING",
  ART_CREATE_ARTICLE_REJECTED: "ART/CREATE_ARTICLE_REJECTED",
  ART_CREATE_ARTICLE_FULFILLED: "ART/CREATE_ARTICLE_FULFILLED",

  ART_DELETE_ARTICLE: "ART/DELETE_ARTICLE",
  ART_DELETE_ARTICLE_PENDING: "ART/DELETE_ARTICLE_PENDING",
  ART_DELETE_ARTICLE_REJECTED: "ART/DELETE_ARTICLE_REJECTED",
  ART_DELETE_ARTICLE_FULFILLED: "ART/DELETE_ARTICLE_FULFILLED",

  ART_CONVERT_ARTICLE: "ART/CONVERT_ARTICLE",
  ART_CONVERT_ARTICLE_PENDING: "ART/CONVERT_ARTICLE_PENDING",
  ART_CONVERT_ARTICLE_REJECTED: "ART/CONVERT_ARTICLE_REJECTED",
  ART_CONVERT_ARTICLE_FULFILLED: "ART/CONVERT_ARTICLE_FULFILLED",

  ART_PUBLISH_ARTICLE: "ART/PUBLISH_ARTICLE",
  ART_PUBLISH_ARTICLE_PENDING: "ART/PUBLISH_ARTICLE_PENDING",
  ART_PUBLISH_ARTICLE_REJECTED: "ART/PUBLISH_ARTICLE_REJECTED",
  ART_PUBLISH_ARTICLE_FULFILLED: "ART/PUBLISH_ARTICLE_FULFILLED",

  ART_UPDATE_ARTICLE_CONTENT: "ART/UPDATE_ARTICLE_CONTENT",
  ART_UPDATE_ARTICLE_CONTENT_PENDING: "ART/UPDATE_ARTICLE_CONTENT_PENDING",
  ART_UPDATE_ARTICLE_CONTENT_REJECTED: "ART/UPDATE_ARTICLE_CONTENT_REJECTED",
  ART_UPDATE_ARTICLE_CONTENT_FULFILLED: "ART/UPDATE_ARTICLE_CONTENT_FULFILLED",

  ART_UPDATE_ARTICLE_CONTENT_NEW: "ART/UPDATE_ARTICLE_CONTENT_NEW",
  ART_UPDATE_ARTICLE_CONTENT_NEW_PENDING:
    "ART/UPDATE_ARTICLE_CONTENT_NEW_PENDING",
  ART_UPDATE_ARTICLE_CONTENT_NEW_REJECTED:
    "ART/UPDATE_ARTICLE_CONTENT_NEW_REJECTED",
  ART_UPDATE_ARTICLE_CONTENT_NEW_FULFILLED:
    "ART/UPDATE_ARTICLE_CONTENT_NEW_FULFILLED",

  ART_FETCH_COMMENTS: "ART/FETCH_COMMENTS",
  ART_FETCH_COMMENTS_PENDING: "ART/FETCH_COMMENTS_PENDING",
  ART_FETCH_COMMENTS_REJECTED: "ART/FETCH_COMMENTS_REJECTED",
  ART_FETCH_COMMENTS_FULFILLED: "ART/FETCH_COMMENTS_FULFILLED",

  ART_FETCH_CATEGORIES: "ART/FETCH_CATEGORIES",
  ART_FETCH_CATEGORIES_PENDING: "ART/FETCH_CATEGORIES_PENDING",
  ART_FETCH_CATEGORIES_REJECTED: "ART/FETCH_CATEGORIES_REJECTED",
  ART_FETCH_CATEGORIES_FULFILLED: "ART/FETCH_CATEGORIES_FULFILLED",

  ART_CREATE_COMMENT: "ART/CREATE_COMMENT",
  ART_CREATE_COMMENT_PENDING: "ART/CREATE_COMMENT_PENDING",
  ART_CREATE_COMMENT_REJECTED: "ART/CREATE_COMMENT_REJECTED",
  ART_CREATE_COMMENT_FULFILLED: "ART/CREATE_COMMENT_FULFILLED",

  ART_FETCH_TAGS: "ART/FETCH_TAGS",
  ART_FETCH_TAGS_PENDING: "ART/FETCH_TAGS_PENDING",
  ART_FETCH_TAGS_REJECTED: "ART/FETCH_TAGS_REJECTED",
  ART_FETCH_TAGS_FULFILLED: "ART/FETCH_TAGS_FULFILLED",

  ART_FLUSH_ARTICLE: "ART/FLUSH_ARTICLE",
  ART_FLUSH_ARTICLE_PENDING: "ART/FLUSH_ARTICLE_PENDING",
  ART_FLUSH_ARTICLE_REJECTED: "ART/FLUSH_ARTICLE_REJECTED",
  ART_FLUSH_ARTICLE_FULFILLED: "ART/FLUSH_ARTICLE_FULFILLED",

  ART_ADD_TAG: "ART/ADD_TAG",
  ART_ADD_TAG_PENDING: "ART/ADD_TAG_PENDING",
  ART_ADD_TAG_REJECTED: "ART/ADD_TAG_REJECTED",
  ART_ADD_TAG_FULFILLED: "ART/ADD_TAG_FULFILLED",

  ART_UNLOCK_ARTICLE: "ART/UNLOCK_ARTICLE",
  ART_UNLOCK_ARTICLE_PENDING: "ART/UNLOCK_ARTICLE_PENDING",
  ART_UNLOCK_ARTICLE_REJECTED: "ART/UNLOCK_ARTICLE_REJECTED",
  ART_UNLOCK_ARTICLE_FULFILLED: "ART/UNLOCK_ARTICLE_FULFILLED",

  ART_REMOVE_TAG: "ART/REMOVE_TAG",
  ART_REMOVE_TAG_PENDING: "ART/REMOVE_TAG_PENDING",
  ART_REMOVE_TAG_REJECTED: "ART/REMOVE_TAG_REJECTED",
  ART_REMOVE_TAG_FULFILLED: "ART/REMOVE_TAG_FULFILLED",

  ART_LIKE_ARTICLE: "ART/LIKE_ARTICLE",
  ART_LIKE_ARTICLE_PENDING: "ART/LIKE_ARTICLE_PENDING",
  ART_LIKE_ARTICLE_REJECTED: "ART/LIKE_ARTICLE_REJECTED",
  ART_LIKE_ARTICLE_FULFILLED: "ART/LIKE_ARTICLE_FULFILLED",

  ART_LIKE_ARTICLE_REMOVAL: "ART/LIKE_ARTICLE_REMOVAL",
  ART_LIKE_ARTICLE_REMOVAL_PENDING: "ART/LIKE_ARTICLE_REMOVAL_PENDING",
  ART_LIKE_ARTICLE_REMOVAL_REJECTED: "ART/LIKE_ARTICLE_REMOVAL_REJECTED",
  ART_LIKE_ARTICLE_REMOVAL_FULFILLED: "ART/LIKE_ARTICLE_REMOVAL_FULFILLED",

  ART_LIKE_COMMENT: "ART/LIKE_COMMENT",
  ART_LIKE_COMMENT_PENDING: "ART/LIKE_COMMENT_PENDING",
  ART_LIKE_COMMENT_REJECTED: "ART/LIKE_COMMENT_REJECTED",
  ART_LIKE_COMMENT_FULFILLED: "ART/LIKE_COMMENT_FULFILLED",

  ART_UNLIKE_COMMENT: "ART/UNLIKE_COMMENT",
  ART_UNLIKE_COMMENT_PENDING: "ART/UNLIKE_COMMENT_PENDING",
  ART_UNLIKE_COMMENT_REJECTED: "ART/UNLIKE_COMMENT_REJECTED",
  ART_UNLIKE_COMMENT_FULFILLED: "ART/UNLIKE_COMMENT_FULFILLED",

  ART_DELETE_COMMENT: "ART/DELETE_COMMENT",
  ART_DELETE_COMMENT_PENDING: "ART/DELETE_COMMENT_PENDING",
  ART_DELETE_COMMENT_REJECTED: "ART/DELETE_COMMENT_REJECTED",
  ART_DELETE_COMMENT_FULFILLED: "ART/DELETE_COMMENT_FULFILLED",

  ART_FETCH_VERSIONS: "ART/FETCH_VERSIONS",
  ART_FETCH_VERSIONS_PENDING: "ART/FETCH_VERSIONS_PENDING",
  ART_FETCH_VERSIONS_REJECTED: "ART/FETCH_VERSIONS_REJECTED",
  ART_FETCH_VERSIONS_FULFILLED: "ART/FETCH_VERSIONS_FULFILLED",

  ART_FETCH_REVIEWS: "ART/FETCH_REVIEWS",
  ART_FETCH_REVIEWS_PENDING: "ART/FETCH_REVIEWS_PENDING",
  ART_FETCH_REVIEWS_REJECTED: "ART/FETCH_REVIEWS_REJECTED",
  ART_FETCH_REVIEWS_FULFILLED: "ART/FETCH_REVIEWS_FULFILLED",

  ART_CREATE_REVIEW: "ART/CREATE_REVIEW",
  ART_CREATE_REVIEW_PENDING: "ART/CREATE_REVIEW_PENDING",
  ART_CREATE_REVIEW_REJECTED: "ART/CREATE_REVIEW_REJECTED",
  ART_CREATE_REVIEW_FULFILLED: "ART/CREATE_REVIEW_FULFILLED",

  ART_DELETE_REVIEWS: "ART/DELETE_REVIEWS",
  ART_DELETE_REVIEWS_PENDING: "ART/DELETE_REVIEWS_PENDING",
  ART_DELETE_REVIEWS_REJECTED: "ART/DELETE_REVIEWS_REJECTED",
  ART_DELETE_REVIEWS_FULFILLED: "ART/DELETE_REVIEWS_FULFILLED",

  ART_LOCK_SECTION: "ART/LOCK_SECTION",
  ART_LOCK_SECTION_PENDING: "ART/LOCK_SECTION_PENDING",
  ART_LOCK_SECTION_REJECTED: "ART/LOCK_SECTION_REJECTED",
  ART_LOCK_SECTION_FULFILLED: "ART/LOCK_SECTION_FULFILLED",

  ART_UNLOCK_SECTION: "ART/UNLOCK_SECTION",
  ART_UNLOCK_SECTION_PENDING: "ART/UNLOCK_SECTION_PENDING",
  ART_UNLOCK_SECTION_REJECTED: "ART/UNLOCK_SECTION_REJECTED",
  ART_UNLOCK_SECTION_FULFILLED: "ART/UNLOCK_SECTION_FULFILLED",

  BLOCK_SET_ACTIVE_BLOCK: "BLOCK/SET_ACTIVE_BLOCK",

  WS_BLOCK_UPDATE: "WS/BLOCK_UPDATE",
  WS_BLOCK_UPDATE_REMOVE: "WS/BLOCK_UPDATE_REMOVE",

  WS_BLOCK_CREATE: "WS/BLOCK_CREATE",
  WS_BLOCK_CREATE_REMOVE: "WS/BLOCK_CREATE_REMOVE",

  WS_BLOCK_REMOVE: "WS/BLOCK_REMOVE",
  WS_BLOCK_REMOVE_REMOVE: "WS/BLOCK_REMOVE_REMOVE",

  BLOCK_ID_QUEUE_ADD: "BLOCK_ID_QUEUE_ADD",
  BLOCK_ID_QUEUE_REMOVE: "BLOCK_ID_QUEUE_REMOVE",
  BLOCK_ID_QUEUE_COMPLETE: "BLOCK_ID_QUEUE_COMPLETE",

  WS_LOCK_SECTION: "WS/LOCK_SECTION",
  WS_UNLOCK_SECTION: "WS/UNLOCK_SECTION",
};

// ------------ single block --------------------------------------------
export type SimpleBlock = {
  id: string;
  type: string;
  data: Object;
};

export type Block = SimpleBlock & {
  time: string;
  position: null | number;
  version_number: number;
  collaborator_id: number;
  action: string;
};

export type _BlockFromEditor = SimpleBlock & {
  tunes?: any;
};

export type BlockFromEditor = SimpleBlock & {
  tunes?: any;
  position: number;
};

export type BlockToChange = SimpleBlock & {
  position: number;
};

export type Action = EditorEventType;

export type BlockToServer = SimpleBlock & {
  action: Action;
};

/// filled block after fetched from editor

export type FilledBlock = {
  action: Action;
  data: Object;
  id: string;
  position: number;
  time: number;
  tool: string;
  tunes: Object;
  type: string;
};

// -------------- blocks ---------------------------------------

export type BlockFromBackend = Block;

export type BlocksFromBackend = {
  [key: string]: BlockFromBackend;
};

export type Blocks = {
  [key: string]: Block;
};

export type _BlocksFromEditor = {
  [key: string]: _BlockFromEditor;
};

export type BlocksToChange = {
  [key: string]: BlockToChange;
};

export type BlocksFromEditor = {
  [key: string]: BlockFromEditor;
};

export type BlocksToServer = {
  [key: string]: BlockToServer;
};

// -------------- article content ---------------------------------------

export type _ArticleContent = {
  blocks: Array<_BlockFromEditor>;
  time: number;
  version: string;
};

export type _ContentFromEditor = {
  blocks: Array<_BlockFromEditor>;
  time: number;
  version: string;
};

export type ArticleContent = {
  blocks: Blocks;
  time: number;
  version: string;
};

export type ArticleContentToServer = {
  blocks: FilledBlock[];
  time: number;
  version: string;
};

// -------------- categories ---------------------------------------

export type BlockCategoriesToChange = {
  created: FilledBlock[];
  updated: FilledBlock[];
  deleted: FilledBlock[];
};

export type Comment = {
  id: number;
  comment: string;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
  reply_to: number;
};

export type Category = {
  id: number;
  category_name: string;
};

export type Categories = {
  [key: string]: Category;
};

export type Tag = {
  id: number;
  tag: string;
  category_id: number;
  created_at: string;
  updated_at: string;
};

export type Tags = {
  [key: number]: Tag;
};

export type Article = {
  article_type: "blog_article" | "preprint" | "scientific_article";
  id: number;
  title: string;
  subtitle: string;
  collaborators: {
    [key: number]: User;
  };
  content: ArticleContent;
  author: User;
  likes: Array<Object>;
  status: string;
  description: string;
  image: string;
  star: boolean;
  reviewers: Array<User>;
  category: string;
  created_at: string;
  updated_at: string;
  comments: { [key: number]: Comment };
  tags: Tags;
  activeSections: { [key: string]: number };
};

export type BlockIds = {
  [key: string]: string;
};

export type BlockIdQueue = {
  updated: BlockIds;
  created: BlockIds;
  deleted: BlockIds;
};

export type ActiveSections = { [key: string]: number };

export type ArticleState = {
  oneArticle: Article | null;
  allArticles: { [key: number]: Article };
  comments: { [key: number]: Comment };
  categories: Categories;
  tags: { [key: number]: Tag };
  versions: Array<any>;
  activeBlock: {
    id: string;
  } | null;
  activeSections: ActiveSections;
  blockIdQueue: BlockIdQueue;
  critical_section_ids: Array<string>;
  reviewers: Array<User>;
  reviews: Array<any>;
};
