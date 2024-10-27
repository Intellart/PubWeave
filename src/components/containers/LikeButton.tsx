import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { find, get, size } from "lodash";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import articleActions from "../../store/article/actions";
import { Article } from "../../store/article/types";

type Props = {
  article: Article;
  userId?: number;
  iconType: "default" | "solid";
};

function LikeButton({ article, userId, iconType = "solid" }: Props) {
  const dispatch = useDispatch();
  const likeArticle = (articleId: number) =>
    dispatch(articleActions.likeArticle(articleId));
  const removeArticleLike = (articleId: number) =>
    dispatch(articleActions.likeArticleRemoval(articleId));
  const [userAlreadyLiked, setUserAlreadyLiked] = useState(
    find(get(article, "likes", []), (like) => like.user_id === userId)
  );

  // console.log(get(article, 'likes', []));

  useEffect(() => {
    setUserAlreadyLiked(
      find(get(article, "likes", []), (like) => like.user_id === userId) ||
        false
    );
  }, [article, userId]);

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
          if (!userId) {
            return;
          }

          if (userAlreadyLiked) {
            removeArticleLike(article.id);
          } else {
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
      <p>{size(get(article, "likes", 0))}</p>
    </div>
  );
}

export default LikeButton;
