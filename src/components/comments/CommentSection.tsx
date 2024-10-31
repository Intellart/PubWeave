/* eslint-disable camelcase */

import { Alert, AlertTitle, Chip } from "@mui/material";
import {
  filter,
  find,
  get,
  includes,
  isEmpty,
  isEqual,
  map,
  uniqBy,
} from "lodash";
import { useCallback, useRef, useState } from "react";
import { Mention, MentionsInput } from "react-mentions";
import { Link } from "react-router-dom";
// import { Link } from 'react-router-dom';

import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import userSelectors from "../../store/user/selectors";
import articleSelectors from "../../store/article/selectors";
import articleActions from "../../store/article/actions";

type Props = {
  articleId: number;
};

function CommentSection(props: Props) {
  const [tempComment, setTempComment] = useState<any>({});
  const [expandedComment, setExpandedComment] = useState<number | null>(null);
  const tempCommentRef = useRef(null);
  const [newCommentContent, setNewCommentContent] = useState("");

  const article = useSelector(articleSelectors.article, isEqual);
  const user = useSelector(userSelectors.getUser, isEqual);

  const dispatch = useDispatch();
  const createComment = (
    articleId: number,
    userId: number,
    comment: string,
    replyTo?: number
  ) =>
    dispatch(articleActions.createComment(articleId, userId, comment, replyTo));

  const comments = get(article, "comments", []);
  const userId = get(user, "id");
  const author = get(article, "author");

  const refCallback = useCallback((node: any) => {
    if (node !== null) {
      tempCommentRef.current = node;
      tempCommentRef.current.focus();
      setTimeout(() => {
        if (tempCommentRef.current) {
          tempCommentRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
          });
        }
      }, 200);
    }
  }, []);

  const handleExpand = (id: number) => {
    if (expandedComment === id) {
      setExpandedComment(null);
    } else {
      setExpandedComment(id);
    }
  };

  const handleCancel = () => {
    setTempComment({});
  };

  const handleSaveReply = (replyContent: string, replyTo: number) => {
    if (isEmpty(replyContent) || replyContent === "") {
      return;
    }
    createComment(props.articleId, userId, replyContent, replyTo);
    setTempComment({});
  };

  const renderedComments = () =>
    filter(
      map(comments, (comment) => {
        const { id } = comment;
        const replies = filter(
          comments,
          (reply) => get(reply, "reply_to_id") === id
        );
        const renderTempComment =
          id === tempComment.replyTo ||
          includes(map(replies, "id"), tempComment.replyTo);

        return {
          ...comment,
          replies: [...replies, ...(renderTempComment ? [tempComment] : [])],
        };
      }),
      (comment) => !get(comment, "reply_to_id")
    );

  const commenters = uniqBy(
    [
      ...map(comments, (comment) => ({
        user_id: get(comment, "commenter.id"),
        id: get(comment, "commenter.username"),
        display:
          get(comment, "commenter.first_name") +
          " " +
          get(comment, "commenter.last_name"),
      })),
      {
        user_id: get(author, "id"),
        id: get(author, "username"),
        display: get(author, "full_name"),
      },
      ...(!isEmpty(tempComment)
        ? [
            {
              user_id: get(tempComment, "commenter.id"),
              id: get(tempComment, "commenter.username"),
              display:
                get(tempComment, "commenter.first_name") +
                " " +
                get(tempComment, "commenter.last_name"),
            },
          ]
        : []),
    ],
    "user_id"
  );

  const mentionsInputStyle = {
    control: {
      backgroundColor: "#fff",
      fontSize: 16,
      // fontWeight: 'normal',
    },
    "&multiLine": {
      control: {
        fontFamily: "monospace",
        minHeight: 63,
      },
      highlighter: {
        padding: 9,
        border: "1px solid transparent",
      },
      input: {
        padding: 9,
        border: "1px solid silver",
        borderRadius: 8,
      },
    },
    "&singleLine": {
      display: "inline-block",
      width: 180,
      highlighter: {
        padding: 1,
        border: "2px inset transparent",
      },
      input: {
        padding: 1,
        border: "2px inset",
      },
    },
    suggestions: {
      list: {
        backgroundColor: "white",
        border: "1px solid rgba(0,0,0,0.15)",
        fontSize: 16,
      },
      item: {
        padding: "5px 15px",
        borderBottom: "1px solid rgba(0,0,0,0.15)",
        "&focused": {
          backgroundColor: "#cee4e5",
        },
      },
    },
  };

  const mentionsStyle = {
    backgroundColor: "#cee4e5",
  };

  const doesUserHasUsername = () => {
    const username = get(user, "username");

    if (username && username.length > 0) {
      return true;
    }

    return false;
  };

  const handleNewEmptyReply = (replyContent: any, parentId: number) => {
    // console.log('handleReply', replyContent);
    setExpandedComment(parentId);
    // console.log(replyContent);

    const parentComment = find(comments, { id: parentId });

    setTempComment({
      id: 999,
      key: 999,
      comment: `@[${parentComment.commenter.username}](${parentComment.commenter.username}) `,
      rating: 0,
      alreadyVoted: 0,
      replyTo: replyContent.id,
      newComment: true,
      isTempComment: true,
      updated_at: new Date(),
      commenter: {
        id: userId,
        ...user,
      },
    });
  };

  const handlePostNewComment = () => {
    if (isEmpty(newCommentContent) || newCommentContent === "") {
      return;
    }
    setTempComment({});
    createComment(props.articleId, userId, newCommentContent);
    setNewCommentContent("");
  };

  // console.log('r', renderedComments());

  const dontHaveAccount = (
    <Alert severity="info">
      <AlertTitle>You don&apos;t have an account yet</AlertTitle>
      <Link to="/login">You can create one here</Link>
    </Alert>
  );

  const dontHaveUsername = (
    <Alert severity="info">
      <AlertTitle>You can&apos;t comment yet</AlertTitle>
      You need to&nbsp;
      <Link to="/user">set your username in your profile</Link>
      &nbsp;to be able to comment.
    </Alert>
  );

  return (
    <div className="comment-section-wrapper">
      {doesUserHasUsername() ? (
        <div className="comment-section-new-comment-wrapper">
          <MentionsInput
            style={mentionsInputStyle}
            className="comment-section-new-comment"
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
          >
            <Mention
              trigger="@"
              displayTransform={(id) => `@${id}`}
              style={mentionsStyle}
              data={commenters}
              renderSuggestion={(
                { display, id, user_id },
                search,
                highlightedDisplay,
                index,
                focused
              ) => (
                <div
                  className={focused ? "focused" : ""}
                  key={id}
                  style={{
                    backgroundColor: focused ? "#cee4e5" : "transparent",
                  }}
                >
                  {display} ({id})
                  {user_id === get(author, "id") && (
                    <Chip
                      sx={{
                        ml: 1,
                        height: 20,
                        padding: 0,
                        fontSize: 12,
                      }}
                      variant="outlined"
                      label="Author"
                      color="primary"
                    />
                  )}
                </div>
              )}
            />
          </MentionsInput>

          <button
            type="button"
            className="comment-section-new-comment-button"
            onClick={handlePostNewComment}
          >
            Post
          </button>
        </div>
      ) : (
        <div className="comment-section-notification-username-wrapper">
          {userId ? dontHaveUsername : dontHaveAccount}
        </div>
      )}

      {map(renderedComments(), (comment) => (
        <Comment
          comment={comment}
          key={comment.id}
          onReply={(content) => handleNewEmptyReply(content, comment.id)}
          onCancel={handleCancel}
          onExpand={() => handleExpand(comment.id)}
          replyCount={get(comment, "replies", []).length}
          currentUserId={userId}
          authorId={get(author, "id")}
          commenters={commenters}
        >
          {expandedComment === comment.id &&
            map(get(comment, "replies", []), (reply) => (
              <Comment
                isReply
                ref={get(reply, "isTempComment") ? refCallback : null}
                comment={reply}
                key={reply.id}
                onReply={(content) => handleNewEmptyReply(content, comment.id)}
                onCancel={handleCancel}
                onSave={(content) => handleSaveReply(content, comment.id)}
                currentUserId={userId}
                authorId={get(author, "id")}
                commenters={commenters}
              />
            ))}
        </Comment>
      ))}
    </div>
  );
}

export default CommentSection;
