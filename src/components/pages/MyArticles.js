/* eslint-disable no-console */
// @flow
import React, { useEffect } from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { get, isEqual, map } from 'lodash';
import Navbar from '../containers/Navbar';
import Footer from '../containers/Footer';

import { actions } from '../../store/articleStore';
import { store } from '../../store';
import ArticleCard from '../containers/ArticleCard';
import Rocket from '../../images/RocketLaunch.png';
import Space from '../../images/SpaceImg.png';
import Astronaut from '../../images/AstronautImg.png';
import Earth from '../../images/EarthImg.png';

const images = [Rocket, Space, Astronaut, Earth];

function MyArticles(): Node {
  store.getState();

  const articles = useSelector((state) => get(state, 'article.allArticles'), isEqual);

  const dispatch = useDispatch();
  const fetchAllArticles = () => dispatch(actions.fetchAllArticles());
  const createArticle = () => dispatch(actions.createArticle());
  const deleteArticle = (id) => dispatch(actions.deleteArticle(id));

  useEffect(() => {
    if (!articles) {
      fetchAllArticles();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articles]);

  const handleCreateArticle = () => {
    createArticle();
  };

  const handleEditClick = (id) => {
    window.location.href = `/submit-work/${id}`;
  };

  const handleDeleteClick = (id) => {
    deleteArticle(id);
  };

  console.log(store.getState());

  return (
    <main className="my-articles-wrapper">
      <Navbar />
      <section className="articles">
        <div className="articles-title">
          <h1>My Articles in progress</h1>
          <FontAwesomeIcon
            icon={faPlus}
            onClick={() => handleCreateArticle()}
          />
        </div>
        <div className="articles-list">
          {map(articles, (a) => (
            <ArticleCard
              status={a.article_content.status}
              img={images[a.id % 4]}
              id={a.id}
              key={a.id}
              title={a.title}
              category={a.article_content.category}
              description={a.article_content.description}
              author={a.article_content.author}
              tags={a.article_content.tags}
              date={a.date}
              editable={handleEditClick}
              deleteable={handleDeleteClick}
            />
          ))}
        </div>
      </section>
      {/* --------------------------------- */}
      <Footer />
    </main>
  );
}

export default MyArticles;
