// @flow
import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faCog, faPen } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import TextField from '@mui/material/TextField';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import { find, get, map } from 'lodash';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { Link } from 'react-router-dom';
import {
  Checkbox, FormControl, InputLabel, MenuItem, Select,
} from '@mui/material';
import type { Article } from '../store/articleStore';

type Props = {
  id: number,
  wordCount: number,
  lastSaved: number,
  updateArticle: Function,
  article: Article,
  categories: { [number]: string },
};

function ArticleConfig(props: Props): Node {
  const [articleSettingsExpanded, setArticleSettingsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [tags, setTags] = useState(get(props.article, 'tags', []));
  const [description, setDescription] = useState(get(props.article, 'description', ''));
  const [star, setStar] = useState(get(props.article, 'star', false) || false);

  // eslint-disable-next-line no-unused-vars

  const SECOND_MS = 1000;

  useEffect(() => {
    setTags(get(props.article, 'tags', []));
    setDescription(get(props.article, 'description', ''));
    setStar(get(props.article, 'star', false) || false);
  }, [props.article]);

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
      <div className='article-config-modals'>
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
            Bookmark
            <Checkbox
              aria-label="checkmark"
              checked={star}
              onChange={(e) => {
                props.updateArticle(props.id, { star: e.target.checked });
              }}
              icon={(
                <FontAwesomeIcon
                  icon={faBook}
                  style={{ color: 'gray' }}
                />
              )}
              checkedIcon={<FontAwesomeIcon icon={faBook} />}
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={get(find(props.categories, (c) => c.category_name === get(props.article, 'category', '')), 'id', '')}
                label="Category"
                onChange={(e) => {
                  props.updateArticle(props.id, { category_id: e.target.value });
                }}
              >
                {map(props.categories, (c) => (
                  <MenuItem key={c.id} value={c.id}>{c.category_name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              id="standard-basic"
              label="Description"
              variant="standard"
              value={description || ''}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              onBlur={(e) => {
                setDescription(e.target.value);
                props.updateArticle(props.id, { description });
              }}

            />
            {isEditingTags && (
              <div className='article-config-subgroup-tags'>
                <TextField
                  className='article-config-subgroup-tags-input'
                  value={tags || ''}
                  onChange={(e) => {
                    setTags(e.target.value);
                  }}
                  id="standard-basic"
                  label="Tags"
                  variant="standard"
                />
                <Button
                  className='article-config-subgroup-tags-button'
                  variant="contained"
                  onClick={() => {
                    setIsEditingTags(false);
                    props.updateArticle(props.id, { tags });
                    setTags('');
                  }}
                >
                  Save
                </Button>
              </div>
            )}
            {!isEditingTags && (
              <div
                onClick={() => {
                  setIsEditingTags(true);
                  setTags('');
                }}
                className="article-config-item"
              >
                <FontAwesomeIcon icon={faBook} />
                <h6>Add tags</h6>
              </div>
            )}
            <div className="all-chips">
              {map(tags, (tag, index) => (
                <Chip key={index} label={tag} onDelete={() => {}} />
              ))}
            </div>

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
            <Link to={`/publish/${props.id}`}>
              <div
                className="article-config-item"
              >
                <FontAwesomeIcon icon={faBook} />
                <h6>Publish</h6>
              </div>
            </Link>
          </div>
          <div className="article-config-group">
            <h5>Article Settings</h5>
          </div>
        </div>
      </div>
    </ClickAwayListener>
  );
}

export default ArticleConfig;
