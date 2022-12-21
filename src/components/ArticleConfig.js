// @flow
import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faCog, faPen } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import ClickAwayListener from '@mui/base/ClickAwayListener';

type Props = {
  wordCount: number,
  lastSaved: number,
  onToggleSpellCheck: (any) => void,
  toggleSpellCheck: boolean,
};

function ArticleConfig(props: Props): Node {
  const [articleSettingsExpanded, setArticleSettingsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const SECOND_MS = 1000;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, SECOND_MS);

    return () => clearInterval(interval);
  }, []);

  const lastSaved = new Date(props.lastSaved);
  const difference = (currentTime - lastSaved) / 1000;

  const lastSavedString = () => {
    if (difference < 10) {
      return 'Just now';
    } else if (difference < 60) {
      return `${Math.floor(difference)} seconds ago`;
    } else if (difference < 3600) {
      return `${Math.floor(difference / 60)} minute${Math.floor(difference / 60) > 1 ? 's' : ''} ago`;
    } else if (difference < 86400) {
      return `${Math.floor(difference / 3600)} hours ago`;
    }

    return `${Math.floor(difference / 86400)} days ago`;
  };

  return (
    <ClickAwayListener
      onClickAway={() => {
        setArticleSettingsExpanded(false);
      }}
      mouseEvent="onMouseDown"
      touchEvent="onTouchStart"
    >
      <div>
        <div
          onClick={() => setArticleSettingsExpanded(!articleSettingsExpanded)}
          className={classNames('article-config-small', { hidden: articleSettingsExpanded })}
        >
          <div className="article-config-item">
            <h6>{props.wordCount} words</h6>
            <FontAwesomeIcon icon={faPen} />
          </div>
          <div className="article-config-item">
            <h6>{lastSavedString()}</h6>
            <FontAwesomeIcon icon={faClock} />
          </div>
          <div className="article-config-item">
            <FontAwesomeIcon icon={faCog} />
          </div>
        </div>
        <div
          className={classNames('article-config-large', { hidden: !articleSettingsExpanded })}
        >
          <div className="article-config-group">
            <h5>Article Info</h5>
            <TextField id="standard-basic" label="Standard" variant="standard" />
            <div className="article-config-item">
              <FontAwesomeIcon icon={faPen} />
              <h6>{props.wordCount} words</h6>
            </div>
            <div className="article-config-item">
              <FontAwesomeIcon icon={faClock} />
              <h6>{lastSavedString()}</h6>
            </div>
          </div>
          <div className="article-config-group">
            <h5>Actions</h5>
            <div className="article-config-item">
              <FontAwesomeIcon icon={faBook} />
              <h6>Publish</h6>
            </div>
          </div>
          <div className="article-config-group">
            <h5>Article Settings</h5>
            <div className="article-config-item">
              <Switch
                value={props.toggleSpellCheck ? 'checked' : 'unchecked'}
                onClick={(e) => {
                  e.stopPropagation();
                  props.onToggleSpellCheck(e.target.checked);
                }}
              />
              <h6>Toggle browser spellcheck</h6>
            </div>
          </div>
        </div>
      </div>
    </ClickAwayListener>
  );
}

export default ArticleConfig;
