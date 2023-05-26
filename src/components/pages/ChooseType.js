import React from 'react';
import { motion } from 'framer-motion';
import { map } from 'lodash';
import { useNavigate } from 'react-router-dom';
import work1 from '../../assets/images/div-backgrounds/work1.png';
import work2 from '../../assets/images/div-backgrounds/work2.png';
import work3 from '../../assets/images/div-backgrounds/work3.png';
import routes from '../../routes';

function ChooseType() {
  const backgrounds = [work1, work2, work3];
  const rotations = [-7, 2, -4];
  const labels = ['Articles', 'Blogs', 'Preprints'];

  const navigate = useNavigate();

  const motionItemProps = (id) => ({
    className: 'work-types-item',
    initial: { scale: 0, rotate: 90 },
    animate: { rotate: 0, scale: 1 },
    onClick: () => navigate(routes.myWork.choose(labels[id].toLowerCase())),
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
      delay: 0.1 * id,
    },
    whileHover: {
      scale: 1.1,
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
    style: {
      backgroundImage: `url(${backgrounds[id]})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    },
  });

  return (
    <main className="work-types-wrapper">
      <section className="work-types-items-wrapper">
        {map(labels, (label, id) => (
          <motion.div
            key={id}
            {...motionItemProps(id)}
          >
            <div
              className="work-types-item-title"
              style={{
                transform: `rotate(${rotations[id]}deg)`,
              }}
            >
              <h1>{label}</h1>
            </div>
          </motion.div>
        ))}
      </section>
    </main>
  );
}

export default ChooseType;
