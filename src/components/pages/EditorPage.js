// @flow
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'universal-cookie';
import { useNavigate, useParams } from 'react-router-dom';

import {
  sum, words, get, map, isEqual, toInteger, isEmpty, sortBy,
} from 'lodash';
import classNames from 'classnames';

import 'bulma/css/bulma.min.css';
import { Button } from '@mui/material';
import ArticleConfig from '../ArticleConfig';
import type {
  Block,
  BlockCategoriesToChange,
  ArticleContentToServer,
  BlockToServer,
} from '../../store/articleStore';

// eslint-disable-next-line no-unused-vars
import { store } from '../../store';
import { actions, selectors } from '../../store/articleStore';
import TutorialModal from '../containers/TutorialModal';
import SideBar from '../elements/SideBar';
import Editor from '../elements/Editor';
import EditorTitle from '../elements/EditorTitle';
import routes from '../../routes';
import WebSocketElement from '../WebSocketElement';

// import ActiveUsers from '../elements/ActiveUsers';
// import axios from '../../api/axios';

const cookies = new Cookies();

function ReactEditor (): React$Element<any> {
  const { id, type } = useParams();
  const navigate = useNavigate();

  // useSelector
  const article = useSelector((state) => selectors.article(state), isEqual);
  const articleContent = useSelector((state) => selectors.articleContent(state), isEqual);
  const categories = useSelector((state) => selectors.getCategories(state), isEqual);
  const tags = useSelector((state) => selectors.getTags(state), isEqual);
  const blocks = useSelector((state) => selectors.getBlocks(state), isEqual);

  // dispatch
  const dispatch = useDispatch();
  const fetchArticle = (ind:number) => dispatch(actions.fetchArticle(ind));
  const updateArticle = (articleId:number, payload:any) => dispatch(actions.updateArticle(articleId, payload));
  const updateArticleContentSilently = (articleId:number, newArticleContent: ArticleContentToServer) => dispatch(actions.updateArticleContentSilently(articleId, newArticleContent));
  const addTag = (articleId:number, tagId: number) => dispatch(actions.addTag(articleId, tagId));
  const removeTag = (articleTagId: number) => dispatch(actions.removeTag(id, articleTagId));
  const testWsUpdateBlock = () => dispatch(actions.testWsUpdateBlock());

  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState(0);

  const [sidebar, setSidebar] = useState({
    show: false,
    snap: false,
  });

  const isReady = !isEmpty(article) && id && get(article, 'id') === toInteger(id);

  useEffect(() => {
    if (!isReady && id) {
      fetchArticle(id);
    } else if (isReady) {
      setWordCount(sum(map(blocks, (block) => words(get(block, 'data.text')).length), 0));
      setLastSaved(get(articleContent, 'time'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article, id, isReady]);

  const [openTutorialModal, setOpenTutorialModal] = useState(cookies.get('tutorial') !== 'true');

  return (
    <main
      className={classNames('editor-wrapper', {
        'editor-wrapper-snap': sidebar.snap,
      })}
    >
      {/* <ActiveUsers /> */}
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
      <WebSocketElement articleId={id} />
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
      />
      <SideBar
        showSidebar={sidebar.show}
        setShowSidebar={(show) => setSidebar({ ...sidebar, show })}
        snapSidebar={sidebar.snap}
        setSnapSidebar={(snap) => setSidebar({ ...sidebar, snap })}
      />
      <Button onClick={() => testWsUpdateBlock()}>Test</Button>
      <Editor
        onShowHistory={() => {
          console.log('onShowHistory');
          setSidebar({ ...sidebar, show: true });
        }}
        onChange={(newBlocks: BlockCategoriesToChange, time:number, version: string) => {
          const blocksToAdd :BlockToServer[] = sortBy([
            ...map(newBlocks.created, (block: Block) => ({ ...block, action: 'created' })),
            ...map(newBlocks.changed, (block: Block) => ({ ...block, action: 'updated' })),
            ...map(newBlocks.deleted, (block: Block) => ({ ...block, action: 'deleted' })),
          ], 'position');

          setWordCount(sum(map(blocksToAdd, (block) => words(get(block, 'data.text')).length), 0));
          setLastSaved(time);

          updateArticleContentSilently(id, {
            time,
            version,
            blocks: map(blocksToAdd, (block) => ({
              id: block.id,
              type: block.type,
              data: block.data,
              action: block.action,
            })),
          });
        }}
        isReady={isReady}

      />

    </main>
  );
}

export default ReactEditor;
