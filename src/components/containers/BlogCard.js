// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import FeaturedImg from '../../images/featured-card.png';

type Props = {
  id: number,
  title: string,
  category: string,
  description: string,
  author: string,
  date: string
};

function BlogCard(props: Props): Node {
  return (
    <div className="blog-card">
      <img src={FeaturedImg} className="blog-card-img" alt="featured" />
      <div className="blog-card-inner">
        <div className="categoryname-share-like">
          <h4>{props.category}</h4>
          <div className="icons-share-heart">
            <a
              href={`/submit-work/${props.id}`}
            ><FontAwesomeIcon icon={faPenToSquare} />
            </a>

          </div>
        </div>
        <h3 className="blog-card-title">{props.title}</h3>
        <p className="blog-card-description">{props.description}</p>
        <div className="author-date">
          <p>{props.author}</p>
          <p>{props.date}</p>
        </div>
        <hr className="blog-card-divider" />
      </div>
    </div>
  );
}

export default BlogCard;
