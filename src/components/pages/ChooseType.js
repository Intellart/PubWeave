import React from 'react';
import { motion } from 'framer-motion';
import { map } from 'lodash';
import { useNavigate } from 'react-router-dom';

import routes from '../../routes';
import { workTypes } from '../../constants';

type Props = {
  isUser: boolean,
};

function ChooseType({ isUser }: Props) {
  const navigate = useNavigate();

  const motionItemProps = (setting) => ({
    className: 'work-types-item',
    initial: { scale: 0, rotate: 90 },
    animate: { rotate: 0, scale: 1 },
    onClick: () => (isUser ? navigate(routes.myWork.root) : navigate(routes.login)),
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
      delay: 0.1 * setting.index,
    },
    whileHover: {
      scale: 1.1,
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
    style: {
      backgroundImage: `url(${setting.background})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    },
  });

  return (
    <main className="work-types-wrapper">
      <section className="work-types-items-wrapper">
        {map(workTypes, (setting, key) => (
          <div className="work-types-item-wrapper" key={key}>
            <motion.div
              key={key}
              {...motionItemProps(setting, key)}
            >
              <div
                className="work-types-item-title"
                style={{
                  transform: `rotate(${setting.rotation}deg)`,
                }}
              >
                <h1>{setting.label}</h1>
              </div>
            </motion.div>
            <div className="work-types-item-content">
              <p>{setting.content}</p>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

export default ChooseType;
