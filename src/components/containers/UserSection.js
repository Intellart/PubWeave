import React from 'react';
import { motion } from 'framer-motion';
import classNames from 'classnames';

type UserSectionProps = {
    expandedCard: string | null,
    setExpandedCard: (string) => void,
    variants: Object,
    children: Node,
    title: string,
    index: number,
    titleIcon?: string,
  };

function UserSection ({
  expandedCard, setExpandedCard, variants, children, title, index, titleIcon,
}: UserSectionProps): Node {
  return (
    <section className={classNames('user-page-hero', { 'user-page-hero-expanded': expandedCard === `user-page-hero-${index}` })}>
      <div
        className="user-page-header"
        onClick={() => setExpandedCard(expandedCard === `user-page-hero-${index}` ? null : `user-page-hero-${index}`)}
      >
        <p className='user-page-header-title'>
          {titleIcon && <img src={titleIcon} alt="title icon" />}
          {title}
        </p>
      </div>
      <motion.div
        className="user-page-hidden-content"
        variants={variants}
        initial="hidden"
        animate={expandedCard === `user-page-hero-${index}` ? 'visible' : 'hidden'}
      >
        <div className="user-section-wrapper">
          {children}
        </div>
      </motion.div>
    </section>
  );
}

export default UserSection;
