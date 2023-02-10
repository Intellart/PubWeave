/* eslint-disable react/no-unused-prop-types */ import React, {
  forwardRef,
  useEffect,
  useState,
} from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
import {
  faComment, faHandsClapping, faReply, faTrash,
} from '@fortawesome/free-solid-svg-icons';

import classNames from 'classnames';
import { Mention, MentionsInput } from 'react-mentions';
import { Chip } from '@mui/material';
import { find, get, size } from 'lodash';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { actions } from '../../store/articleStore';

type Props = {
  children?: React.Node,
  onReply?: Function,
  onCancel?: Function,
  onSave?: Function,
  onExpand?: Function,
  comment: Object,
  isReply?: boolean,
  replyCount?: number,
  currentUserId?: number,
  authorId?: number,
  commenters?: Array<Object>,
};

const Comment = forwardRef((props: Props, ref) => {
  const [content, setContent] = useState(props.comment.comment || '');
  const [editMode, setEditMode] = useState(false);
  const [alreadyVoted, setAlreadyVoted] = useState(!!find(props.comment.likes, { user_id: props.currentUserId }));

  const dispatch = useDispatch();
  const likeComment = (commentId, userId) => dispatch(actions.likeComment(commentId, userId));
  // eslint-disable-next-line no-unused-vars
  const unlikeComment = (commentId, userId) => dispatch(actions.unlikeComment(commentId, userId));
  const deleteComment = (commentId) => dispatch(actions.deleteComment(commentId));
  // const unlikeComment = (commentId) => dispatch(props.unlikeComment(commentId));
  // const dislikeComment = (commentId) => dispatch(props.dislikeComment(commentId));
  // const undislikeComment = (commentId) => dispatch(props.undislikeComment(commentId));

  useEffect(() => {
    setContent(props.comment.comment || '');
  }, [props.comment.comment]);

  const handleSave = () => {
    setEditMode(false);
    props.onSave(content);
  };

  useEffect(() => {
    setAlreadyVoted(!!find(props.comment.likes, { user_id: props.currentUserId }));
  }, [props.comment.likes, props.currentUserId]);

  const formatText = (text) => {
    // console.log('formatText', text);
    // const newContent = text.split(/((?:#|@|https?:\/\/[^\s]+)[a-zA-Z]+)/);
    const newContent = text.split(/(@\[.*\]\(.*\))/);
    let hashtag;

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
        // console.log('word', word);

        const key = word.replace(/(@\[(.*)\]\(.*\))/, '$2');
        const name = word.replace(/(@\[.*\]\((.*)\))/, '$2');

        const userId = get(find(props.commenters, { id: key }), 'user_id', null);

        return (
          <Link
            key={userId}
            to={`/blogs/user/${userId}`}
            className="text-cyanBlue/80 hover:text-cyanBlue"
          >
            {'@' + name}
          </Link>
        );
      } else if (word.includes('http')) {
        return <a target="_blank" href={word} className="text-cyanBlue/80 hover:text-cyanBlue">{word}</a>;
      } else {
        return word;
      }
    });
  };

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
                {props.currentUserId === get(props.comment, 'commenter.id') && <p className='comment-content-upper-user-text-tag'>You</p>}
              </div>
              <div className="comment-content-upper-user-text-lower">
                {/* <p>ID: {get(props.comment, 'id')} || ReplyTo: {get(props.comment, 'reply_to.id')}</p> */}
                <p>{new Date(get(props.comment, 'updated_at')).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="comment-content-middle">
          {(props.comment.newComment || editMode) ? (
            <>
              <MentionsInput
                style={mentionsInputStyle}
                className="comment-content-body-textarea"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
              >
                <Mention
                  trigger="@"
                  displayTransform={(id) => `@${id}`}
                  style={mentionsStyle}
                  data={props.commenters}
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
                'comment-content-lower-vote-active': alreadyVoted,
              })}
              onClick={() => {
                if (alreadyVoted) {
                  const likeId = find(props.comment.likes, { user_id: props.currentUserId }).id;

                  unlikeComment(likeId);
                } else {
                  // props.onVote(props.comment.id);
                  likeComment(props.comment.id, props.currentUserId);
                }
              }
            }
              icon={faHandsClapping}
            />
            <p>{size(props.comment.likes) || 0}</p>
            {props.onExpand && (
              <>
                <FontAwesomeIcon
                  className="comment-content-lower-reply"
                  onClick={() => props.onExpand()}
                  icon={faComment}
                />
                <p>{props.replyCount}</p>
              </>
            )
            }
          </div>
          {props.currentUserId === props.comment.commenter.id && (
          <div
            onClick={() => {
              if (editMode) return;
              if (props.replyCount > 0) {
                // eslint-disable-next-line no-alert
                alert('You cannot delete a comment that has replies.');

                return;
              }

              deleteComment(props.comment.id);
            }

        }
            className="comment-content-lower-right"
          >
            <FontAwesomeIcon
              className="comment-content-lower-reply"
              icon={faTrash}
            />
            &nbsp;Delete comment
          </div>
          )}
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
