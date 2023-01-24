/* eslint-disable react/no-unused-prop-types */
import React, { useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { faComment, faHandsClapping, faReply } from '@fortawesome/free-solid-svg-icons';

import classNames from 'classnames';
import { Mention, MentionsInput } from 'react-mentions';
import { Chip } from '@mui/material';
import { get } from 'lodash';

type Props = {
  id?: number,
  children?: React.Node,
  onReply?: Function,
  onCancel?: Function,
  onSave?: Function,
  onExpand?: Function,
  comment: Object,
  isReply?: boolean,
};

const Comment = React.forwardRef((props: Props, ref) => {
  const [content, setContent] = React.useState(props.comment.comment || '');
  const [editMode, setEditMode] = React.useState(false);
  const [rating, setRating] = React.useState(props.comment.rating || 0);
  const [alreadyVoted, setAlreadyVoted] = React.useState(props.comment.alreadyVoted || 0);

  // console.log('Comment props', props.comment);

  useEffect(() => {
    setContent(props.comment.comment || '');
  }, [props.comment.comment]);

  const handleSave = () => {
    setEditMode(false);
    props.onSave(content);
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

  const users = [
    {
      id: 'test',
      display: 'test@test.com',
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
                <p className='comment-content-upper-user-text-username'>{get(props.comment, 'commenter.email', 'No Name')}</p>
                <p className='comment-content-upper-user-text-tag'>You</p>
              </div>
              <div className="comment-content-upper-user-text-lower">
                <p>ID: {get(props.comment, 'id')} || ReplyTo: {get(props.comment, 'reply_to.id')}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="comment-content-middle">
          {(props.comment.newComment || editMode) ? (
            <>
              <MentionsInput
                style={mentionsInputStyle}
                className="comment-section-new-comment"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
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
        {!props.comment.newComment && (
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
            {props.comment.hasReplies && (
            <FontAwesomeIcon
              className="comment-content-lower-reply"
              onClick={() => props.onExpand()}
              icon={faComment}
            />
            )
            }
          </div>
          <div
            onClick={() => {
              props.onReply({
                content: props.comment.content,
                author: props.comment.commenter.first_name,
                id: props.comment.id,
              });
            }

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
