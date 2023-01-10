import { includes, isEmpty, map } from 'lodash';
import React from 'react';

import Comment from './Comment';

function CommentSection() {
  const [tempComment, setTempComment] = React.useState({});

  const handleReply = (replyContent) => {
    // eslint-disable-next-line
    console.log(replyContent);
    setTempComment({
      id: 999,
      key: 999,
      content: '@' + replyContent.username + ' ',
      rating: 0,
      alreadyVoted: 0,
      replyTo: replyContent.id,
      newComment: true,
    });
  };

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

  return (
    <div className="comment-section-wrapper">
      {map(comments, (comment) => (
        <Comment
          newComment={comment.newComment}
          id={comment.id}
          key={comment.id}
          onReply={handleReply}
          username={comment.username}
          onCancel={handleCancel}
          rating={comment.rating}
          alreadyVoted={comment.alreadyVoted}
          content={comment.content}
        >
          {map(comment.replies, (reply) => (
            <Comment
              newComment={reply.newComment}
              onCancel={handleCancel}
              id={reply.id}
              username={reply.username}
              key={reply.id}
              onReply={handleReply}
              rating={reply.rating}
              alreadyVoted={reply.alreadyVoted}
              content={reply.content}
            />
          ))}
        </Comment>
      ))}
    </div>
  );
}

export default CommentSection;
