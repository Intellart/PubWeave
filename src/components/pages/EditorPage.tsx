import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import { useNavigate, useParams } from "react-router-dom";
import {
  sum,
  words,
  get,
  map,
  isEqual,
  toInteger,
  isEmpty,
  values,
  flatten,
  size,
} from "lodash";
import classNames from "classnames";
import type {
  ArticleContentToServer,
  Block,
  BlockCategoriesToChange,
  FilledBlock,
} from "../../store/article/types";
import routes from "../../routes";
import TutorialModal from "../editor/TutorialModal";
import EditorTitle from "../editor/EditorTitle";
import ArticleConfig from "../editor/ArticleConfig";
import SideBar from "../editor/SideBar";
import Editor, { EditorEvent, EditorStatus } from "../editor/Editor";
import { editorPermissions, permissions } from "../../utils/hooks";
import { ReduxState } from "../../types";
import articleSelectors from "../../store/article/selectors";
import articleActions from "../../store/article/actions";
import { OutputData } from "@editorjs/editorjs";

const cookies = new Cookies();

const useAutoSave = () => {
  const [autoSave, setAutoSave] = useState(true);
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

const useEditorPageDispatch = (articleId?: string) => {
  const dispatch = useDispatch();
  const fetchArticle = (ind: number | string) =>
    dispatch(articleActions.fetchArticle(ind));
  const updateArticle = (articleId?: number | string, payload?: any) =>
    dispatch(articleActions.updateArticle(articleId, payload));
  const updateArticleContentSilently = (
    articleId?: number | string,
    newArticleContent?: ArticleContentToServer
  ) =>
    dispatch(
      articleActions.updateArticleContentSilently(articleId, newArticleContent)
    );
  const updateArticleContentSilentlyNew = (
    articleId?: number | string,
    newArticleContent?: OutputData
  ) =>
    dispatch(
      articleActions.updateArticleContentSilentlyNew(
        articleId,
        newArticleContent
      )
    );
  const addTag = (articleId: number, tagId: number) =>
    dispatch(articleActions.addTag(articleId, tagId));
  const removeTag = (articleTagId: number) =>
    dispatch(articleActions.removeTag(articleId, articleTagId));

  return {
    fetchArticle,
    updateArticle,
    updateArticleContentSilently,
    updateArticleContentSilentlyNew,
    addTag,
    removeTag,
  };
};

function ReactEditor() {
  const { id, type } = useParams();
  const navigate = useNavigate();

  const article = useSelector(articleSelectors.article, isEqual);
  const articleContent = useSelector(
    (state: ReduxState) => articleSelectors.articleContent(state),
    isEqual
  );
  const categories = useSelector(articleSelectors.getCategories, isEqual);
  const tags = useSelector(articleSelectors.getTags, isEqual);
  const blocks = useSelector(articleSelectors.getBlocks, isEqual);

  const {
    fetchArticle,
    updateArticle,
    updateArticleContentSilently,
    updateArticleContentSilentlyNew,
    addTag,
    removeTag,
  } = useEditorPageDispatch(id);

  const { autoSaveState, autosaveRef, toggleAutoSave } = useAutoSave();

  const currentPermissions = editorPermissions({
    type: get(article, "article_type") || "blog_article",
    status: "inProgress",
  });

  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState(0);
  const [historySectionId, setHistorySectionId] = useState<string | null>(null);

  const [sidebar, setSidebar] = useState({
    show: false,
    snap: false,
  });

  const isReady =
    !isEmpty(article) && id && get(article, "id") === toInteger(id);

  const articleTime = get(articleContent, "time");

  useEffect(() => {
    if (!isReady && id) {
      fetchArticle(id);
    } else if (isReady) {
      setWordCount(
        sum(map(blocks, (block) => words(get(block, "data.text")).length))
      );
      setLastSaved(articleTime || 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article, id, isReady]);

  const [openTutorialModal, setOpenTutorialModal] = useState(
    cookies.get("tutorial") !== "true"
  );
  // console.log('currentPermissions', currentPermissions);
  const [savedState, setSavedState] = useState<any>({
    blocks: [],
    time: 0,
    version: "1",
  });

  const handleManualSave = async () => {
    const blocksToAdd = flatten(values(savedState.blocks));

    updateArticleContentSilently(id, {
      time: savedState.time || 0,
      version: savedState.version || "1",
      blocks: blocksToAdd,
    });
  };

  const handleChange = (
    newBlocks: FilledBlock[],
    time?: number,
    version?: string
  ) => {
    console.log("newBlocks", autosaveRef.current);
    setWordCount(
      sum(map(newBlocks, (block) => words(get(block, "data.text")).length))
    );
    setLastSaved(time || 0);

    // setLastUpdatedArticleIds(map(newBlocks.changed, (block: Block) => block.id));

    setSavedState({
      blocks: newBlocks,
      time: time || 0,
      version: version || "1",
    });

    if (autosaveRef.current) {
      updateArticleContentSilently(id, {
        time: time || 0,
        version: version || "1",
        blocks: newBlocks,
      });
    }
  };

  const handleNewChange = (data: OutputData & { events: EditorEvent[] }) => {
    setLastSaved(data.time || 0);
    const getBlockSize = (block: Block) => size(words(get(block, "data.text")));

    setWordCount(sum(map(data.blocks, getBlockSize)));

    updateArticleContentSilentlyNew(id, data);
  };

  return (
    <main
      className={classNames("editor-wrapper", {
        "editor-wrapper-snap": sidebar.snap,
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
          cookies.set("tutorial", "true", { path: "/" });
        }}
      />
      <EditorTitle
        articleId={id}
        articleType={get(article, "article_type")}
        onShowSidebar={(show) =>
          setSidebar({ ...sidebar, show: show || !sidebar.show })
        }
        showSidebar={sidebar.show}
        title={get(article, "title")}
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
          onSave={handleManualSave}
          allTags={tags}
          addTag={addTag}
          removeTag={removeTag}
          autoSave={autoSaveState}
          toggleAutoSave={toggleAutoSave}
        />
      )}
      {get(currentPermissions, permissions.history) && (
        <SideBar
          sectionId={historySectionId}
          showSidebar={sidebar.show}
          setShowSidebar={(show: boolean) => setSidebar({ ...sidebar, show })}
          snapSidebar={sidebar.snap}
          setSnapSidebar={(snap: boolean) => setSidebar({ ...sidebar, snap })}
        />
      )}
      <Editor
        status={EditorStatus.IN_PROGRESS}
        onShowHistory={(sectionId: string) => {
          setHistorySectionId(sectionId);
          setSidebar({ ...sidebar, show: true });
        }}
        onChange={handleChange}
        isReady={!!isReady}
      />
    </main>
  );
}

export default ReactEditor;
