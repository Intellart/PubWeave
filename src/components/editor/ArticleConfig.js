// @flow
import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faCog, faPen } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import TextField from '@mui/material/TextField';
import {
  get, map,
  isEqual,
  subtract,
  find,
  keys,
  pickBy,
  omitBy,
  size,
} from 'lodash';
// import Chip from '@mui/material/Chip';
import {
  Alert,
  Autocomplete,
  /* Checkbox, */ FormControl, InputLabel, MenuItem, Select,
} from '@mui/material';
import type {
  Article,
  Categories,
  Category,
  Tag,
  Tags,
} from '../../store/articleStore';

type Props = {
  wordCount: number,
  lastSaved: number,
  updateArticle: Function,
  article: Article,
  categories: Categories,
  allTags: Tags,
  addTag: Function,
  removeTag: (articleTagId: number) => void,
};

type BasicOption = {
  label: string,
  value: number,
};

function ArticleConfig({
  allTags, article, lastSaved: _lastSaved, wordCount,
  updateArticle, categories, addTag, removeTag,
}: Props): Node {
  const [articleSettingsExpanded, setArticleSettingsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  // const [/* newTag */, setNewTag] = useState('');
  // const [/* star */, setStar] = useState(get(article, 'star', false) || false);
  const [description, setDescription] = useState(get(article, 'description', ''));

  const articleId = get(article, 'id', 0);
  const articleTags = get(article, 'tags', []);
  const [tags, setTags] = useState(articleTags);

  const SECOND_MS = 1000;

  // console.log('tags', tags);
  // console.log('alltags', allTags);

  const tagsChanged = !isEqual(keys(tags), keys(articleTags));

  const category: Category = find(categories, (c) => c.category_name === get(article, 'category', null));

  useEffect(() => {
    setTags(articleTags);
    setDescription(get(article, 'description', ''));
    // setStar(get(article, 'star', false) || false);
  }, [article, allTags, articleTags]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, SECOND_MS);

    return () => clearInterval(interval);
  }, []);

  const lastSaved = new Date(_lastSaved);
  const dif = subtract(currentTime, lastSaved) / 1000;

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

  const handleResetTags = () => {
    setTags(articleTags);
  };

  const tagValues = map(tags, (tag: Tag) => ({
    label: tag.tag,
    value: tag.id,
  }));

  const tagOptions = map(pickBy(allTags, (tag: Tag) => tag.category_id === category?.id), (tag: Tag) => ({
    label: tag.tag,
    value: tag.id,
  }));

  const handleSaveTags = () => {
    console.log('handleSaveTags');
    const tagsToRemove: Tags = omitBy(articleTags, (tag) => get(tags, tag.id, null));
    const tagsToAdd: Tags = omitBy(tags, (tag) => get(articleTags, tag.id, null));

    console.log('tagsToAdd', tagsToAdd);
    console.log('tagsToRemove', tagsToRemove);

    if (size(tagsToRemove) > 0) {
      map(tagsToRemove, (tag: Tag) => {
        removeTag(tag.id);
      });
    }

    if (size(tagsToAdd) > 0) {
      map(tagsToAdd, (tag: Tag) => {
        addTag(articleId, tag.id);
      });
    }
  };

  const onNewTagClick = (values: BasicOption[]) => {
    setTags(pickBy(allTags, (tag) => find(values, (v: BasicOption) => v.value === tag.id)));
  };

  const onNewTagInput = (value: string) => {
    console.log('onNewTagInput', value);
  };

  return (
    <>
      <div
        onClick={() => setArticleSettingsExpanded(false)}
        className={classNames('article-config-backdrop', { hidden: !articleSettingsExpanded })}
      />
      <div
        style={{
          top: 80,
          // marginLeft: versioningBlockActive ? 200 : 0,
        }}
        onClick={() => setArticleSettingsExpanded(!articleSettingsExpanded)}
        className={classNames('article-config-small', { hidden: articleSettingsExpanded })}
      >
        <div className="article-config-item">
          <FontAwesomeIcon className='article-config-icon' icon={faPen} />
          <h6>{wordCount} words</h6>
        </div>
        <div className="article-config-item">
          <FontAwesomeIcon className='article-config-icon' icon={faClock} />
          <h6>{_lastSaved > 0 ? lastSavedString() : 'N/A'}</h6>
        </div>
        <div className="article-config-item">
          <FontAwesomeIcon className='article-config-icon article-config-icon-blue' icon={faCog} />
        </div>
      </div>
      <div className={classNames('article-config-large', { hidden: !articleSettingsExpanded })}>
        <div className="article-config-item">
          <FontAwesomeIcon className='article-config-icon' icon={faPen} />
          <FormControl
            className='article-config-category-select'
            sx={{ m: 2, minWidth: 200 }}
            size="small"
          >
            <InputLabel>Category</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={get(category, 'id', '')}
              label="Category"
              onChange={(e) => {
                updateArticle(articleId, { category_id: e.target.value });
              }}
            >
              {map(categories, (c: Category) => (
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
              updateArticle(articleId, { description });
            }}
          />
        </div>

        {!category && <Alert severity="info">To use tags, add category first.</Alert>}
        <div className='article-config-item'>
          <FontAwesomeIcon className='article-config-icon' icon={faBook} />
          <div className='article-config-item-tags'>
            <Autocomplete
              disablePortal
              disabled={!category}
              multiple
              limitTags={2}
              id="combo-box-demo"
              onChange={(e, values) => onNewTagClick(values)}
              onInputChange={(e, value) => onNewTagInput(value)}
              value={tagValues}
              isOptionEqualToValue={(option: BasicOption, value: BasicOption) => option.value === value.value}
              options={tagOptions}
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
                  onClick={() => handleResetTags()}
                >
                  Reset
                </div>

              )
              }
              {tagsChanged && (
                <div
                  className='article-config-item-ok'
                  onClick={() => handleSaveTags()}
                >
                  Save tag changes
                </div>

              )
          }
            </div>
          </div>
        </div>
        <div className="article-config-item">
          <FontAwesomeIcon className='article-config-icon' icon={faPen} />
          <h6>{wordCount} words</h6>
        </div>
        <div className="article-config-item">
          <FontAwesomeIcon className='article-config-icon' icon={faClock} />
          <h6>{lastSavedString()}</h6>
        </div>

      </div>
    </>
  );
}

export default ArticleConfig;
