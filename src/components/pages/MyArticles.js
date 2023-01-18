/* eslint-disable no-console */
// @flow
import React from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { get, isEqual, map } from 'lodash';
import { useNavigate } from 'react-router-dom';
import Footer from '../containers/Footer';
import { selectors as articleSelectors, actions } from '../../store/articleStore';
import { selectors as userSelectors } from '../../store/userStore';
import ArticleCard from '../containers/ArticleCard';
import Rocket from '../../images/RocketLaunch.png';
import Space from '../../images/SpaceImg.png';
import Astronaut from '../../images/AstronautImg.png';
import Earth from '../../images/EarthImg.png';
import { store } from '../../store';

const images = [Rocket, Space, Astronaut, Earth];

function MyArticles(): Node {
  const dummyDescription = "This article is about the history of the universe. It's a long story, but it's a good one. I hope you enjoy it!";
  const articles = useSelector((state) => articleSelectors.getUsersArticles(state), isEqual);
  const user = useSelector((state) => userSelectors.getUser(state), isEqual);

  const dispatch = useDispatch();
  const createArticle = (userId : number) => dispatch(actions.createArticle(userId));
  const deleteArticle = (id) => dispatch(actions.deleteArticle(id));

  const navigate = useNavigate();

  const handleCreateArticle = () => {
    createArticle(user.id);
  };

  const handleEditClick = (id) => {
    navigate(`/submit-work/${id}`);
  };

  const handleDeleteClick = (id) => {
    deleteArticle(id);
  };
  console.log('user', user);
  console.log('my', articles);
  console.log('store', store.getState());

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
              author={get(a, 'user.full_name')}
              tags={get(a, 'tags')}
              date={get(a, 'updated_at')}
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
