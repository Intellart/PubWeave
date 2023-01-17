/* eslint-disable no-unused-vars */
import { WindowSharp } from '@mui/icons-material';
import {
  Fade, Paper, Popover, Popper, TextareaAutosize, Typography,
} from '@mui/material';
import {
  get, includes, isEmpty, map,
} from 'lodash';
import React, { useCallback } from 'react';

import Comment from './Comment';

function CommentSection() {
  const [tempComment, setTempComment] = React.useState({});
  const [expandedComment, setExpandedComment] = React.useState(null);
  const tempCommentRef = React.useRef(null);
  const [newCommentContent, setNewCommentContent] = React.useState('');
  const [newCommentInFocus, setNewCommentInFocus] = React.useState(false);
  const [mentionsPopoverActive, setMentionsPopoverActive] = React.useState({
  });
  const [currentCarretPosition, setCurrentCarretPosition] = React.useState(0);

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

  const textAreaRef = React.useRef(null);

  function getCaretCharacterOffsetWithin(element) {
    let caretOffset = 0;
    const doc = element.ownerDocument || element.document;
    const win = doc.defaultView || doc.parentWindow;
    let sel;
    if (typeof win.getSelection !== 'undefined') {
      sel = win.getSelection();
      if (sel.rangeCount > 0) {
        const range = win.getSelection().getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
      }
    } else if ((sel === doc.selection) && sel.type !== 'Control') {
      sel = doc.selection;
      const textRange = sel.createRange();
      const preCaretTextRange = doc.body.createTextRange();
      preCaretTextRange.moveToElementText(element);
      preCaretTextRange.setEndPoint('EndToEnd', textRange);
      caretOffset = preCaretTextRange.text.length;
    }

    return caretOffset;
  }

  return (
    <div className="comment-section-wrapper">
      <div className="comment-section-new-comment-wrapper">
        <textarea
          ref={textAreaRef}
          onFocus={() => setNewCommentInFocus(true)}
          onBlur={() => setNewCommentInFocus(false)}
          onSelect={(e) => {
            const { selectionStart, selectionEnd } = e.target;
            const { value } = e.target;
            const selectedText = value.substring(selectionStart, selectionEnd);
            const selectedTextLength = selectedText.length;

            // console.log(selectedTextLength);
            // console.log(selectedText);
            // console.log(selectionStart);
            // console.log(selectionEnd);

            if (selectionStart === selectionEnd) {
              const letter = newCommentContent[selectionStart - 1];

              if (letter === '@') {
                setCurrentCarretPosition(selectionStart);
                console.log(selectionStart);
                console.log(newCommentContent);

                // finds all '\n' before selectionStart
                const newLines = newCommentContent.substring(0, selectionStart).match(/\n/g);
                const newLinesCount = newLines ? newLines.length : 0;
                console.log('row', newLinesCount);

                // find num of chars between last '\n' and selectionStart
                let charsAfterLastNewLine = selectionStart - newCommentContent.lastIndexOf('\n') - 1;
                if (charsAfterLastNewLine < 0) { charsAfterLastNewLine = selectionStart; }
                console.log('col', charsAfterLastNewLine);

                setMentionsPopoverActive({
                  top: textAreaRef.current ? textAreaRef.current.offsetTop + 0.7 * window.innerHeight - newLinesCount * 20 : 0,
                  left: textAreaRef.current ? textAreaRef.current.offsetLeft + charsAfterLastNewLine * window.getComputedStyle(textAreaRef.current).fontSize.replace('px', '') + 20 : 0,
                });
              } else {
                setMentionsPopoverActive({});
              }
            }
          }}
          className="comment-section-new-comment"
          value={newCommentContent}
          onChange={(e) => setNewCommentContent(e.target.value)}
        />
        <Popover
          hideBackdrop
          disableAutoFocus
          disableEnforceFocus
          open={!isEmpty(mentionsPopoverActive)}
          anchorReference="anchorPosition"
          anchorPosition={{ top: mentionsPopoverActive.top || 0, left: mentionsPopoverActive.left || 0 }}
          onClick={() => setMentionsPopoverActive({})}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <div className="comment-section-mentions-popover">
            <div className="comment-section-mentions-popover-header">
              <span className="comment-section-mentions-popover-header-title">People</span>
              <span className="comment-section-mentions-popover-header-subtitle">Mention someone to notify them</span>
            </div>
            <div className="comment-section-mentions-popover-content">
              <div
                onClick={() => {
                  setNewCommentContent(newCommentContent.slice(0, currentCarretPosition) + 'johndoe ' + newCommentContent.slice(currentCarretPosition));
                }}
                className="comment-section-mentions-popover-content-item"
              >
                <div className="comment-section-mentions-popover-content-item-avatar">
                  <img src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50" alt="avatar" />
                </div>
                <div className="comment-section-mentions-popover-content-item-info">
                  <span className="comment-section-mentions-popover-content-item-info-username">johndoe</span>
                  <span className="comment-section-mentions-popover-content-item-info-name">John Doe</span>
                </div>
              </div>
              <div
                onClick={() => {
                  setNewCommentContent(newCommentContent.slice(0, currentCarretPosition) + 'johndoe ' + newCommentContent.slice(currentCarretPosition));
                }}
                className="comment-section-mentions-popover-content-item"
              >
                <div className="comment-section-mentions-popover-content-item-avatar">
                  <img src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50" alt="avatar" />
                </div>
                <div className="comment-section-mentions-popover-content-item-info">
                  <span className="comment-section-mentions-popover-content-item-info-username">johndoe</span>
                  <span className="comment-section-mentions-popover-content-item-info-name">John Doe</span>
                </div>
              </div>
              <div
                onClick={() => {
                  setNewCommentContent(newCommentContent.slice(0, currentCarretPosition) + 'johndoe ' + newCommentContent.slice(currentCarretPosition));
                }}
                className="comment-section-mentions-popover-content-item"
              >
                <div className="comment-section-mentions-popover-content-item-avatar">
                  <img src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50" alt="avatar" />
                </div>
                <div className="comment-section-mentions-popover-content-item-info">
                  <span className="comment-section-mentions-popover-content-item-info-username">johndoe</span>
                  <span className="comment-section-mentions-popover-content-item-info-name">John Doe</span>
                </div>
              </div>
              <div
                onClick={() => {
                  setNewCommentContent(newCommentContent.slice(0, currentCarretPosition) + 'johndoe ' + newCommentContent.slice(currentCarretPosition));
                }}
                className="comment-section-mentions-popover-content-item"
              >
                <div className="comment-section-mentions-popover-content-item-avatar">
                  <img src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50" alt="avatar" />
                </div>
                <div className="comment-section-mentions-popover-content-item-info">
                  <span className="comment-section-mentions-popover-content-item-info-username">johndoe</span>
                  <span className="comment-section-mentions-popover-content-item-info-name">John Doe</span>
                </div>
              </div>
              <div
                onClick={() => {
                  setNewCommentContent(newCommentContent.slice(0, currentCarretPosition) + 'johndoe ' + newCommentContent.slice(currentCarretPosition));
                }}
                className="comment-section-mentions-popover-content-item"
              >
                <div className="comment-section-mentions-popover-content-item-avatar">
                  <img src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50" alt="avatar" />
                </div>
                <div className="comment-section-mentions-popover-content-item-info">
                  <span className="comment-section-mentions-popover-content-item-info-username">johndoe</span>
                  <span className="comment-section-mentions-popover-content-item-info-name">John Doe</span>
                </div>
              </div>
              <div
                onClick={() => {
                  setNewCommentContent(newCommentContent.slice(0, currentCarretPosition) + 'johndoe ' + newCommentContent.slice(currentCarretPosition));
                }}
                className="comment-section-mentions-popover-content-item"
              >
                <div className="comment-section-mentions-popover-content-item-avatar">
                  <img src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50" alt="avatar" />
                </div>
                <div className="comment-section-mentions-popover-content-item-info">
                  <span className="comment-section-mentions-popover-content-item-info-username">johndoe</span>
                  <span className="comment-section-mentions-popover-content-item-info-name">John Doe</span>
                </div>
              </div>
            </div>
          </div>
        </Popover>
        <button type="button" className="comment-section-new-comment-button">
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
