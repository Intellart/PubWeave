import { faHistory, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { size } from 'lodash';
import routes from '../../routes';
// import ActiveUsers from './ActiveUsers';

type Props = {
    articleId: string,
    onShowSidebar?: () => void,
    showSidebar?: boolean,
    title: string,
    onTitleChange: (title: string) => void,
    inReview?: boolean,
    onPublishClick?: () => void,
    projectType?: string,
};

export default function EditorTitle ({
  articleId,
  onShowSidebar,
  showSidebar,
  title,
  onTitleChange,
  inReview,
  onPublishClick,
  projectType,
}: Props) {
  const [titleFocus, setTitleFocus] = useState(false);
  const titleRef = React.useRef(null);

  const [articleTitle, setArticleTitle] = useState('');

  useEffect(() => {
    if (titleRef.current) {
      const minPx = 12;
      const maxPx = 25;
      const minChars = 25;
      const maxChars = 70;
      // titleRef.current.style.width = `${(articleTitle.length * 12 + 60)}px`;

      if (articleTitle.length > maxPx && articleTitle.length < maxChars) {
        const fontSize = maxPx + ((minPx - maxPx) / (maxChars - minChars)) * (articleTitle.length - minChars);
        titleRef.current.style.fontSize = `${fontSize}px`;
      } else if (articleTitle.length >= maxChars) {
        titleRef.current.style.fontSize = `${minPx}px`;
      } else {
        titleRef.current.style.fontSize = `${maxPx}px`;
      }
    }
  }, [titleRef, articleTitle]);

  useEffect(() => {
    if (title === articleTitle || !title || title === '') {
      return;
    }
    if (size(title) > 100) {
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

        {!titleFocus && (!inReview ? (<div />) : (
          <Link
            onClick={(e) => {
              e.stopPropagation();
            }}
            to={routes.myWork.project(projectType, articleId)}
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
          {!inReview && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onShowSidebar(!showSidebar);
            }}
            className={classNames('editor-history-button', {
              disabled: showSidebar,
            })}
          >
            <FontAwesomeIcon icon={faHistory} />
          </div>
          ) }
          <div
            onClick={(e) => {
              e.stopPropagation();
              onPublishClick();
            }}
            className="editor-publish-button"
          >
            {inReview ? 'Publish' : 'Review before publishing'}
          </div>
        </div>
        )}
      </div>
      <hr className={classNames('editor-title-hr', { focus: titleFocus, empty: (!articleTitle || articleTitle === 'New article') })} />
    </>
  );
}
