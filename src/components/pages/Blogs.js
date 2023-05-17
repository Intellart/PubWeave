// @flow
import React, { useEffect } from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import {
  filter,
  get, isEqual, map,
  isEmpty,
  slice,
} from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import classNames from 'classnames';
import { Chip, Pagination } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import FeaturedCard from '../containers/FeaturedCard';
// import MyTable from '../containers/MyTable';
import ArticleCard from '../containers/ArticleCard';
import Rocket from '../../images/RocketLaunch.png';
import Space from '../../images/SpaceImg.png';
import Astronaut from '../../images/AstronautImg.png';
import Earth from '../../images/EarthImg.png';
import { selectors as articleSelectors } from '../../store/articleStore';
import { actions, selectors as userSelectors } from '../../store/userStore';
import { /* useDebounce */useScrollTopEffect } from '../../utils/hooks';
import { CategoryList } from '../elements/CategoryList';
import OrcIDButton from '../elements/OrcIDButton';

const images = [Rocket, Space, Astronaut, Earth];

function Blogs(): Node {
  useScrollTopEffect();
  const articles = useSelector((state) => articleSelectors.getPublishedArticles(state), isEqual);
  const categories = useSelector((state) => articleSelectors.getCategories(state), isEqual);
  const tags = useSelector((state) => articleSelectors.getTags(state), isEqual);
  const user = useSelector((state) => userSelectors.getUser(state), isEqual);
  const selectedUser = useSelector((state) => userSelectors.getSelectedUser(state), isEqual);

  const dispatch = useDispatch();
  const getSelectedUser = (userId) => dispatch(actions.selectUser(userId));

  const { cat, tag, userId } = useParams();

  useEffect(() => {
    if (userId && !selectedUser) {
      getSelectedUser(userId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, selectedUser]);

  console.log(selectedUser);

  let filteredArticles = cat ? articles.filter((a) => a.category === cat) : articles;
  filteredArticles = tag ? filteredArticles.filter((a) => map(a.tags, 'tag_name').includes(tag)) : filteredArticles;

  const categoryTags = cat ? filter(tags, (t) => get(categories, [t.category_id, 'category_name']) === cat) : [];

  const featuredArticles = filteredArticles.filter((a) => a.star);

  const itemsPerPage = 5;
  const [page, setPage] = React.useState(1);

  if (userId) {
    filteredArticles = filter(articles, (a) => a.user.id === parseInt(userId, 10));
  }
  console.log(selectedUser);

  return (
    <main className="blogs-wrapper">
      {!userId && (
      <CategoryList
        categories={map(categories, (c) => ({
          name: c.category_name,
          count: filter(articles, (a) => a.category === c.category_name).length,
        }),
        )}
        activeCategory={cat}
      />
      )}
      {userId && (
        <section className="blogs-user-header">
          <div className="blogs-user-header-inner">
            <div className="blogs-user-header-left">
              <h1 className="blogs-user-header-title">
                {get(selectedUser, 'full_name', '')} (@{get(selectedUser, 'username', '')})
              </h1>
              <p className="blogs-user-header-subtitle">
                Sample bio: I am a software engineer at Google. I love to write about my experiences in the tech industry.
              </p>
            </div>
            <div className="blogs-user-header-right">
              {get(selectedUser, 'orcid_id') && (
              <OrcIDButton
                orcid={get(selectedUser, 'orcid_id', '')}
              />
              )}
              <div className="blogs-user-header-social-icons">
                {get(selectedUser, 'social_tw')
              && (
              <a target="_blank" href={get(selectedUser, 'social_tw')}>
                <FontAwesomeIcon icon={faTwitter} style={{ width: 35, height: 35 }} />
              </a>
              )}
                {get(selectedUser, 'social_ln')
              && (
                <a href={get(selectedUser, 'social_ln')}>
                  <FontAwesomeIcon icon={faLinkedin} style={{ width: 35, height: 35 }} />
                </a>
              )}
                {get(selectedUser, 'social_fb')
              && (
                <a target="_blank" href={get(selectedUser, 'social_fb')}>
                  <FontAwesomeIcon icon={faFacebook} style={{ width: 35, height: 35 }} />
                </a>
              )}
                {get(selectedUser, 'social_web')
              && (
                <a target="_blank" href={get(selectedUser, 'social_web')}>
                  <FontAwesomeIcon icon={faGlobe} style={{ width: 35, height: 35 }} />
                </a>
              )}
              </div>
            </div>
          </div>
        </section>
      )}
      <section className={classNames('blogs-category-highlight', { 'blogs-category-highlight-active': cat })}>
        <div className="category-highlight-text">
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
      {!isEmpty(filteredArticles) && (
        <section className={classNames('blogs-featured', { 'blogs-featured-active': cat })}>
          {!userId && (
          <>
            {!isEmpty(featuredArticles) && <h2 className="blogs-featured-subtitle">Featured</h2> }
            <div className='blogs-featured-cards'>
              {map(featuredArticles.slice(0, 3), (a, index) => (
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
          </>
          )}
        </section>
      )}
      {!isEmpty(filteredArticles) && <hr className={classNames('blogs-divider', { 'blogs-divider-active': cat })} /> }
      {!isEmpty(filteredArticles) && (
      <section className={classNames('blogs-other', { 'blogs-other-active': cat })}>
        <h2 className="blogs-other-subtitle">Latest Blog Posts</h2>
        <div className='blogs-other-cards'>
          {map(slice(filteredArticles, (page - 1) * itemsPerPage, page * itemsPerPage), (a, index) => (
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
      ) }
      {isEmpty(filteredArticles) && (
        <p className={classNames('blogs-no-articles unselectable', { 'blogs-no-articles-active': cat })}>
          No articles found
        </p>
      )}
    </main>
  );
}

export default Blogs;
