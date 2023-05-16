import { faHistory, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ActiveUsers from './ActiveUsers';

type Props = {
    articleId: string,
    onShowSidebar: () => void,
    showSidebar: boolean,
    title: string,
    onTitleChange: (title: string) => void,
};

export default function EditorTitle ({
  articleId,
  onShowSidebar,
  showSidebar,
  title,
  onTitleChange,
}: Props) {
  const [titleFocus, setTitleFocus] = useState(false);
  const titleRef = React.useRef(null);

  const [articleTitle, setArticleTitle] = useState('');

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.width = `${(articleTitle.length * 12 + 60)}px`;
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
        <div />

        <div className="editor-title-input-wrapper">
          {!titleFocus && <FontAwesomeIcon icon={faPenToSquare} />}
          <input
            type="text"
            placeholder="Enter a title..."
            onFocus={() => setTitleFocus(true)}
            onBlur={() => {
              setTitleFocus(false);
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
        <div className="editor-title-buttons">
          <ActiveUsers />
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
          <Link
            onClick={(e) => {
              e.stopPropagation();
            }}
            to={`/publish/${articleId}`}
            className="editor-publish-button"
          >
            Review before publishing
          </Link>
        </div>
      </div>
      <hr className={classNames('editor-title-hr', { focus: titleFocus, empty: (!articleTitle || articleTitle === 'New article') })} />
    </>
  );
}
