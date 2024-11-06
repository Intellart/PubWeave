// @flow
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'universal-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import {
  sum, words, get, map, isEqual, toInteger, isEmpty, flatten, values,
} from 'lodash';
import classNames from 'classnames';
import { toast } from 'react-toastify';
import type {
  BlockCategoriesToChange,
  ArticleContentToServer,
} from '../../store/articleStore';
import { actions, selectors } from '../../store/articleStore';
import routes from '../../routes';
import TutorialModal from '../editor/TutorialModal';
import EditorTitle from '../editor/EditorTitle';
import ArticleConfig from '../editor/ArticleConfig';
import SideBar from '../editor/SideBar';
import Editor, { EditorStatus } from '../editor/Editor';
import { editorPermissions, permissions } from '../../utils/hooks';

const cookies = new Cookies();

const useAutoSave = () => {
  const [autoSave, setAutoSave] = useState(false);
  const autosaveRef = useRef(autoSave);

  const handleAutoSave = (newAutoSave: boolean) => {
    setAutoSave(newAutoSave);
    autosaveRef.current = newAutoSave;
  };

  return {
    autoSaveState: autoSave,
    autosaveRef,
    toggleAutoSave: () => handleAutoSave(!autoSave),
  };
};

function ReactEditor (): React$Element<any> {
  const { id, type } = useParams();
  const navigate = useNavigate();

  const article = useSelector((state) => selectors.article(state), isEqual);
  const articleContent = useSelector((state) => selectors.articleContent(state), isEqual);
  const categories = useSelector((state) => selectors.getCategories(state), isEqual);
  const tags = useSelector((state) => selectors.getTags(state), isEqual);
  const blocks = useSelector((state) => selectors.getBlocks(state), isEqual);

  const { autoSaveState, autosaveRef, toggleAutoSave } = useAutoSave();

  const dispatch = useDispatch();
  const fetchArticle = (ind:number) => dispatch(actions.fetchArticle(ind));
  const updateArticle = (articleId:number, payload:any) => dispatch(actions.updateArticle(articleId, payload));
  const updateArticleContentSilently = (articleId:number, newArticleContent: ArticleContentToServer) => dispatch(actions.updateArticleContentSilently(articleId, newArticleContent));
  const addTag = (articleId:number, tagId: number) => dispatch(actions.addTag(articleId, tagId));
  const removeTag = (articleTagId: number) => dispatch(actions.removeTag(id, articleTagId));

  const currentPermissions = editorPermissions({ type: get(article, 'article_type'), status: 'inProgress' });

  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState(0);
  const [historySectionId, setHistorySectionId] = useState<string | null>(null);

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
  // console.log('currentPermissions', currentPermissions);

  const initialState = {
    blocks: [],
    time: 0,
    version: '1',
  };

  const [savedState, setSavedState] = useState<any>(initialState);

  const handleManualSave = () => {
    if (savedState.time === 0) return;

    toast.success('Article saved');
    const blocksToAdd = flatten(values(savedState.blocks));

    updateArticleContentSilently(id, {
      time: savedState.time || 0,
      version: savedState.version || '1',
      blocks: blocksToAdd,
    });

    setSavedState(initialState);
  };

  const handleChange = (
    newBlocks: BlockCategoriesToChange,
    time?: number,
    version?: string,
  ) => {
    setWordCount(
      sum(map(newBlocks, (block) => words(get(block, 'data.text')).length)),
    );
    setLastSaved(time || 0);

    // setLastUpdatedArticleIds(map(newBlocks.changed, (block: Block) => block.id));

    setSavedState({
      blocks: newBlocks,
      time: time || 0,
      version: version || '1',
    });

    if (autosaveRef.current) {
      updateArticleContentSilently(id, {
        time: time || 0,
        version: version || '1',
        blocks: (newBlocks: any),
      });
    }
  };

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
        articleType={get(article, 'article_type')}
        onShowSidebar={(show) => setSidebar({ ...sidebar, show: show || !sidebar.show })}
        showSidebar={sidebar.show}
        title={get(article, 'title')}
        onTitleChange={(newTitle) => updateArticle(id, { title: newTitle })}
        onPublishClick={() => {
          navigate(routes.myWork.preview(type, id));
        }}

      />
      {article && (
      <ArticleConfig
        wordCount={wordCount}
        lastSaved={lastSaved}
        updateArticle={updateArticle}
        article={article}
        categories={categories}
        allTags={tags}
        addTag={addTag}
        removeTag={removeTag}
        onSave={handleManualSave}
        autoSave={autoSaveState}
        toggleAutoSave={toggleAutoSave}

      />
      )}
      {get(currentPermissions, permissions.history) && (
        <SideBar
          sectionId={historySectionId}
          showSidebar={sidebar.show}
          setShowSidebar={(show) => setSidebar({ ...sidebar, show })}
          snapSidebar={sidebar.snap}
          setSnapSidebar={(snap) => setSidebar({ ...sidebar, snap })}
        />
      )}
      <Editor
        status={EditorStatus.IN_PROGRESS}
        onShowHistory={(sectionId: string) => {
          setHistorySectionId(sectionId);
          setSidebar({ ...sidebar, show: true });
        }}
        onChange={handleChange}
        isReady={isReady}

      />

    </main>
  );
}

export default ReactEditor;
