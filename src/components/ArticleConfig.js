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
import {
  find, get, map, values,
  isEqual,
  difference,
} from 'lodash';
// import Chip from '@mui/material/Chip';
import { Link } from 'react-router-dom';
import {
  Alert,
  Autocomplete,
  /* Checkbox, */ FormControl, InputLabel, MenuItem, Select,
} from '@mui/material';
import type { Article } from '../store/articleStore';

type Props = {
  id: number,
  wordCount: number,
  lastSaved: number,
  updateArticle: Function,
  article: Article,
  categories: { [number]: any },
  tags: { [number]: any },
  addTag: Function,
  removeTag: Function,
};

function ArticleConfig(props: Props): Node {
  const [articleSettingsExpanded, setArticleSettingsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { tags: allTags } = props;
  const [/* newTag */, setNewTag] = useState('');
  const [tags, setTags] = useState(map(get(props.article, 'tags', []), (tag) => ({
    id: get(find(allTags, { tag: tag.tag_name }), 'id', 0),
    article_tag_id: tag.id,
    tag: tag.tag_name,
    category_id: tag.category_id,
  })));
  const [description, setDescription] = useState(get(props.article, 'description', ''));
  const [/* star */, setStar] = useState(get(props.article, 'star', false) || false);

  const SECOND_MS = 1000;

  useEffect(() => {
    setTags(map(get(props.article, 'tags', []), (tag) => ({
      id: get(find(allTags, { tag: tag.tag_name }), 'id', 0),
      article_tag_id: tag.id,
      tag: tag.tag_name,
      category_id: tag.category_id,
    })) || []);
    setDescription(get(props.article, 'description', ''));
    setStar(get(props.article, 'star', false) || false);

    console.log(props.article);
  }, [props.article]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, SECOND_MS);

    return () => clearInterval(interval);
  }, []);

  const lastSaved = new Date(props.lastSaved);
  const dif = (currentTime - lastSaved) / 1000;

  const lastSavedString = () => {
    if (dif < 10) {
      return 'Just now';
    } else if (dif < 60) {
      return `${Math.floor(dif)} seconds ago`;
    } else if (dif < 3600) {
      return `${Math.floor(dif / 60)} minute${Math.floor(dif / 60) > 1 ? 's' : ''} ago`;
    } else if (dif < 86400) {
      return `${Math.floor(dif / 3600)} hours ago`;
    }

    return `${Math.floor(dif / 86400)} days ago`;
  };

  const articleTagIds = map(get(props.article, 'tags', []), 'id');
  const tagIds = map(tags, 'article_tag_id');
  const tagsChanged = !isEqual(articleTagIds, tagIds);

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
            <FontAwesomeIcon className='article-config-icon' icon={faPen} />
            <h6>{props.wordCount} words</h6>
          </div>
          <div className="article-config-item">
            <FontAwesomeIcon className='article-config-icon' icon={faClock} />
            <h6>{lastSavedString()}</h6>
          </div>
          <div className="article-config-item">
            <FontAwesomeIcon className='article-config-icon article-config-icon-blue' icon={faCog} />
          </div>
        </div>
        <div
          className={classNames('article-config-large', { hidden: !articleSettingsExpanded })}
        >
          {/* Bookmark
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
          /> */}
          <div className="article-config-item">
            <FontAwesomeIcon className='article-config-icon' icon={faPen} />
            <FormControl
              className='article-config-category-select'
              sx={{ m: 2, minWidth: 200 }}
            >
              <InputLabel>Category</InputLabel>
              <Select
                sx={{ height: 40 }}
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
          </div>
          <div className='article-config-item'>
            <FontAwesomeIcon className='article-config-icon' icon={faBook} />
            <TextField
              sx={{ m: 2, minWidth: 200 }}
              variant="outlined"
              size="small"
              id="standard-basic"
              label="Description"
              value={description || ''}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              onBlur={(e) => {
                setDescription(e.target.value);
                props.updateArticle(props.id, { description });
              }}
            />
          </div>

          <Alert severity="info">To use tags, add category first.</Alert>
          <div className='article-config-item'>
            <FontAwesomeIcon className='article-config-icon' icon={faBook} />
            <div className='article-config-item-tags'>
              <Autocomplete
                disablePortal
                multiple
                limitTags={2}
                id="combo-box-demo"
                onChange={(e, value) => {
                  setTags(value);
                  console.log(value);
                }}
                onInputChange={(e, value) => {
                  setNewTag(value);
                  console.log(value);
                }}
                value={tags}
                getOptionLabel={(option) => option.tag}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={values(props.tags)}
                // defaultValue={tags}
                sx={{
                  minWidth: 200, display: 'flex', alignItems: 'center',
                }}
                size="small"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className='article-config-item-input'
                    variant="outlined"
                    size="small"
                    label="Tags"
                  />
                )}
              />

              {/* value={newTag}
              onChange={(e) => {
                setNewTag(e.target.value);
              }}
              id="standard-basic" */}
              <div
                className='article-config-item-tags-buttons'
              >
                {tagsChanged && (
                <div
                  className='article-config-item-ok'
                  onClick={() => {
                    setTags(map(get(props.article, 'tags', []), (tag) => ({
                      id: tag.id,
                      tag: tag.tag_name,
                      category_id: tag.category_id,
                    })));
                  }}
                >
                  Reset
                </div>

                )
                }
                {tagsChanged && (
                <div
                  className='article-config-item-ok'
                  onClick={() => {
                    const diff = difference(articleTagIds, tagIds);
                    const diff2 = difference(tagIds, articleTagIds);

                    console.log('all tags', props.tags);
                    console.log('article tags', articleTagIds);
                    console.log('new tags', tagIds);

                    console.log('to remove', diff);
                    console.log('to add', diff2);

                    // map(diff, (tag) => {
                    //   console.log('removing', tag);
                    //   props.removeTag(tag.id);
                    // });

                    // map(diff2, (tag) => {
                    //   props.addTag(props.id, tag.id);
                    // });
                  }}
                >
                  Save tag changes
                </div>

                )
            }
              </div>
            </div>
          </div>
          {/* {!isEmpty(tags) && (
          <div className="all-chips">
            {map(tags, (tag, index) => (
              <Chip key={index} label={tag.tag_name} onDelete={() => {}} />
            ))}
          </div>
          ) } */}
          <div className="article-config-item">
            <FontAwesomeIcon className='article-config-icon' icon={faPen} />
            <h6>{props.wordCount} words</h6>
          </div>
          <div className="article-config-item">
            <FontAwesomeIcon className='article-config-icon' icon={faClock} />
            <h6>{lastSavedString()}</h6>
          </div>

          <Link
            className='article-config-publish'
            to={`/publish/${props.id}`}
          >
            <p>Publish</p>
          </Link>

        </div>
      </div>
    </ClickAwayListener>
  );
}

export default ArticleConfig;
