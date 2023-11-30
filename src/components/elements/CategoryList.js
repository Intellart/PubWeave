/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-prop-types */
// @flow
import React, { useEffect, useRef } from 'react';
import type { Node } from 'react';
import { map, omitBy, filter } from 'lodash';
import classNames from 'classnames';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

type CategoryItemProps = {
  name:string,
  articleCount:number,
  isActive:boolean,
};

export function CategoryItem(props: CategoryItemProps): Node {
  const navigate = useNavigate();

  return (
    <motion.div
      className={classNames('category-list-item', { 'category-list-item-active': props.isActive })}
      layoutId={props.isActive ? 'category-list-item-active' : null}
      onClick={() => navigate(`/blogs/${props.name}`)}
    >
      <div className='category-list-item-block-left' />
      <div className='category-list-item-inner-overlay'>
        <div className={classNames('category-list-item-inner', { 'category-list-item-empty': !props.articleCount })}>
          <p className='category-list-item-name'>{props.name}</p>
          <p className='category-list-item-count'>{props.articleCount || 0} articles</p>
        </div>
      </div>
      <div className='category-list-item-block-right' />
    </motion.div>
  );
}

type CategoryListProps = {
  categories: Array<Object>,
  activeCategory?: string,
  undefinedArticles?:number,
};

export function CategoryList(props: CategoryListProps): Node {
  const categoryListRef = useRef<any>(null);

  const maxScrollWidth = useRef(0);
  const clientScrollWidth = useRef(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);

  useEffect(() => {
    if (categoryListRef.current) {
      maxScrollWidth.current = categoryListRef.current.scrollWidth;
      clientScrollWidth.current = categoryListRef.current.clientWidth;
    }
  }, [categoryListRef]);

  useEffect(() => {
    if (scrollLeft < 0) {
      setScrollLeft(0);
    } else if (scrollLeft > clientScrollWidth.current) {
      setScrollLeft(clientScrollWidth.current);
    }
  }, [scrollLeft]);

  return (
    <div className={classNames('category-list-wrapper',
      { 'category-list-wrapper-empty': !props.activeCategory })}
    >
      <div
        className='category-list-side-block-left'
        onClick={() => {
          categoryListRef.current?.scrollTo({
            left: scrollLeft - clientScrollWidth.current,
            behavior: 'smooth',
          });

          setScrollLeft(scrollLeft - clientScrollWidth.current);
        }}
      >
        {scrollLeft > 0
        && (
        <FontAwesomeIcon
          icon={faAngleLeft}
          className='category-list-side-block-icon'
        />
        ) }
      </div>
      <div ref={categoryListRef} className='category-list-inner'>
        {props.undefinedArticles
        && (
        <CategoryItem
          key='Undefined'
          isActive={props.activeCategory === 'Undefined'}
          name='Undefined'
          articleCount={props.undefinedArticles}
        />
        )}
        {map(props.categories, (c, index) => (
          <CategoryItem
            key={index}
            isActive={c.name === props.activeCategory}
            name={c.name}
            articleCount={c.count}
          />
        ))}
      </div>
      <div
        className='category-list-side-block-right'
        onClick={() => {
          categoryListRef.current?.scrollTo({
            left: scrollLeft + clientScrollWidth.current,
            behavior: 'smooth',
          });

          setScrollLeft(scrollLeft + clientScrollWidth.current);
        }}
      >
        {(scrollLeft < clientScrollWidth.current || !clientScrollWidth.current)
        && (
        <FontAwesomeIcon
          icon={faAngleRight}
          className='category-list-side-block-icon'
        />
        )}
      </div>
    </div>
  );
}
