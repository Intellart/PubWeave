// @flow
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'universal-cookie';
import { useNavigate, useParams } from 'react-router-dom';

import {
  sum, words, get, map, isEqual, toInteger, isEmpty, keyBy, filter,
} from 'lodash';
import classNames from 'classnames';

import 'bulma/css/bulma.min.css';
import ArticleConfig from '../ArticleConfig';
import type {
  ArticleContent,
  _ArticleContent,
  Block,
  _Blocks,
} from '../../store/articleStore';

// eslint-disable-next-line no-unused-vars
import { store } from '../../store';
import { actions, selectors } from '../../store/articleStore';
import TutorialModal from '../containers/TutorialModal';
import SideBar from '../elements/SideBar';
import Editor from '../elements/Editor';
import EditorTitle from '../elements/EditorTitle';
import routes from '../../routes';
// import axios from '../../api/axios';

const cookies = new Cookies();

function ReactEditor (): React$Element<any> {
  const { id, type } = useParams();
  const navigate = useNavigate();

  // useSelector
  const article = useSelector((state) => selectors.article(state), isEqual);
  const articleContent = useSelector((state) => selectors.articleContent(state), isEqual);
  const blocks = useSelector((state) => selectors.getBlocks(state), isEqual);
  const categories = useSelector((state) => selectors.getCategories(state), isEqual);
  const tags = useSelector((state) => selectors.getTags(state), isEqual);

  // dispatch
  const dispatch = useDispatch();
  const fetchArticle = (ind) => dispatch(actions.fetchArticle(ind));
  const updateArticle = (articleId, payload) => dispatch(actions.updateArticle(articleId, payload));
  const updateArticleContentSilently = (articleId, newArticleContent: ArticleContent) => dispatch(actions.updateArticleContentSilently(articleId, newArticleContent));
  const addTag = (articleId, tagId) => dispatch(actions.addTag(articleId, tagId));
  const removeTag = (articleTagId) => dispatch(actions.removeTag(id, articleTagId));

  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState(0);

  const [sidebar, setSidebar] = useState({
    show: false,
    snap: false,
  });

  const versioningBlockId = useRef(null);

  const [criticalSectionIds] = useState(['BLGRuTJ1nv', 'zPdYgkZpqE']);

  const isReady = !isEmpty(article) && id && get(article, 'id') === toInteger(id);

  useEffect(() => {
    if (!isReady && id) {
      fetchArticle(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article, id, isReady]);

  const [openTutorialModal, setOpenTutorialModal] = useState(cookies.get('tutorial') !== 'true');

  useEffect(() => {
    if (isReady) {
      // console.log('Article loaded');
      setWordCount(sum(map(blocks, (block) => words(get(block, 'data.text')).length), 0));
      setLastSaved(get(articleContent, 'time'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article, isReady]);

  const checkBlocks = (newArticleContent: _ArticleContent) : void => {
    // console.clear();
    const newBlocks: _Blocks = keyBy(newArticleContent.blocks, 'id');
    const oldBlocks: _Blocks = keyBy(map(articleContent.blocks, (block: Block) => ({
      id: block.id,
      type: block.type,
      data: block.data,
    })), 'id');
    // console.log(newArticleContent);
    // console.log('new blocks raw', newArticleContent.blocks);
    // console.log('new blocks', newBlocks);
    // console.log('old blocks', oldBlocks);

    if (isEqual(newBlocks, oldBlocks)) {
      // console.log('no diff');

      return;
    }

    const blocksNew = filter(newBlocks, (block, key) => {
      if (!oldBlocks[key]) {
        return true;
      }

      return false;
    });

    const blocksEdited = filter(newBlocks, (block, key) => {
      if (!oldBlocks[key]) {
        return false;
      }

      if (oldBlocks[key].type !== block.type) {
        return true;
      }
      if (!isEqual(oldBlocks[key].data, block.data)) {
        return true;
      }

      return false;
    });

    const blockDeleted = filter(oldBlocks, (block, key) => !newBlocks[key]);

    if (isEmpty(blocksNew) && isEmpty(blocksEdited) && isEmpty(blockDeleted)) {
      // console.log('no diff');

      return;
    } else {
      // console.log('new blocks', blocksNew);
      // console.log('edited blocks', blocksEdited);
      // console.log('deleted blocks', blockDeleted);
    }

    updateArticleContentSilently(id, {
      ...newArticleContent,
      blocks: [
        ...map(blocksNew, (block: Block) => ({
          id: block.id,
          type: block.type,
          data: block.data,
          action: 'created',
        })),
        ...map(blocksEdited, (block: Block) => ({
          id: block.id,
          type: block.type,
          data: block.data,
          action: 'updated',
        })),
        ...map(blockDeleted, (block: Block) => ({
          id: block.id,
          type: block.type,
          data: block.data,
          action: 'deleted',
        })),
      ],

    });
  };

  return (
    <main
      className={classNames('editor-wrapper', {
        'editor-wrapper-snap': sidebar.snap,
      })}
    >
      {/* <button
        className="editor-sidebar-toggle"
        onClick={() => {
          setCriticalSectionIds([criticalSectionIds[0]]);

          // const blockToAdd = {
          //   type: 'header',
          //   data: {
          //     text: 'My header2',
          //   },
          // };
          // console.log(editor.current);
          // editor.current.blocks.insert(blockToAdd.type, blockToAdd.data);
        }}
      >
        <FontAwesomeIcon icon={faPlus} /> ADD
      </button> */}
      <TutorialModal
        open={openTutorialModal}
        onClose={() => {
          setOpenTutorialModal(false);
        }}
        onFinished={() => {
          cookies.set('tutorial', 'true', { path: '/' });
        }}
      />
      <EditorTitle
        articleId={id}
        onShowSidebar={(show) => setSidebar({ ...sidebar, show })}
        showSidebar={sidebar.show}
        title={get(article, 'title')}
        onTitleChange={(newTitle) => updateArticle(id, { title: newTitle })}
        onPublishClick={() => {
          navigate(routes.myWork.review(type, id));
        }}

      />
      <ArticleConfig
        id={id}
        wordCount={wordCount}
        lastSaved={lastSaved}
        updateArticle={updateArticle}
        article={article}
        categories={categories}
        tags={tags}
        addTag={addTag}
        removeTag={removeTag}
        versioningBlockId={versioningBlockId}
      />
      <SideBar
        showSidebar={sidebar.show}
        setShowSidebar={(show) => setSidebar({ ...sidebar, show })}
        snapSidebar={sidebar.snap}
        setSnapSidebar={(snap) => setSidebar({ ...sidebar, snap })}
        blockId={versioningBlockId}
      />
      <Editor
        blocks={map(blocks, (block: Block) => ({
          id: block.id,
          type: block.type,
          data: block.data,
        }))}
        onShowHistory={() => {
          console.log('onShowHistory');
          setSidebar({ ...sidebar, show: true });
        }}
        versioningBlockId={versioningBlockId}
        onChange={(newArticleContent: _ArticleContent) => {
          console.log('onChange');
          console.log(newArticleContent);
          checkBlocks(newArticleContent);

          setWordCount(sum(map(newArticleContent.blocks, (block) => words(get(block, 'data.text')).length), 0));
          setLastSaved(newArticleContent.time);
        }}
        isReady={isReady}
        criticalSectionIds={criticalSectionIds}

      />

    </main>
  );
}

export default ReactEditor;
