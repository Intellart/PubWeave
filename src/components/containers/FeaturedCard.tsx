// import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { Link } from "react-router-dom";
import { Tags } from "../../store/article/types";
// import { useScreenSize } from '../../utils/hooks';

type Props = {
  img: string;
  id: number;
  title: string;
  category: string;
  description: string;
  author: string;
  slug: string;
  date: string;
  // eslint-disable-next-line react/no-unused-prop-types
  tags?: Tags;
  // editable?: Function,
  // deleteable?: Function,
  status?: string;
  // likeable?: boolean,
};

function FeaturedCard(props: Props) {
  // const { isMobile } = useScreenSize();
  console.log("FeaturedCard", props.status);

  const description = props.description
    ? props.description
    : "Some quick example text to build on the card title and make up the bulk of the cards content.";

  return (
    <>
      <Link to={`/singleblog/${props.slug || props.id}`}>
        <div key={props.id} className="featured-card">
          <img src={props.img} className="featured-card-img" alt="featured" />
          <div className="categoryname-share-like">
            <h4>{props.category || "Category"}</h4>
            <div className="icons-share-heart">
              {/* <Modal enabled type="share" /> */}
              {/* <FontAwesomeIcon icon={faHeart} /> */}
            </div>
          </div>
          <h2 className="featured-card-title">{props.title}</h2>
          <hr className="featured-card-divider" />
          <p className="featured-card-description">
            {description.substring(0, 70)}...
          </p>
          <div className="author-date">
            <p>By {props.author}</p>
            <p>{props.date}</p>
          </div>
        </div>
      </Link>
      {/* <FontAwesomeIcon
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: 'Web Share API',
              text: 'Check out Web Share API!',
              url: 'https://web.dev/web-share/',
            })
              .then(() => console.log('Successful share'))
              .catch((error) => console.log('Error sharing', error));
          }
        }}
        icon={faShare}
      /> */}
    </>
  );
}

export default FeaturedCard;
