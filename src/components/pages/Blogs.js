// @flow
import React from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import { get, isEqual, map } from 'lodash';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
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

  const { id } = useParams();

  const filteredArticles = id ? articles.filter((a) => a.category === id) : articles;

  return (
    <main className="blogs-wrapper">
      <section className="category-highlight">
        <div className="category-highlight-text">
          <div className="all-chips">
            <div className="chip highlighted-chip">
              <div className="chip-content">Technology</div>
            </div>
            <div className="chip">
              <div className="chip-content">Science</div>
            </div>
            <div className="chip">
              <div className="chip-content">Business</div>
            </div>
            <div className="chip">
              <div className="chip-content">Chip Content</div>
            </div>
          </div>
          <h4>{id || 'Technology'}</h4>
          <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit</h2>
          <p>Pellentesque laoreet porta lectus sed ornare. Aenean at nisi dui. Mauris dapibus facilisis <br /> viverra. Sed luctus vitae lacus vel dapibus. Mauris nec diam nulla. Mauris fringilla augue <br /> vitae sollicitudin vestibulum.</p>
          <div className="author">
            <h6>John Doe, Jane Doe...</h6><br />
            <h6>Updated Jan 1, 2022</h6>
          </div>
        </div>
      </section>
      <section className="featured">
        <Link
          to="/blogs"
        >
          <h2 style={{ marginLeft: 100, marginTop: 20, marginBottom: 20 }}>Browse all categories</h2>
        </Link>
        <div className='catgories-headlines'>
          {map(categories, (c) => (
            <Link key={c.id} className="category-headline" to={`/blogs/${c.category_name}`}>
              <p>{c.category_name}
              </p>
            </Link>
          ))}
        </div>
        <hr className="featured-divider" />
        <h2 style={{ marginLeft: 100 }}>Featured</h2>
        <div className='featured-cards'>
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
        <hr className="featured-divider" />
        <h2 style={{ marginLeft: 100, marginBottom: 20 }}>Latest Blog Posts</h2>
        {map(filteredArticles, (a) => (
          <ArticleCard
            key={a.id}
            article={a}
          />
        ))}
      </section>
      <Footer />
    </main>
  );
}

export default Blogs;
