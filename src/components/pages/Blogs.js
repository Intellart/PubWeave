// @flow
import React, { useEffect } from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import { get, isEqual, map } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../containers/Navbar';
import Footer from '../containers/Footer';
import FeaturedCard from '../containers/FeaturedCard';
// import MyTable from '../containers/MyTable';
import ArticleCard from '../containers/ArticleCard';
import Rocket from '../../images/RocketLaunch.png';
import Space from '../../images/SpaceImg.png';
import Astronaut from '../../images/AstronautImg.png';
import Earth from '../../images/EarthImg.png';
import { actions } from '../../store/articleStore';
import { store } from '../../store';

// const articles = [
//   {
//     id: 1,
//     title: 'Space and beyond',
//     description: 'Space is the boundless three-dimensional extent in which objects and events have relative position and direction. Physical space is often conceived in three linear dimensions, although modern physicists usually consider it, with time, to be part of a boundless four-dimensional continuum known as spacetime. The concept of space is considered to be of fundamental importance to an understanding of the physical universe. However, disagreement continues between philosophers over whether it is itself an entity, a relationship between entities, or part of a conceptual framework.',
//     image: Space,
//     author: 'John Doe',
//     category: 'Astronomy',
//     tags: ['Technology', 'Science', 'Business'],
//     date: '2020-10-10',
//   },
//   {
//     id: 2,
//     title: 'Astronauts',
//     description: 'An astronaut or cosmonaut is a person trained by a human spaceflight program to command, pilot, or serve as a crew member of a spacecraft. While generally reserved for professional space travelers, the terms are sometimes applied to anyone who travels into space, including scientists, politicians, journalists, and tourists.',
//     image: Astronaut,
//     author: 'Astronaut Doe',
//     category: 'Astronomy and Space',
//     tags: ['Technology', 'Science', 'Travel'],
//     date: '2018-05-10',
//   },
//   {
//     id: 3,
//     title: 'Earth',
//     description: 'Earth is the third planet from the Sun and the only astronomical object known to harbor life. About 29% of Earth\'s surface is land consisting of continents and islands. The remaining 71% is covered with water, mostly by oceans but also lakes, rivers and other fresh water, which together constitute the hydrosphere. Much of Earth\'s polar regions are covered in ice. Earth\'s outer layer is divided into several rigid tectonic plates that migrate across the surface over many millions of years. Earth\'s interior remains active with a solid iron inner core, a liquid outer core that generates the Earth\'s magnetic field, and a convecting mantle that drives plate tectonics.',
//     image: Earth,
//     author: 'Earth Doe',
//     category: 'Biology',
//     tags: ['Bio', 'Science', 'Travel'],
//     date: '2018-05-10',
//   },
//   {
//     id: 4,
//     title: 'Rocket Launch',
//     description: 'A rocket is a missile, spacecraft, aircraft or other vehicle that obtains thrust from a rocket engine. Rocket engine exhaust is formed entirely from propellant carried within the rocket before use. Rocket engines work by action and reaction and push rockets forward simply by expelling their exhaust in the opposite direction at high speed, and can therefore work in the vacuum of space. In fact, rockets work more efficiently in space than in an atmosphere. Multistage rockets are capable of attaining escape velocity from Earth\'s surface, allowing interplanetary travel.',
//     image: Rocket,
//     author: 'Rocket Doe',
//     category: 'Astronomy and Space',
//     tags: ['Technology', 'Science', 'Travel'],
//     date: '2018-05-10',
//   },
// ];

const images = [Rocket, Space, Astronaut, Earth];

function Blogs(): Node {
  store.getState();

  const articles = useSelector((state) => get(state, 'article.allArticles'), isEqual);

  const dispatch = useDispatch();
  const fetchAllArticles = () => dispatch(actions.fetchAllArticles());

  useEffect(() => {
    if (!articles) {
      fetchAllArticles();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articles]);

  return (
    <main className="blogs-wrapper">
      <Navbar />
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
          <h4>Category Name</h4>
          <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit</h2>
          <p>Pellentesque laoreet porta lectus sed ornare. Aenean at nisi dui. Mauris dapibus facilisis <br /> viverra. Sed luctus vitae lacus vel dapibus. Mauris nec diam nulla. Mauris fringilla augue <br /> vitae sollicitudin vestibulum.</p>
          <div className="author">
            <h6>John Doe, Jane Doe...</h6><br />
            <h6>Updated Jan 1, 2022</h6>
          </div>
        </div>
      </section>
      <section className="featured">
        <h2 style={{ marginLeft: 100, marginTop: 20, marginBottom: 20 }}>Browse all categories</h2>
        <div className='catgories-headlines'>
          <div>
            <p>Category name 1</p>
            <p>Category name 2</p>
          </div>
          <div>
            <p>Category name 3</p>
            <p>Category name 4</p>
          </div>
          <div>
            <p>Category name 5</p>
            <p>Category name 6</p>
          </div>
        </div>
        <hr className="featured-divider" />
        <h2 style={{ marginLeft: 100 }}>Featured</h2>
        <div className='featured-cards'>
          <FeaturedCard />
          <FeaturedCard />
          <FeaturedCard />
        </div>
        <hr className="featured-divider" />
        <h2 style={{ marginLeft: 100, marginBottom: 20 }}>Latest Blog Posts</h2>
        {map(articles, (a) => (
          <ArticleCard
            status={get(a, 'article_content.status', '')}
            img={images[a.id % 4]}
            id={a.id}
            key={a.id}
            title={a.title}
            category={get(a, 'article_content.category', '')}
            description={get(a, 'article_content.description', '')}
            author={get(a, 'article_content.author', '')}
            tags={get(a, 'article_content.tags', [])}
            date={a.date}
          />
        ))}
      </section>
      <Footer />
    </main>
  );
}

export default Blogs;
