/* eslint-disable react/no-unused-prop-types */
import React, { useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { faMinus, faPlus, faReply } from '@fortawesome/free-solid-svg-icons';

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
};

function Comment(props: Props) {
  const [content, setContent] = React.useState(props.content);
  const [editMode, setEditMode] = React.useState(false);
  const [editContent, setEditContent] = React.useState(props.content);
  const [rating, setRating] = React.useState(props.rating || 0);
  const [alreadyVoted, setAlreadyVoted] = React.useState(props.alreadyVoted || 0);

  useEffect(() => {
    setContent(props.content);
  }, [props.content]);

  const handleSave = () => {
    setEditMode(false);
    setContent(editContent);
    // props.editComment(editContent);
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

  const renderContent = () => {
    const newContent = content;

    return formatText(newContent);
  };

  return (
    <div className="comment-wrapper">
      <div className="comment">
        <div className="comment-rating unselectable">
          <div
            className={classNames('comment-rating-up', {
              'comment-rating-up-active': alreadyVoted === 1,
            })}
            onClick={() => {
              if (alreadyVoted === 1) {
                setRating(rating - 1);
                setAlreadyVoted(0);
              } else {
                setRating(rating + 1);
                setAlreadyVoted(1);
              }
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
          </div>
          <div className="comment-rating-number">
            <p>{rating}</p>
          </div>
          <div
            className={classNames('comment-rating-down', {
              'comment-rating-down-active': alreadyVoted === -1,
            })}
            onClick={() => {
              if (alreadyVoted === -1) {
                setRating(rating + 1);
                setAlreadyVoted(0);
              } else {
                setRating(rating - 1);
                setAlreadyVoted(-1);
              }
            }}
          >
            <FontAwesomeIcon icon={faMinus} />
          </div>
        </div>
        <div className="comment-content">
          <div className="comment-content-header">
            <div className="comment-content-header-left">
              <div className="comment-content-header-left-user-image">
                <FontAwesomeIcon icon={faUserCircle} />
              </div>
              <div className="comment-content-header-left-user-username">
                <p>{props.username}</p>
              </div>
              <div className="comment-content-header-left-comment-time">
                <p>1 hour ago</p>
              </div>
            </div>
            <div className="comment-content-header-right">
              <div
                className="comment-content-header-right-comment-reply"
                onClick={() => props.onReply({
                  content,
                  author: props.username,
                  id: props.id,
                })
                }
              >
                <p><FontAwesomeIcon icon={faReply} /> Reply</p>
              </div>
              <div
                className="comment-content-header-right-comment-edit"
                onClick={() => setEditMode(true)}
              >
                <p style={{ color: '#1E5F8B' }}><FontAwesomeIcon icon={faPenToSquare} style={{ color: '#1E5F8B' }} /> Edit</p>
              </div>
            </div>
          </div>
          <div className="comment-content-body">
            {(props.newComment || editMode) ? (
              <>
                <TextareaAutosize
                  className="comment-content-body-textarea"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  // onBlur={() => {
                  //   setEditMode(false);
                  //   setContent(editContent);
                  //   props.editComment(editContent);
                  // }}
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
                {renderContent()}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="comment-replies">
        {props.children}
      </div>
    </div>
  );
}

export default Comment;
