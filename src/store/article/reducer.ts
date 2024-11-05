import { areBlocksEqual, convertBlocksFromBackend } from "../../utils/hooks";
import { filter, keyBy, omit, get, set, toInteger, map } from "lodash";
import { toast } from "react-toastify";
import type { ReduxActionWithPayload } from "../../types";
import { Article, ArticleState, articleTypes as types } from "./types";
import { differenceInSeconds } from "date-fns";
import { Reducer } from "@reduxjs/toolkit";

export const initialArticleState: ArticleState = {
  oneArticle: null,
  allArticles: {},
  comments: {},
  categories: {},
  tags: {},
  versions: [],
  reviewers: [],
  reviews: [],
  activeBlock: null,
  activeSections: {},
  blockIdQueue: {
    updated: {},
    created: {},
    deleted: {},
  },
  critical_section_ids: [],
};

export const reducer: Reducer<ArticleState, ReduxActionWithPayload> = (
  state,
  action
) => {
  if (!state) return initialArticleState;

  switch (action.type) {
    case types.ART_USER_REVIEW_ACCEPT_FULFILLED:
    case types.ART_USER_REVIEW_REJECT_FULFILLED:
      console.log("ART_USER_REVIEW_ACCEPT_FULFILLED");

      return {
        ...state,
        reviews: map(state?.reviews, (review) => {
          if (review.id === action.payload.review_id) {
            return {
              ...review,
              user_reviews: map(review.user_reviews, (userReview) => {
                if (userReview.id === action.payload.id) {
                  return {
                    ...userReview,
                    status: action.payload.status,
                  };
                }

                return userReview;
              }),
            };
          }

          return review;
        }),
      };

    case types.ART_FETCH_REVIEWS_FULFILLED:
      console.log("ART_FETCH_REVIEWS_FULFILLED");

      return {
        ...state,
        reviews: action.payload,
      };
    case types.ART_FETCH_ALL_REVIEWERS_FULFILLED:
      console.log("ART_FETCH_ALL_REVIEWERS_FULFILLED");

      return {
        ...state,
        reviewers: action.payload,
      };
    case types.ART_DELETE_REVIEWS_FULFILLED:
      console.log("ART_DELETE_REVIEWS_FULFILLED");

      return {
        ...state,
        reviews: filter(
          state.reviews,
          (review) => review.id !== toInteger(action.payload.id)
        ),
      };
    case types.ART_ADD_COLLABORATOR_FULFILLED:
      return {
        ...state,
        oneArticle: set(
          state.oneArticle as Article,
          "collaborators",
          keyBy(action.payload.collaborators, "id")
        ),
        allArticles: {
          ...state.allArticles,
          [action.payload.id]: set(
            state.allArticles[action.payload.id],
            "collaborators",
            keyBy(action.payload.collaborators, "id")
          ),
        },
      };
    case types.ART_CONVERT_ARTICLE_FULFILLED:
      console.log("ART_CONVERT_ARTICLE_FULFILLED");

      return {
        ...state,
        oneArticle: set(
          state.oneArticle as Article,
          "article_type",
          action.payload.article_type
        ),
        allArticles: {
          ...state.allArticles,
          [action.payload.id]: set(
            state.allArticles[action.payload.id],
            "article_type",
            action.payload.article_type
          ),
        },
      };

    case types.ART_CREATE_REVIEW_FULFILLED:
      console.log("ART_CREATE_REVIEW_FULFILLED");
      console.log(action.payload);

      return {
        ...state,
        reviews: [...state.reviews, action.payload],
      };

    case types.ART_FETCH_VERSIONS_FULFILLED:
      console.log("ART_FETCH_VERSIONS_FULFILLED");
      console.log(action.payload);

      return {
        ...state,
        versions: action.payload,
      };
    case types.WS_LOCK_SECTION:
    case types.WS_UNLOCK_SECTION:
      console.log("WS_(UN)LOCK_SECTION");

      return {
        ...state,
        activeSections: get(action.payload, "active_sections", {}),
      };
    case types.WS_BLOCK_UPDATE: {
      console.log("WS_BLOCK_UPDATE");
      // console.log(state);

      const { userId, payload: _newBlock } = action.payload;

      if (!state.oneArticle || !_newBlock) {
        return state;
      } else if (get(_newBlock, ["current_editor_id"]) === userId) {
        console.log("same author, ignoring");

        return state;
      }

      const newBlock = {
        ..._newBlock,
        addedToEditor: false,
      };

      const oldBlock = get(state.oneArticle, `content.blocks.${_newBlock.id}`);

      if (!oldBlock || areBlocksEqual(newBlock, oldBlock)) {
        console.log("same block or cant find, ignoring");

        return state;
      }

      const oldTime = new Date(oldBlock.time);
      const newTime = new Date(newBlock.time);

      console.log("old time", oldTime, "new time", newTime);

      // check if difference is bigger than 1 second
      if (
        Math.abs(differenceInSeconds(oldTime, newTime)) < 3 &&
        get(_newBlock, ["current_editor_id"]) === userId
      ) {
        console.log("time difference too small, ignoring");

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
      console.log("WS_BLOCK_CREATE", action.payload);

      const { userId, payload: _newBlock } = action.payload;

      if (!state.oneArticle) {
        return state;
      }

      if (get(_newBlock, ["current_editor_id"]) === userId) {
        console.log("same author, ignoring");

        return state;
      }

      const findBlock2 = get(
        state.oneArticle,
        `content.blocks.${_newBlock.id}`
      );

      if (findBlock2) {
        console.log("block already exists");

        return state;
      }

      // const oldTime = new Date(oldBlock.time);
      // const newTime = new Date(newBlock.time);

      // console.log('old time', oldTime, 'new time', newTime);

      // // check if difference is bigger than 1 second
      // if (Math.abs(subtract(oldTime, newTime)) < 3000 && get(_newBlock, ['current_editor_id']) === userId) {
      //   console.log('time difference too small, ignoring');

      //   return {
      //     ...state,
      //     activeSections: newBlock.active_sections,
      //   };
      // }

      return {
        ...state,
        oneArticle: set(
          state.oneArticle,
          `content.blocks.${_newBlock.id}`,
          _newBlock
        ),
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
      console.log("WS_BLOCK_REMOVE");

      const { userId, payload: _newBlock } = action.payload;

      if (get(_newBlock, ["current_editor_id"]) === userId) {
        console.log("same author, ignoring");

        return state;
      }

      const findBlock3 = get(
        state.oneArticle,
        `content.blocks.${_newBlock.id}`
      );

      console.log("found block to remove", findBlock3);

      if (!state.oneArticle || !findBlock3) {
        return state;
      }

      return {
        ...state,
        activeSections: _newBlock.active_sections,
        oneArticle: set(
          state.oneArticle,
          "content.blocks",
          omit(state.oneArticle.content.blocks, _newBlock.id)
        ),
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
      const { time, version, blocks } = get(action.payload, "content", "{}");

      if (action.payload.user_review_id) {
        console.log("reviewer updated", action.payload.user_review_id);

        return {
          ...state,
          oneArticle: set(
            state.oneArticle as Article,
            "reviewers",
            map(state.oneArticle?.reviewers, (reviewer) => {
              if (reviewer.id === action.payload.user_review_id) {
                return {
                  ...reviewer,
                  review_content: action.payload,
                };
              }

              return reviewer;
            })
          ),
        };
      }

      // console.log("article updated", action.payload.user_review_id);

      return {
        ...state,
        oneArticle: {
          ...action.payload,
          comments: keyBy(get(action.payload, "comments", []), "id"),
          content: {
            time,
            version,
            blocks: convertBlocksFromBackend(blocks),
          },
          tags: keyBy(get(action.payload, "tags", []), "id"),
        },
        reviews: map(state.reviews, (review) => {
          const reviewers = filter(
            action.payload.reviewers,
            (reviewer) => reviewer.review_id === review.id
          );

          return {
            ...review,
            user_reviews: reviewers,
          };
        }),
        activeSections: get(action.payload, "active_sections", {}),
        blockIdQueue: {
          updated: {},
          created: {},
          deleted: {},
        },
      };
    case types.BLOCK_SET_ACTIVE_BLOCK:
      return {
        ...state,
        activeBlock: action.payload,
      };

    case types.BLOCK_ID_QUEUE_ADD:
      const { blockId: id, blockAction: act } = action.payload;

      return {
        ...state,
        blockIdQueue: {
          ...state.blockIdQueue,
          [act]: {
            ...get(state.blockIdQueue, act, {}),
            [id]: false,
          },
        },
      };
    case types.BLOCK_ID_QUEUE_REMOVE:
      // const { blockId: blockToDel, blockAction: actToDel } = action.payload;

      // return {
      //   ...state,
      //   // oneArticle: set(state.oneArticle, `content.blocks.${blockToDel}`, {
      //   //   ...state.blockIdQueue[actToDel][blockToDel],
      //   //   id: blockToDel,
      //   // }),
      //   blockIdQueue: {
      //     ...state.blockIdQueue,
      //     [actToDel]: omit(state.blockIdQueue[actToDel], blockToDel),
      //   },
      // };
      return state;
    case types.BLOCK_ID_QUEUE_COMPLETE:
      const { blockId: blockToDel, blockAction: actToDel } = action.payload;

      return {
        ...state,
        blockIdQueue: {
          ...state.blockIdQueue,
          [actToDel]: omit(get(state.blockIdQueue, actToDel), blockToDel),
        },
      };
    case types.ART_FLUSH_ARTICLE_FULFILLED:
      toast.success("Article flushed.");

      return {
        ...state,
        oneArticle: null,
      };
    case types.ART_FETCH_ALL_ARTICLES_FULFILLED:
      // eslint-disable-next-line no-console
      console.log(
        `Fetched all articles: ${get(action.payload, "length")} articles.`
      );

      return {
        ...state,
        allArticles: keyBy(action.payload, "id"),
      };

    // COMMENTS ---------------------------------------------------------
    // ------------------------------------------------------------------

    case types.ART_CREATE_COMMENT_FULFILLED:
      toast.success("Comment created successfully!");

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
      toast.success("Comment deleted successfully!");
      console.log("delete", action.payload);

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
      toast.success("Comment liked successfully!");
      console.log("like", action.payload);

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
      // toast.success("Comment unliked successfully!");
      // console.log("unlike", action.payload);

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
      // toast.success("Article liked successfully!");
      // console.log("like", action.payload);

      return {
        ...state,
        ...(state.oneArticle && {
          oneArticle: {
            ...state.oneArticle,
            likes: action.payload.likes,
          },
        }),
        allArticles: {
          ...state.allArticles,
          [action.payload.id]: {
            ...state.allArticles[action.payload.id],
            likes: action.payload.likes,
          },
        },
      };

    case types.ART_LIKE_ARTICLE_REMOVAL_FULFILLED:
      toast.success("Article unliked successfully!");
      console.log("unlike", action.payload);

      return {
        ...state,
        ...(state.oneArticle && {
          oneArticle: {
            ...state.oneArticle,
            likes: action.payload.likes,
          },
        }),
        allArticles: {
          ...state.allArticles,
          [action.payload.id]: {
            ...state.allArticles[action.payload.id],
            likes: action.payload.likes,
          },
        },
      };

    // CATEGORIES ---------------------------------------------------------
    // --------------------------------------------------------------------

    case types.ART_FETCH_CATEGORIES_FULFILLED:
      // eslint-disable-next-line no-console
      console.log(
        `Fetched all categories: ${get(action.payload, "length")} categories.`
      );

      return {
        ...state,
        categories: keyBy(action.payload, "id"),
      };

    // TAGS ---------------------------------------------------------------
    // --------------------------------------------------------------------

    case types.ART_FETCH_TAGS_FULFILLED:
      // eslint-disable-next-line no-console
      console.log(`Fetched all tags: ${get(action.payload, "length")} tags.`);

      return {
        ...state,
        tags: keyBy(action.payload, "id"),
      };

    case types.ART_FETCH_TAGS_REJECTED:
      toast.error("Error while fetching tags!");

      return state;

    case types.ART_ADD_TAG_FULFILLED:
      toast.success("Tag added successfully!");

      if (!state.oneArticle) {
        return state;
      }

      return {
        ...state,
        oneArticle: {
          ...state.oneArticle,
          tags: keyBy(get(action.payload, "tags", []), "id"),
        },
      };

    case types.ART_REMOVE_TAG_FULFILLED:
      toast.success("Tag removed successfully!");

      if (!state.oneArticle) {
        return state;
      }

      return {
        ...state,
        oneArticle: {
          ...state.oneArticle,
          tags: keyBy(get(action.payload, "tags", []), "id"),
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
          content: get(state.oneArticle, "content"),
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
      if (action.payload.user_review_id) {
        toast.success(`Created ${action.payload.title} successfully!`);

        return {
          ...state,
          oneArticle: set(
            state.oneArticle as Article,
            "reviewers",
            map(state.oneArticle?.reviewers, (reviewer) => {
              if (reviewer.id === action.payload.user_review_id) {
                return {
                  ...reviewer,
                  review_content: action.payload,
                };
              }

              return reviewer;
            })
          ),
        };
      }

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
      toast.success(
        `Changed status of ${action.payload.title} to ${action.payload.status}.`
      );

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
      toast.error("Error while updating article!");

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
