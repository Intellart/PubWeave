// @flow
import React from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import {
  filter,
  get, isEqual, map,
  isEmpty,
} from 'lodash';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import classNames from 'classnames';
import { Chip } from '@mui/material';
import FeaturedCard from '../containers/FeaturedCard';
// import MyTable from '../containers/MyTable';
import ArticleCard from '../containers/ArticleCard';
import Rocket from '../../images/RocketLaunch.png';
import Space from '../../images/SpaceImg.png';
import Astronaut from '../../images/AstronautImg.png';
import Earth from '../../images/EarthImg.png';
import { selectors as articleSelectors } from '../../store/articleStore';

const images = [Rocket, Space, Astronaut, Earth];

function Blogs(): Node {
  const articles = useSelector((state) => articleSelectors.getPublishedArticles(state), isEqual);
  const categories = useSelector((state) => articleSelectors.getCategories(state), isEqual);
  const tags = useSelector((state) => articleSelectors.getTags(state), isEqual);

  const { cat, tag, userId } = useParams();

  // console.log(cat, tag, userId);

  let filteredArticles = cat ? articles.filter((a) => a.category === cat) : articles;
  filteredArticles = tag ? filteredArticles.filter((a) => map(a.tags, 'tag_name').includes(tag)) : filteredArticles;

  const categoryTags = cat ? filter(tags, (t) => get(categories, [t.category_id, 'category_name']) === cat) : [];

  const featuredArticles = filteredArticles.filter((a) => a.star);

  if (userId) {
    filteredArticles = filter(articles, (a) => a.user.id === parseInt(userId, 10));
  }

  return (
    <main className="blogs-wrapper">
      {!userId && (
      <section className="blogs-categories">
        <div className='blogs-featured-categories-list'>
          {cat && (
          <Link
            to="/blogs"
          >
            <h2 className='blogs-featured-categories-list-item blogs-featured-categories-list-item-all'>Browse all categories</h2>
          </Link>
          ) }
          {map(categories, (c, index) => (
            <Link
              key={index}
              className={classNames('blogs-featured-categories-list-item',
                { 'blogs-featured-categories-list-item-active': c.category_name === cat })}
              to={`/blogs/${c.category_name}`}
            >
              <p>{c.category_name}
              </p>
            </Link>
          ))}
        </div>

      </section>
      ) }
      <section className={classNames('blogs-category-highlight', { 'blogs-category-highlight-active': cat })}>
        <div className="category-highlight-text">
          {cat && <h4>{cat}</h4> }
          <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit</h2>
          <p>Pellentesque laoreet porta lectus sed ornare. Aenean at nisi dui. Mauris dapibus facilisis <br /> viverra. Sed luctus vitae lacus vel dapibus. Mauris nec diam nulla. Mauris fringilla augue <br /> vitae sollicitudin vestibulum.</p>
          <div className="all-chips">
            {map(categoryTags, (t, index) => {
              const catName = get(categories, [t.category_id, 'category_name']);

              return (
                <Link
                  key={index}
                  className="chip"
                  to={`/blogs/${catName}/${t.tag_name}`}
                >
                  <Chip
                    id={t.tag_name}
                    label={t.tag_name}
                    variant={tag === t.tag_name ? 'default' : 'outlined'}
                    sx={{
                      backgroundColor: tag === t.tag_name ? 'primary.main' : 'transparent',
                      color: 'white',
                    }}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      {!isEmpty(filteredArticles) ? (
        <section className={classNames('blogs-featured', { 'blogs-featured-active': cat })}>
          {/* <hr className="blogs-featured-divider" /> */}
          {!userId && (
          <><h2 className="blogs-featured-subtitle">Featured</h2>
            <div className='blogs-featured-cards'>
              {map(featuredArticles.slice(0, 3), (a, index) => (
                <FeaturedCard
                  key={index}
                  status={get(a, 'status', '')}
                  img={images[a.id % 4]}
                  id={a.id}
                  title={a.title}
                  category={get(a, 'category', '')}
                  description={get(a, 'description', '')}
                  author={get(a, 'user.full_name', '')}
                  tags={get(a, 'tags', [])}
                  date={a.date}
                />
              ))}
            </div>
            <hr className="blogs-featured-divider" />
          </>
          )}
          <h2 className="blogs-featured-subtitle">Latest Blog Posts</h2>
          <div className='blogs-other-cards'>
            {map(filteredArticles, (a, index) => (
              <ArticleCard
                key={index}
                article={a}
              />
            ))}
          </div>
        </section>
      ) : (
        <p className="blogs-no-articles">No articles found</p>
      )}
    </main>
  );
}

export default Blogs;
