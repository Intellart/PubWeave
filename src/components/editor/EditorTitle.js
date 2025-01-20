// @flow

import { faHistory, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import routes from '../../routes';
import Modal from '../modal/Modal';
import { editorPermissions, permissions } from '../../utils/hooks';
import { EditorStatus } from './Editor';
// import ActiveUsers from './ActiveUsers';

type Props = {
    articleId: string,
    articleType: 'blog_article' | 'preprint' | 'scientific_article',
    onShowSidebar?: (value:boolean) => void,
    showSidebar?: boolean,
    title: string,
    onTitleChange: (title: string) => void,
    inReview?: boolean,
    onPublishClick?: () => void,
};

export default function EditorTitle ({
  articleId,
  articleType,
  onShowSidebar,
  showSidebar,
  title,
  onTitleChange,
  inReview,
  onPublishClick,
}: Props): React$Node {
  const [titleFocus, setTitleFocus] = useState(false);
  const titleRef = React.useRef<any>(null);

  const [articleTitle, setArticleTitle] = useState('');

  const currentPermissions = editorPermissions({ type: articleType, status: EditorStatus.IN_PROGRESS });

  useEffect(() => {
    if (titleRef.current) {
      const minPx = 18;
      const maxPx = 25;
      const minChars = 25;
      const maxChars = 70;

      if (!titleFocus) {
        titleRef.current.style.width = '220px';

        return;
      }

      console.log('articleTitle', articleTitle);

      if (articleTitle.length > maxPx && articleTitle.length < maxChars) {
        const fontSize = maxPx + ((minPx - maxPx) / (maxChars - minChars)) * (articleTitle.length - minChars);
        titleRef.current.style.fontSize = `${fontSize}px`;
        titleRef.current.style.width = `${(articleTitle.length * fontSize * 0.55 + 60)}px`;
      } else if (articleTitle.length >= maxChars) {
        titleRef.current.style.fontSize = `${minPx}px`;
        titleRef.current.style.width = `${(articleTitle.length * 10 + 60)}px`;
      } else {
        titleRef.current.style.fontSize = `${maxPx}px`;
        titleRef.current.style.width = `${(articleTitle.length * 12 + 60)}px`;
      }
    }
  }, [titleRef, articleTitle]);

  useEffect(() => {
    if (title === articleTitle || !title || title === '') {
      return;
    }

    setArticleTitle(title);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  return (
    <>
      <div
        className={classNames('editor-title')}
        onClick={() => titleRef.current.focus()}
      >

        {!titleFocus && ((inReview || inReview === undefined) ? (<div className='editor-publish-button-back' />) : (
          <Link
            onClick={(e) => {
              e.stopPropagation();
            }}
            to={routes.myWork.project(null, articleId)}
            className="editor-publish-button editor-publish-button-back"
          >
            Back to Editor
          </Link>
        ))}

        <div className="editor-title-input-wrapper">
          {!titleFocus && <FontAwesomeIcon icon={faPenToSquare} />}
          <input
            type="text"
            placeholder="Enter a title..."
            maxLength={100}
            onFocus={() => {
              setTitleFocus(true);
              titleRef.current.style.width = `${(articleTitle.length * 12 + 60)}px`;
            }}
            onBlur={() => {
              setTitleFocus(false);

              titleRef.current.style.width = '220px';

              if (articleTitle === title) {
                return;
              }
              if (articleTitle === '') {
                setArticleTitle(title);

                return;
              }

              onTitleChange(articleTitle);
            }}
            ref={titleRef}
            onChange={(e) => setArticleTitle(e.target.value)}
            value={articleTitle}
            className={classNames('editor-title-input', {
              focus: titleFocus,
              empty: (!articleTitle || articleTitle === 'New article'),
            })}
          />
        </div>
        {!titleFocus && (
        <div className="editor-title-buttons">
          {/* <ActiveUsers /> */}
          <Modal
            enabled={get(currentPermissions, permissions.collaborators)}
            type="collab"
            shape="icon"
            text="showOnline"

          />
          {get(currentPermissions, permissions.history) && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (onShowSidebar) {
                onShowSidebar(!showSidebar || false);
              }
            }}
            className={classNames('editor-history-button', {
              disabled: showSidebar,
            })}
          >
            <FontAwesomeIcon icon={faHistory} />
          </div>
          )}
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (onPublishClick)onPublishClick();
            }}
            className="editor-publish-button"
          >
            {(() => {
              if (inReview === undefined) {
                return 'Review before publishing';
              } else if (!inReview) {
                return 'Publish';
              } else {
                return 'Request publishing';
              }
            })()}
          </div>
        </div>
        )}
      </div>
      <hr className={classNames('editor-title-hr', { focus: titleFocus, empty: (!articleTitle || articleTitle === 'New article') })} />
    </>
  );
}
