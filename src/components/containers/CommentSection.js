import { Chip } from '@mui/material';
import {
  filter,
  get, includes, map,
} from 'lodash';
import React, { useCallback, useRef, useState } from 'react';
import { Mention, MentionsInput } from 'react-mentions';

import Comment from './Comment';

type Props = {
  comments: { key: Object},
  createComment: Function,
  articleId: number,
  authorId: number,
};

function CommentSection(props: Props): Node {
  const [tempComment, setTempComment] = useState({});
  const [expandedComment, setExpandedComment] = useState(null);
  const tempCommentRef = useRef(null);
  const [newCommentContent, setNewCommentContent] = useState('');

  console.log('comments', props.comments);

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

  const handleCancel = () => {
    setTempComment({});
  };

  const handleSaveReply = (replyContent, replyTo) => {
    console.log('handleSaveReply', props.articleId, props.authorId, replyContent, replyTo);
    props.createComment(props.articleId, props.authorId, replyContent, replyTo);
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

  const users = [
    {
      id: 'isaac',
      display: 'Isaac Newton',
    },
    {
      id: 'sam',
      display: 'Sam Victor',
    },
    {
      id: 'emma',
      display: 'emmanuel@nobody.com',
    },
  ];

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

  const handleNewEmptyReply = (replyContent, parentId) => {
    console.log('handleReply', replyContent);
    setExpandedComment(parentId);
    console.log(replyContent);
    setTempComment({
      id: 999,
      key: 999,
      comment: '@[test@test.com](test) ', // '@' + replyContent.author + ' ',
      rating: 0,
      alreadyVoted: 0,
      replyTo: replyContent.id,
      newComment: true,
      isTempComment: true,
    });
  };

  const handlePostNewComment = () => {
    console.log('handlePostNewComment', newCommentContent);
    setTempComment({});
    props.createComment(props.articleId, props.authorId, newCommentContent);
  };

  return (
    <div className="comment-section-wrapper">
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
            data={users}
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
      {map(renderedComments(), (comment) => (
        <Comment
          comment={comment}
          key={comment.id}
          onReply={(content) => handleNewEmptyReply(content, comment.id)}
          onCancel={handleCancel}
          onExpand={() => handleExpand(comment.id)}
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
            />
          ))}
        </Comment>
      ))}
    </div>
  );
}

export default CommentSection;
