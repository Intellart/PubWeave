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
import { map } from 'lodash';
import Button from '@mui/material/Button';

type Props = {
  articleSettings: any,
  lastSaved: number,
  onToggleSpellCheck: (any) => void,
  addTag: (any) => void,
  // eslint-disable-next-line react/no-unused-prop-types
  removeTag: (any) => void,
};

function ArticleConfig(props: Props): Node {
  const [articleSettingsExpanded, setArticleSettingsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [tags, setTags] = useState(props.articleSettings.tags);

  const SECOND_MS = 1000;

  useEffect(() => {
    setTags(props.articleSettings.tags);
  }, [props.articleSettings.tags]);

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
            <h6>{props.articleSettings.wordCount} words</h6>
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
            <TextField id="standard-basic" label="Description" variant="standard" />
            <TextField id="standard-basic" label="Additional authors" variant="standard" />
            {isEditingTags && (
              <>
                <TextField
                  value={tags}
                  onChange={(e) => {
                    setTags(e.target.value);
                  }}
                  id="standard-basic"
                  label="Tags"
                  variant="standard"
                />
                <Button
                  variant="contained"
                  onClick={() => {
                    setIsEditingTags(false);
                    props.addTag(tags);
                    setTags('');
                  }}
                >
                  Save
                </Button>
              </>
            )}
            {!isEditingTags && (
              <div
                onClick={() => setIsEditingTags(true)}
                className="article-config-item"
              >
                <FontAwesomeIcon icon={faBook} />
                <h6>Edit tags</h6>
              </div>
            )}
            <div className="all-chips">
              {map(props.articleSettings.tags, (tag, index) => (
                <div key={index} className="chip">
                  <div className="chip-content">{tag}</div>
                </div>
              ))}
            </div>

            <div className="article-config-item">
              <FontAwesomeIcon icon={faPen} />
              <h6>{props.articleSettings.wordCount} words</h6>
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
                value={props.articleSettings.toggleSpellCheck ? 'checked' : 'unchecked'}
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
