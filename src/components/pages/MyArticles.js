/* eslint-disable no-console */
// @flow
import React, { useEffect } from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { get, isEqual, map } from 'lodash';
import { useNavigate } from 'react-router-dom';
import Footer from '../containers/Footer';

import { actions } from '../../store/articleStore';
import ArticleCard from '../containers/ArticleCard';
import Rocket from '../../images/RocketLaunch.png';
import Space from '../../images/SpaceImg.png';
import Astronaut from '../../images/AstronautImg.png';
import Earth from '../../images/EarthImg.png';

const images = [Rocket, Space, Astronaut, Earth];

function MyArticles(): Node {
  const dummyDescription = "This article is about the history of the universe. It's a long story, but it's a good one. I hope you enjoy it!";
  const articles = useSelector((state) => get(state, 'article.allArticles'), isEqual);

  const dispatch = useDispatch();
  const fetchAllArticles = () => dispatch(actions.fetchAllArticles());
  const createArticle = () => dispatch(actions.createArticle());
  const deleteArticle = (id) => dispatch(actions.deleteArticle(id));

  const navigate = useNavigate();

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
    navigate(`/submit-work/${id}`);
  };

  const handleDeleteClick = (id) => {
    deleteArticle(id);
  };

  return (
    <main className="my-articles-wrapper">
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
              status={get(a, 'status')}
              img={images[a.id % 4]}
              id={get(a, 'id')}
              key={get(a, 'id')}
              title={get(a, 'title')}
              category={get(a, 'category')}
              description={dummyDescription || get(a, 'description')}
              author={get(a, 'author')}
              tags={get(a, 'tags')}
              date={get(a, 'date')}
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
