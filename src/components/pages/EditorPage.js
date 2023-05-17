import React, { useEffect, useState } from 'react';
// import { createReactEditorJS } from 'react-editor-js';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'universal-cookie';
import { useParams } from 'react-router-dom';

import {
  sum, words, get, map, isEqual, toInteger, isEmpty,
  // difference,
} from 'lodash';

import classNames from 'classnames';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//   faPlus,
// } from '@fortawesome/free-solid-svg-icons';

import 'bulma/css/bulma.min.css';
import ArticleConfig from '../ArticleConfig';
import type { ArticleContent } from '../../store/articleStore';
// eslint-disable-next-line no-unused-vars
import { store } from '../../store';
import { actions, selectors } from '../../store/articleStore';
import TutorialModal from '../containers/TutorialModal';
import SideBar from '../elements/SideBar';
import Editor from '../elements/Editor';
import EditorTitle from '../elements/EditorTitle';

// const ReactEditorJS = createReactEditorJS();
const cookies = new Cookies();

function ReactEditor () {
  const { id } = useParams();

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
  const removeTag = (articleTagId) => dispatch(actions.removeTag(articleTagId));

  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState(0);

  const [sidebar, setSidebar] = useState({
    show: false,
    snap: false,
  });

  const [criticalSectionIds] = useState(['BLGRuTJ1nv', 'zPdYgkZpqE']);

  const isReady = !isEmpty(article) && id && get(article, 'id') === toInteger(id);

  useEffect(() => {
    if (!isReady && id) {
      fetchArticle(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article, id, isReady]);

  const [openTutorialModal, setOpenTutorialModal] = useState(cookies.get('tutorial') !== 'true');

  // console.log(blocks);

  useEffect(() => {
    if (isReady) {
      // console.log('Article loaded');
      setWordCount(sum(map(blocks, (block) => words(get(block, 'data.text')).length), 0));
      setLastSaved(get(articleContent, 'time'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article, isReady]);
  // console.log(blocks);

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
      <Editor
        blocks={blocks}
        onChange={(newArticleContent: ArticleContent) => {
          if (isEqual(newArticleContent.blocks, blocks)) {
            return;
          }
          updateArticleContentSilently(id, newArticleContent);
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
