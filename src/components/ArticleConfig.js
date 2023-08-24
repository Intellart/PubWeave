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
  find, get, map,
  isEqual,
  includes,
  differenceBy,
  filter,
  subtract,
} from 'lodash';
// import Chip from '@mui/material/Chip';
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

  const [tags, setTags] = useState(map(get(props.article, 'tags', []), (t) => ({
    ...t,
    id: get(find(allTags, { tag_name: t.tag_name }), 'id'),
  })));
  const [description, setDescription] = useState(get(props.article, 'description', ''));
  const [/* star */, setStar] = useState(get(props.article, 'star', false) || false);

  const SECOND_MS = 1000;

  useEffect(() => {
    setTags(map(get(props.article, 'tags', []), (t) => ({
      ...t,
      id: get(find(allTags, { tag_name: t.tag_name }), 'id'),
    })) || []);
    setDescription(get(props.article, 'description', ''));
    setStar(get(props.article, 'star', false) || false);
  }, [props.article, allTags]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, SECOND_MS);

    return () => clearInterval(interval);
  }, []);

  const lastSaved = new Date(props.lastSaved);
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
    setTags(map(get(props.article, 'tags', []), (t) => ({
      ...t,
      id: get(find(allTags, { tag_name: t.tag_name }), 'id'),
    })));
  };

  const articleTagIds = map(get(props.article, 'tags', []), 'tag_name');
  const tagIds = map(tags, 'tag_name');

  const tagsChanged = !isEqual(articleTagIds, tagIds);

  const handleSaveTags = () => {
    const diff = differenceBy(get(props.article, 'tags', []), tags, 'tag_name');
    const diff2 = differenceBy(tags, get(props.article, 'tags', []), 'tag_name');

    // console.log('to remove', diff);
    // console.log('to add', diff2);

    map(diff, (tag) => {
      props.removeTag(tag.article_tag_link);
    });

    map(diff2, (tag) => {
      props.addTag(props.id, tag.id);
    });
  };

  const onNewTagClick = (value: string) => {
    setTags(map(value, (t) => ({
      ...t,
      article_tag_link: includes(map(get(props.article, 'tags'), 'tag_name'), t.tag_name) ? get(find(get(props.article, 'tags'), { tag_name: t.tag_name }), 'article_tag_link') : null,
    })));
  };

  const onNewTagInput = (value: string) => {
    setNewTag(value);
  };

  const category: number = get(find(props.categories, (c) => c.category_name === get(props.article, 'category', '')), 'id', '');

  const tagOptionsToShow = map(filter(get(props, 'tags', []), (tag) => tag.category_id === category), (t) => ({
    ...t,
    article_tag_link: null,
  }));

  return (
    <>
      <div className={classNames('article-config-backdrop', { hidden: !articleSettingsExpanded })} />
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
          <h6>{props.wordCount} words</h6>
        </div>
        <div className="article-config-item">
          <FontAwesomeIcon className='article-config-icon' icon={faClock} />
          <h6>{props.lastSaved > 0 ? lastSavedString() : 'N/A'}</h6>
        </div>
        <div className="article-config-item">
          <FontAwesomeIcon className='article-config-icon article-config-icon-blue' icon={faCog} />
        </div>
      </div>
      <ClickAwayListener
        onClickAway={() => {
          setArticleSettingsExpanded(false);
        }}
        mouseEvent="onMouseDown"
        touchEvent="onTouchStart"
      >
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
              size="small"
            >
              <InputLabel>Category</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={category}
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
                onChange={(e, value) => onNewTagClick(value)}
                onInputChange={(e, value) => onNewTagInput(value)}
                value={tags}
                getOptionLabel={(option) => option.tag_name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={tagOptionsToShow}
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

        </div>

      </ClickAwayListener>
    </>
  );
}

export default ArticleConfig;
