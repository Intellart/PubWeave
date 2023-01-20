/* eslint-disable react/no-unused-prop-types */
import React, { useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { faComment, faHandsClapping, faReply } from '@fortawesome/free-solid-svg-icons';

import TextareaAutosize from '@mui/base/TextareaAutosize';
import classNames from 'classnames';

type Props = {
  id?: number,
  content: string,
  username?: string,
  time?: string,
  isReply?: boolean,
  authorImage?: any,
  rating?: number,
  alreadyVoted?: number,
  editComment?: Function,
  deleteComment?: Function,
  replyComment?: Function,
  children?: React.Node,
  onReply?: Function,
  newComment?: boolean,
  onCancel?: Function,
  onSave?: Function,
  onExpand?: Function,
  hasReplies?: boolean,
};

const Comment = React.forwardRef((props: Props, ref) => {
  const [content, setContent] = React.useState(props.content || '');
  const [editMode, setEditMode] = React.useState(false);
  const [editContent, setEditContent] = React.useState(props.content);
  const [rating, setRating] = React.useState(props.rating || 0);
  const [alreadyVoted, setAlreadyVoted] = React.useState(props.alreadyVoted || 0);

  useEffect(() => {
    setContent(props.content || '');
  }, [props.content]);

  const handleSave = () => {
    setEditMode(false);
    setContent(editContent);
    props.onSave(editContent);
  };

  const formatText = (text) => {
    const newContent = text.split(/((?:#|@|https?:\/\/[^\s]+)[a-zA-Z]+)/);
    let hashtag;
    let username;

    return newContent.map((word) => {
      if (word.startsWith('#')) {
        hashtag = word.replace('#', '');

        return (
          <a
            href={`/hashtag/${hashtag}`}
            className="text-cyanBlue/80 hover:text-cyanBlue"
            key={word}
          >
            {word}
          </a>
        );
      } else if (word.startsWith('@')) {
        username = word.replace('@', '');

        return (
          <a
            key={word}
            href={`/profile/${username}`}
            className="text-cyanBlue/80 hover:text-cyanBlue"
          >
            {word}
          </a>
        );
      } else if (word.includes('http')) {
        return <a target="_blank" href={word} className="text-cyanBlue/80 hover:text-cyanBlue">{word}</a>;
      } else {
        return word;
      }
    });
  };

  return (
    <div className="comment-wrapper">
      <div ref={ref} className="comment">
        <div className="comment-content-upper">
          <div className="comment-content-upper-user">
            <div className="comment-content-upper-user-image">
              <FontAwesomeIcon icon={faUserCircle} />
            </div>
            <div className="comment-content-upper-user-text">
              <div className="comment-content-upper-user-text-upper">
                <p className='comment-content-upper-user-text-username'>{props.username}</p>
                <p className='comment-content-upper-user-text-tag'>You</p>
              </div>
              <div className="comment-content-upper-user-text-lower">
                <p>1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
        <div className="comment-content-middle">
          {(props.newComment || editMode) ? (
            <>
              <TextareaAutosize
                className="comment-content-body-textarea"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <div className="comment-content-body-buttons">
                <button
                  className="comment-content-body-buttons-cancel"
                  onClick={() => {
                    setEditMode(false);
                    props.onCancel();
                  }}
                >
                  Cancel
                </button>
                <button
                  className="comment-content-body-buttons-save"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </>
          ) : (

            <p>
              {formatText(content)}
            </p>
          )}
        </div>
        {!props.newComment && (
        <div className="comment-content-lower">
          <div className="comment-content-lower-left">
            <FontAwesomeIcon
              className={classNames('comment-content-lower-vote', {
                'comment-content-lower-vote-active': alreadyVoted === 1,
              })}
              onClick={() => {
                if (alreadyVoted === 1) {
                  setRating(rating - 1);
                  setAlreadyVoted(0);
                } else {
                  setRating(rating + 1);
                  setAlreadyVoted(1);
                }
              }
            }
              icon={faHandsClapping}
            />
            <p>{rating}</p>
            {props.hasReplies && (
            <FontAwesomeIcon
              className="comment-content-lower-reply"
              onClick={() => props.onExpand()}
              icon={faComment}
            />
            )
            }
          </div>
          <div
            onClick={() => props.onReply({
              content,
              author: props.username,
              id: props.id,
            })
        }
            className="comment-content-lower-right"
          >
            <FontAwesomeIcon
              className="comment-content-lower-reply"
              icon={faReply}
            />
            &nbsp;Reply
          </div>
        </div>
        )}
      </div>
      <div className="comment-replies">
        {props.children}
      </div>
    </div>
  );
});

export default Comment;
