import { Chip } from '@mui/material';
import {
  get, includes, isEmpty, map,
} from 'lodash';
import React, { useCallback } from 'react';
import { Mention, MentionsInput } from 'react-mentions';

import Comment from './Comment';

function CommentSection() {
  const [tempComment, setTempComment] = React.useState({});
  const [expandedComment, setExpandedComment] = React.useState(null);
  const tempCommentRef = React.useRef(null);
  const [newCommentContent, setNewCommentContent] = React.useState('');

  const handleReply = (replyContent, parentId) => {
    setTempComment({});
    // eslint-disable-next-line
    // eslint-disable-next-line no-console
    console.log(replyContent);
    setExpandedComment(parentId);
    setTempComment({
      id: 999,
      key: 999,
      content: '@' + replyContent.author + ' ',
      rating: 0,
      alreadyVoted: 0,
      replyTo: replyContent.id,
      newComment: true,
      isTempComment: true,
    });
  };

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

  let comments = [
    {
      id: 1,
      content: 'I just read this article and I found it really interesting! The authors did a great job of explaining the research and the implications for the field.',
      rating: 10,
      username: 'johndoe',
      alreadyVoted: 1,
      replies: [
        {
          id: 2,
          content: 'I agree, this was a well-written and thought-provoking article. I\'m looking forward to seeing more research in this area. I agree, this was a well-written and thought-provoking article. I\'m looking forward to seeing more research in this area.',
          username: 'janedoe',
          rating: 6,
        },
        {
          id: 3,
          content: 'I have a question about the methods used in the study. Could the authors provide more detail on the sample size and statistical analysis?',
          username: 'maryjane',
          rating: 2,
          alreadyVoted: 1,
        },
        {
          id: 4,
          content: 'Thank you for your comments! In response to the question about the sample size, @maryjane we used a sample of 200 participants. For the statistical analysis, we used a two-tailed t-test to compare the results of the experimental group to the control group.',
          username: 'author',
          rating: 4,
        },

      ],
    },
    {
      id: 5,
      content: 'I just read this article and I found it really interesting! The authors did a great job of explaining the research and the implications for the field.',
      rating: 10,
      username: 'johndoe',
      alreadyVoted: 1,
      replies: [
        {
          id: 6,
          content: 'Thank you for your comments! In response to the question about the sample size, @maryjane we used a sample of 200 participants. For the statistical analysis, we used a two-tailed t-test to compare the results of the experimental group to the control group.',
          username: 'author',
          rating: 4,
        },
      ],
    },
    {
      id: 7,
      content: 'I just read this article and I found it really interesting! The authors did a great job of explaining the research and the implications for the field.',
      rating: 10,
      username: 'johndoe',
      alreadyVoted: 1,
      replies: [],
    },
  ];

  if (!isEmpty(tempComment)) {
    const { replyTo } = tempComment;

    comments = map(comments, (comment) => {
      if (comment.id === replyTo || includes(map(comment.replies, 'id'), replyTo)) {
        return {
          ...comment,
          replies: [
            ...comment.replies,
            tempComment,
          ],
        };
      }

      return comment;
    });
  }

  const handleExpand = (id) => {
    if (expandedComment === id) {
      setExpandedComment(null);
    } else {
      setExpandedComment(id);
    }
  };

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

  const handleNewPost = () => {
    setTempComment({});
    // eslint-disable-next-line
    // eslint-disable-next-line no-console
    comments.push({
      id: 999,
      key: 999,
      content: newCommentContent,
      rating: 0,
      alreadyVoted: 0,
      replyTo: null,
      newComment: false,
      isTempComment: false,
    });
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
          onClick={handleNewPost}
        >
          Post
        </button>
      </div>
      {map(comments, (comment) => (
        <Comment
          newComment={comment.newComment}
          id={comment.id}
          key={comment.id}
          onReply={(content) => handleReply(content, comment.id)}
          username={comment.username}
          onCancel={handleCancel}
          rating={comment.rating}
          alreadyVoted={comment.alreadyVoted}
          content={comment.content}
          hasReplies={comment.replies.length > 0}
          onExpand={() => handleExpand(comment.id)}
        >
          {expandedComment === comment.id && map(comment.replies, (reply) => (
            <Comment
              newComment={reply.newComment}
              onCancel={handleCancel}
              id={reply.id}
              username={reply.username}
              key={reply.id}
              onReply={(content) => handleReply(content, comment.id)}
              rating={reply.rating}
              alreadyVoted={reply.alreadyVoted}
              content={reply.content}
              ref={get(reply, 'isTempComment') ? refCallback : null}
            />
          ))}
        </Comment>
      ))}
    </div>
  );
}

export default CommentSection;
