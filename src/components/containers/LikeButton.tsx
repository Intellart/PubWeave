import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { find, get, isEqual, size } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import articleActions from "../../store/article/actions";
import { Article } from "../../store/article/types";
import userSelectors from "../../store/user/selectors";

type Props = {
  article?: Article | null;
  iconType: "default" | "solid";
};

function LikeButton({ article, iconType = "solid" }: Props) {
  const user = useSelector(userSelectors.getUser, isEqual);

  const dispatch = useDispatch();
  const likeArticle = (articleId: number) =>
    dispatch(articleActions.likeArticle(articleId));
  const removeArticleLike = (articleId: number) =>
    dispatch(articleActions.likeArticleRemoval(articleId));

  const likes = get(article, "likes") || [];

  const userAlreadyLiked = !!find(likes, (like) => like.user_id === user?.id);

  // if (!enabled) {
  //   return null;
  // }

  return (
    <div className="like-button-container">
      <FontAwesomeIcon
        className={classNames("like-button-icon", {
          "like-button-icon-active": userAlreadyLiked,
        })}
        onClick={() => {
          if (!user) {
            return;
          }

          if (userAlreadyLiked && article?.id) {
            removeArticleLike(article?.id);
          } else if (article?.id) {
            likeArticle(article.id);
          }
        }}
        icon={
          iconType === "default" && !userAlreadyLiked ? faHeart : faHeartSolid
        }
        style={{
          color: userAlreadyLiked ? "#FF0000" : "#11273F",
        }}
      />
      <p>{size(likes)}</p>
    </div>
  );
}

export default LikeButton;
