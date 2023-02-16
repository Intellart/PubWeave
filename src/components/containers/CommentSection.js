import { Alert, AlertTitle, Chip } from '@mui/material';
import {
  filter,
  find,
  get, includes, isEmpty, map, uniqBy,
} from 'lodash';
import React, { useCallback, useRef, useState } from 'react';
import { Mention, MentionsInput } from 'react-mentions';
import { Link } from 'react-router-dom';
// import { Link } from 'react-router-dom';

import Comment from './Comment';

type Props = {
  comments: { key: Object},
  createComment: Function,
  articleId: number,
  authorId: number,
  currentUserId: number,
  author: Object,
  currentUser: Object,
};

function CommentSection(props: Props): Node {
  const [tempComment, setTempComment] = useState({});
  const [expandedComment, setExpandedComment] = useState(null);
  const tempCommentRef = useRef(null);
  const [newCommentContent, setNewCommentContent] = useState('');

  // console.log('comments', props.comments);

  const refCallback = useCallback((node: T) => {
    if (node !== null) {
      tempCommentRef.current = node;
      tempCommentRef.current.focus();
      setTimeout(() => {
        tempCommentRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        });
      }, 200);
    }
  }, []);

  const handleExpand = (id) => {
    if (expandedComment === id) {
      setExpandedComment(null);
    } else {
      setExpandedComment(id);
    }
  };

  const handleCancel = () => {
    setTempComment({});
  };

  const handleSaveReply = (replyContent, replyTo) => {
    props.createComment(props.articleId, props.currentUserId, replyContent, replyTo);
    setTempComment({});
  };

  const renderedComments = () => filter(map(props.comments, (comment) => {
    const { id } = comment;
    const replies = filter(props.comments, (reply) => get(reply.reply_to, 'id') === id);
    const renderTempComment = (id === tempComment.replyTo || includes(map(replies, 'id'), tempComment.replyTo));

    return {
      ...comment,
      replies: [
        ...replies,
        ...renderTempComment ? [tempComment] : [],
      ],
    };
  }), (comment) => !get(comment, 'reply_to.id'));

  const commenters = uniqBy([
    ...map(props.comments, (comment) => ({
      user_id: comment.commenter.id,
      id: comment.commenter.first_name + ' ' + comment.commenter.last_name,
      display: comment.commenter.first_name + ' ' + comment.commenter.last_name,
    })),
    {
      user_id: get(props.author, 'id'),
      id: get(props.author, 'full_name'),
      display: get(props.author, 'full_name'),
    },
    ...!isEmpty(tempComment) ? [{
      user_id: get(tempComment, 'commenter.id'),
      id: get(tempComment, 'commenter.first_name') + ' ' + get(tempComment, 'commenter.last_name'),
      display: get(tempComment, 'commenter.first_name') + ' ' + get(tempComment, 'commenter.last_name'),
    }] : [],
  ], 'user_id');

  const mentionsInputStyle = {
    control: {
      backgroundColor: '#fff',
      fontSize: 16,
    // fontWeight: 'normal',
    },
    '&multiLine': {
      control: {
        fontFamily: 'monospace',
        minHeight: 63,
      },
      highlighter: {
        padding: 9,
        border: '1px solid transparent',
      },
      input: {
        padding: 9,
        border: '1px solid silver',
        borderRadius: 8,
      },
    },
    '&singleLine': {
      display: 'inline-block',
      width: 180,
      highlighter: {
        padding: 1,
        border: '2px inset transparent',
      },
      input: {
        padding: 1,
        border: '2px inset',
      },
    },
    suggestions: {
      list: {
        backgroundColor: 'white',
        border: '1px solid rgba(0,0,0,0.15)',
        fontSize: 16,
      },
      item: {
        padding: '5px 15px',
        borderBottom: '1px solid rgba(0,0,0,0.15)',
        '&focused': {
          backgroundColor: '#cee4e5',
        },
      },
    },
  };

  const mentionsStyle = {
    backgroundColor: '#cee4e5',

  };

  const doesUserHasUsername = () => {
    const username = get(props.currentUser, 'username');

    if (username && username.length > 0) {
      return true;
    }

    return false;
  };

  const handleNewEmptyReply = (replyContent, parentId) => {
    // console.log('handleReply', replyContent);
    setExpandedComment(parentId);
    // console.log(replyContent);

    const parentComment = find(props.comments, { id: parentId });

    setTempComment({
      id: 999,
      key: 999,
      comment: `@[${parentComment.commenter.first_name} ${parentComment.commenter.last_name}](${parentComment.commenter.first_name} ${parentComment.commenter.last_name}) `,
      rating: 0,
      alreadyVoted: 0,
      replyTo: replyContent.id,
      newComment: true,
      isTempComment: true,
      commenter: {
        id: props.currentUserId,
        email: props.currentUser.email,
        first_name: props.currentUser.first_name,
        last_name: props.currentUser.last_name,
      },
    });
  };

  const handlePostNewComment = () => {
    setTempComment({});
    props.createComment(props.articleId, props.currentUserId, newCommentContent);
    setNewCommentContent('');
  };

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
              renderSuggestion={({ display, id }, search, highlightedDisplay, index, focused) => (
                <div
                  className={focused ? 'focused' : ''}
                  key={id}
                  style={{ backgroundColor: focused ? '#cee4e5' : 'transparent' }}
                >
                  {display} ({id})
                  <Chip
                    sx={{
                      ml: 1, height: 20, padding: 0, fontSize: 12,
                    }}
                    variant="outlined"
                    label="Author"
                    color='primary'
                  />
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
          <Alert severity="info">
            <AlertTitle>You can&apos;t comment yet</AlertTitle>
            You need to&nbsp;
            <Link>
              set your username in your profile
            </Link>
            &nbsp;to be able to comment.
          </Alert>
        </div>
      )}

      {map(renderedComments(), (comment) => (
        <Comment
          comment={comment}
          key={comment.id}
          onReply={(content) => handleNewEmptyReply(content, comment.id)}
          onCancel={handleCancel}
          onExpand={() => handleExpand(comment.id)}
          replyCount={get(comment, 'replies', []).length}
          currentUserId={props.currentUserId}
          authorId={props.authorId}
          commenters={commenters}
        >
          {expandedComment === comment.id && map(get(comment, 'replies', []), (reply) => (
            <Comment
              isReply
              ref={get(reply, 'isTempComment') ? refCallback : null}
              comment={reply}
              key={reply.id}
              onReply={(content) => handleNewEmptyReply(content, comment.id)}
              onCancel={handleCancel}
              onSave={(content) => handleSaveReply(content, comment.id)}
              currentUserId={props.currentUserId}
              authorId={props.authorId}
              commenters={commenters}
            />
          ))}
        </Comment>
      ))}
    </div>
  );
}

export default CommentSection;
