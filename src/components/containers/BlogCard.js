/* eslint-disable react/no-unused-prop-types */
// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { map } from 'lodash';
import { Chip } from '@mui/material';
import FeaturedImg from '../../images/featured-card.png';

type Props = {
  id: number,
  title: string,
  category: string,
  description: string,
  author: string,
  date: string,
  tags: Array<string>,
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
        <hr className="blog-card-divider" />
        <h3 className="blog-card-title">{props.title}</h3>
        <p className="blog-card-description">Some quick example text to build on the card title and make up the bulk of the cards content.</p>
        <div className="all-chips">
          {map(props.tags, (tag, index) => (
            <Chip key={index} label={tag} />
          ))}
        </div>
        <div className="author-date">
          <p> Authors Name</p>
          <p> Date</p>
        </div>
        <hr className="blog-card-divider" />
      </div>
    </div>
  );
}

export default BlogCard;
