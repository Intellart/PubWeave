// @flow
import React, {
  useEffect, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  isEmpty, sum, words, get, filter, map, isEqual,
  toInteger,
  uniq,
  size,
} from 'lodash';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';

import { Alert, AlertTitle } from '@mui/material';

import ArticleConfig from '../editor/ArticleConfig';
import { actions, selectors } from '../../store/articleStore';
import ImageSelection from '../editor/ImageSelection';
import Editor, { EditorStatus } from '../editor/Editor';
import EditorTitle from '../editor/EditorTitle';
import routes from '../../routes';

function ReactEditor (): React$Element<any> {
  const { id } = useParams();

  // console.log('id', id);

  const navigate = useNavigate();

  // useSelector
  const article = useSelector((state) => selectors.article(state), isEqual);
  const articleContent = useSelector((state) => selectors.articleContent(state), isEqual);
  const categories = useSelector((state) => selectors.getCategories(state), isEqual);
  const tags = useSelector((state) => selectors.getTags(state), isEqual);

  // dispatch
  const dispatch = useDispatch();
  const fetchArticle = (ind: number) => dispatch(actions.fetchArticle(ind));
  const updateArticle = (articleId: number, payload: any) => dispatch(actions.updateArticle(articleId, payload));
  const publishArticle = (articleId: number, status: string) => dispatch(actions.publishArticle(articleId, status));
  const addTag = (articleId: number, tagId: number) => dispatch(actions.addTag(articleId, tagId));
  const removeTag = (articleTagId: number) => dispatch(actions.removeTag(id, articleTagId));

  const [isReady, setIsReady] = useState(!isEmpty(article) && id && get(article, 'id') === toInteger(id));

  useEffect(() => {
    setIsReady(!isEmpty(article) && id && get(article, 'id') === toInteger(id));
  }, [article, id]);

  useEffect(() => {
    if (!isReady) {
      fetchArticle(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article, id, isReady]);

  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState(0);

  useEffect(() => {
    if (isReady) {
      setWordCount(sum(map(get(articleContent, 'blocks'), (block) => words(get(block, 'data.text')).length), 0));
      setLastSaved(get(articleContent, 'time'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article, isReady]);

  // console.log(map(filter(get(articleContent, 'blocks', []), (block) => block.type === 'image'), (block) => get(block, 'data.file.url')));

  const linkList: Array<string> = uniq([
    ...map(filter(get(articleContent, 'blocks', []), (block) => block.type === 'image'), (block) => get(block, 'data.file.url')),
    // ...get(article, 'image', '') ? [get(article, 'image', '')] : [],
  ]);

  const checks = [
    {
      name: 'Word count',
      check: () => wordCount >= 200,
      message: 'Word count must be at least 200',
    },
    {
      name: 'Title',
      check: () => size(get(article, 'title')) > 0 && get(article, 'title') !== 'New article',
      message: 'Add a title',
    },
    {
      name: 'Image',
      check: () => get(article, 'image', ''),
      message: 'Add at least one image to your article',
    },
    {
      name: 'Thumbnail',
      check: () => get(article, 'image', ''),
      message: 'Add a thumbnail to your article',
    },
    {
      name: 'Category',
      check: () => get(article, 'category', ''),
      message: 'Add a category to your article',
    },
    {
      name: 'Description',
      check: () => get(article, 'description', ''),
      message: 'Add a description to your article',
    },
  ];

  const handleImageSelection = (href: string) => {
    updateArticle(id, { image: href });
  };

  return (
    <main className="editor-wrapper">
      <EditorTitle
        articleId={id}
        articleType={get(article, 'article_type')}
        title={get(article, 'title')}
        onTitleChange={(newTitle) => updateArticle(id, { title: newTitle })}
        inReview
        onPublishClick={() => {
          publishArticle(id, 'requested');
          navigate(routes.myWork.root);
        }}
      />
      <ImageSelection
        linkList={linkList}
        onImageSelection={handleImageSelection}
        currentImage={get(article, 'image', '')}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',

        }}
        className="alert-container"
      >
        <Alert
          sx={{
            width: 'calc(100% - 150px)',

          }}
          severity="info"
        >
          <AlertTitle>Complete these steps to publish your article</AlertTitle>
          {map(checks, (check) => (
            <div key={check.name}>
              <FontAwesomeIcon
                icon={check.check() ? faCheckCircle : faTimesCircle}
                style={{
                  color: check.check() ? 'green' : 'red',
                  marginRight: '10px',
                }}
              />
              {check.message}
            </div>
          ))}
        </Alert>
      </div>
      <ArticleConfig
        wordCount={wordCount}
        lastSaved={lastSaved}
        updateArticle={updateArticle}
        article={article}
        categories={categories}
        allTags={tags}
        addTag={addTag}
        removeTag={removeTag}
      />
      {/* {isReady && (
      <ReactEditorJS
        holder='editorjs'
        readOnly
        defaultValue={{
          blocks: get(articleContent, 'blocks', []),
        }}
        tools={EDITOR_JS_TOOLS}
        autofocus
        placeholder='Start your article here!'
      />
      )} */}
      <Editor
        isReady={isReady}
        readOnly
        status={EditorStatus.IN_REVIEW}

      />
    </main>
  );
}

export default ReactEditor;
