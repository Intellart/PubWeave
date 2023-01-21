// @flow
import React from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import {
  filter,
  get, isEqual, map, sampleSize,
} from 'lodash';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import classNames from 'classnames';
import { Chip } from '@mui/material';
import Footer from '../containers/Footer';
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

  const { cat, tag } = useParams();

  // console.log(cat, tag);

  const filteredArticles = cat ? articles.filter((a) => a.category === cat) : articles;
  const categoryTags = cat ? filter(tags, (t) => t.category.category_name === cat) : sampleSize(tags, 6);

  return (
    <main className="blogs-wrapper">
      <section className="blogs-category-highlight">
        <div className="category-highlight-text">
          <div className="all-chips">
            {map(categoryTags, (t) => (
              <Link
                key={t.id}
                className="chip"
                to={`/blogs/${t.category.category_name}/${t.tag}`}
              >
                <Chip
                  id={t.id}
                  label={t.tag}
                  variant={tag === t.tag ? 'default' : 'outlined'}
                  sx={{
                    backgroundColor: tag === t.tag ? 'primary.main' : 'transparent',
                    color: 'white',
                  }}
                />
              </Link>
            ))}
          </div>
          {cat && <h4>{cat}</h4> }
          <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit</h2>
          <p>Pellentesque laoreet porta lectus sed ornare. Aenean at nisi dui. Mauris dapibus facilisis <br /> viverra. Sed luctus vitae lacus vel dapibus. Mauris nec diam nulla. Mauris fringilla augue <br /> vitae sollicitudin vestibulum.</p>
          <div className="author">
            <h6>John Doe, Jane Doe...</h6><br />
            <h6>Updated Jan 1, 2022</h6>
          </div>
        </div>
      </section>
      <section className="blogs-featured">
        {cat && (
        <Link
          to="/blogs"
        >
          <h2 className='blogs-featured-categories-list-browse-all'>Browse all categories</h2>
        </Link>
        ) }
        <div className='blogs-featured-categories-list'>
          {map(categories, (c) => (
            <Link
              key={c.id}
              className={classNames('blogs-featured-categories-list-item',
                { 'blogs-featured-categories-list-item-active': c.category_name === cat })}
              to={`/blogs/${c.category_name}`}
            >
              <p>{c.category_name}
              </p>
            </Link>
          ))}
        </div>
        <hr className="blogs-featured-divider" />
        <h2 className="blogs-featured-subtitle">Featured</h2>
        <div className='blogs-featured-cards'>
          {map(filteredArticles.slice(0, 3), (a) => (
            <FeaturedCard
              key={a.id}
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
        <h2 className="blogs-featured-subtitle">Latest Blog Posts</h2>
        <div className='blogs-other-cards'>
          {map(filteredArticles, (a) => (
            <ArticleCard
              key={a.id}
              article={a}
            />
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}

export default Blogs;
