/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-prop-types */
// @flow
import React, { useEffect, useRef } from 'react';
import type { Node } from 'react';
import { map, omitBy, filter } from 'lodash';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

type CategoryItemProps = {
  name:string,
  articleCount:number,
  isActive:boolean
};

export function CategoryItem(props: CategoryItemProps): Node {
  return (
    <Link to={`/blogs/${props.name}`} className={classNames('category-list-item', { 'category-list-item-active': props.isActive })}>
      <div className='category-list-item-block-left' />
      <div className='category-list-item-inner-overlay'>
        <div className='category-list-item-inner'>
          <p className='category-list-item-name'>{props.name}</p>
          <p className='category-list-item-count'>{props.articleCount || 0} articles</p>
        </div>
      </div>
      <div className='category-list-item-block-right' />
    </Link>
  );
}

type CategoryListProps = {
  categories: Array<Object>,
  activeCategory?: string
};

export function CategoryList(props: CategoryListProps): Node {
  const categoryListRef = useRef(null);

  const maxScrollWidth = useRef(0);
  const clientScrollWidth = useRef(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);

  useEffect(() => {
    if (categoryListRef.current) {
      maxScrollWidth.current = categoryListRef.current.scrollWidth;
      clientScrollWidth.current = categoryListRef.current.clientWidth;
      console.log(categoryListRef.current?.clientWidth);
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
    <div className='category-list-wrapper'>
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
        {map(props.categories, (c, index) => (
          <CategoryItem
            key={index}
            isActive={c.category_name === props.activeCategory}
            name={c.category_name}
            articleCount={0}
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
        {scrollLeft < clientScrollWidth.current
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
