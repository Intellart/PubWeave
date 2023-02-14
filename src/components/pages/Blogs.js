// @flow
import React from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import {
  filter,
  get, isEqual, map,
  isEmpty,
  omit,
  slice,
} from 'lodash';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import classNames from 'classnames';
import { Chip, Pagination } from '@mui/material';
import FeaturedCard from '../containers/FeaturedCard';
// import MyTable from '../containers/MyTable';
import ArticleCard from '../containers/ArticleCard';
import Rocket from '../../images/RocketLaunch.png';
import Space from '../../images/SpaceImg.png';
import Astronaut from '../../images/AstronautImg.png';
import Earth from '../../images/EarthImg.png';
import { selectors as articleSelectors } from '../../store/articleStore';
import { selectors as userSelectors } from '../../store/userStore';
import { useDebounce, useScrollTopEffect } from '../../utils/hooks';

const images = [Rocket, Space, Astronaut, Earth];

function Blogs(): Node {
  useScrollTopEffect();
  const articles = useSelector((state) => articleSelectors.getPublishedArticles(state), isEqual);
  const categories = useSelector((state) => articleSelectors.getCategories(state), isEqual);
  const tags = useSelector((state) => articleSelectors.getTags(state), isEqual);
  const user = useSelector((state) => userSelectors.getUser(state), isEqual);

  console.log(categories);

  const { cat, tag, userId } = useParams();

  let filteredArticles = cat ? articles.filter((a) => a.category === cat) : articles;
  filteredArticles = tag ? filteredArticles.filter((a) => map(a.tags, 'tag_name').includes(tag)) : filteredArticles;

  const categoryTags = cat ? filter(tags, (t) => get(categories, [t.category_id, 'category_name']) === cat) : [];

  const featuredArticles = filteredArticles.filter((a) => a.star);

  const debounceFeaturedArticles = useDebounce(featuredArticles, 500);
  const debounceFilteredArticles = useDebounce(filteredArticles, 500);
  const itemsPerPage = 5;
  const [page, setPage] = React.useState(1);

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
          {map(omit(categories, [12]), (c, index) => (
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
          {/* <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit</h2>
          <p>Pellentesque laoreet porta lectus sed ornare. Aenean at nisi dui. Mauris dapibus facilisis <br /> viverra. Sed luctus vitae lacus vel dapibus. Mauris nec diam nulla. Mauris fringilla augue <br /> vitae sollicitudin vestibulum.</p> */}
          <div className="all-chips">
            {map(categoryTags, (t, index) => {
              const catName = get(categories, [t.category_id, 'category_name']);

              return (
                <Link
                  key={index}
                  to={`/blogs/${catName}/${t.tag_name}`}
                >
                  <Chip
                    className="chip"
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
      {!isEmpty(debounceFilteredArticles) ? (
        <section className={classNames('blogs-featured', { 'blogs-featured-active': cat })}>
          {/* <hr className="blogs-featured-divider" /> */}
          {!userId && (
          <><h2 className="blogs-featured-subtitle">Featured</h2>
            <div className='blogs-featured-cards'>
              {map(debounceFeaturedArticles.slice(0, 3), (a, index) => (
                <FeaturedCard
                  key={index}
                  status={get(a, 'status', '')}
                  img={a.image || images[a.id % 4]}
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
            {map(slice(debounceFilteredArticles, (page - 1) * itemsPerPage, page * itemsPerPage), (a, index) => (
              <ArticleCard
                key={index}
                article={a}
                currentUserId={get(user, 'id', null)}
              />
            ))}
          </div>
          <Pagination
            count={Math.ceil(filteredArticles.length / itemsPerPage)}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '2rem',
              width: '100%',
            }}
            page={page}
            onChange={(e, value) => {
              setPage(value);
            }}
          />
        </section>
      ) : (
        <p className={classNames('blogs-no-articles unselectable', { 'blogs-no-articles-active': cat })}>
          No articles found
        </p>
      )}
    </main>
  );
}

export default Blogs;
