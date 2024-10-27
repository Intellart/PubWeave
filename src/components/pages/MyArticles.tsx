import { Fragment, useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { filter, isEqual, map, slice, size } from "lodash";
import { Chip, Pagination } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import ArticleCard from "../containers/ArticleCard";
import { useScrollTopEffect } from "../../utils/hooks";
import routes from "../../routes";
import HowItWorks from "../modal/HowItWorks";
import { ReduxState } from "../../types";
import articleSelectors from "../../store/article/selectors";
import userSelectors from "../../store/user/selectors";
import articleActions from "../../store/article/actions";
import { Article } from "../../store/article/types";

function MyArticles() {
  const [lastKnownSize, setLastKnownSize] = useState(-1);
  const navigate = useNavigate();

  const { type } = useParams();

  // const setting = get(workTypes, type, workTypes.articles);

  useScrollTopEffect();
  const articles = useSelector(
    (state: ReduxState) => articleSelectors.getUsersArticles(state),
    isEqual
  );
  const user = useSelector(
    (state: ReduxState) => userSelectors.getUser(state),
    isEqual
  );

  // console.log(articles);

  useEffect(() => {
    if (lastKnownSize === size(articles) - 1 && size(articles) > 0) {
      navigate(routes.myWork.project(type, articles[size(articles) - 1].id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articles, lastKnownSize]);

  const categories = [
    { id: "all", name: "All" },
    { id: "collaborating", name: "Collaborating" },
    { id: "reviewing", name: "Reviewing" },
    { id: "published", name: "Published" },
    { id: "requested", name: "Requested" },
    { id: "rejected", name: "Rejected" },
    { id: "draft", name: "Draft" },
  ];
  const [statusCategory, setStatusCategory] = useState("all");

  const itemsPerPage = 5;
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();
  const createArticle = (userId: number) =>
    dispatch(articleActions.createArticle(userId));
  const deleteArticle = (id: number) =>
    dispatch(articleActions.deleteArticle(id));
  const convertArticle = (id: number) =>
    dispatch(articleActions.convertArticle(id));

  const handleCreateArticle = () => {
    createArticle(user!.id);
    setLastKnownSize(size(articles));
  };

  const handleDeleteClick = (id: number) => {
    // eslint-disable-next-line no-restricted-globals, no-alert
    if (confirm("Are you sure you want to delete this article?")) {
      deleteArticle(id);
    }
  };

  const handleArticleClick = (article: Article) => {
    switch (article.status) {
      case "published":
        navigate(routes.blogs.blog(article.id));
        break;
      case "reviewing":
        navigate(routes.myWork.review(type, article.id));
        break;
      default:
        navigate(routes.myWork.project(type, article.id));
    }
  };

  return (
    <main className="my-articles-wrapper">
      <section className="articles">
        <div className="articles-title">
          <h1>My work</h1>
          <FontAwesomeIcon
            className="add-article-icon"
            icon={faPlus}
            onClick={() => handleCreateArticle()}
          />
        </div>
        <HowItWorks type="article" />
        <div className="articles-filter">
          {map(categories, (c) => (
            <Chip
              key={c.id}
              label={`${c.name} (${
                filter(articles, (a) =>
                  c.id !== "all" ? a.status === c.id : true
                ).length
              })`}
              variant={statusCategory === c.id ? "filled" : "outlined"}
              onClick={() => {
                setStatusCategory(c.id);
                setPage(1);
              }}
            />
          ))}
        </div>
        <div className="articles-list">
          {map(
            slice(
              filter(
                articles,
                (a) => a.status === statusCategory || statusCategory === "all"
              ),
              (page - 1) * itemsPerPage,
              page * itemsPerPage
            ),
            (a) => (
              <Fragment key={a.id}>
                <ArticleCard
                  article={a}
                  showPublishedChip
                  onDelete={handleDeleteClick}
                  onClick={() => handleArticleClick(a)}
                  currentUserId={user?.id}
                  onConvert={() => {
                    convertArticle(a.id);
                    window.location.reload();
                  }}
                />
                <hr />
              </Fragment>
            )
          )}
        </div>
        <Pagination
          count={Math.ceil(
            filter(
              articles,
              (a) => a.status === statusCategory || statusCategory === "all"
            ).length / itemsPerPage
          )}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "2rem",
            width: "100%",
          }}
          page={page}
          onChange={(_e, value) => {
            setPage(value);
          }}
        />
      </section>
      {/* --------------------------------- */}
    </main>
  );
}

export default MyArticles;
