import articleImg from '../assets/images/div-backgrounds/work1.png';
import blogImg from '../assets/images/div-backgrounds/work2.png';
import preprintImg from '../assets/images/div-backgrounds/work3.png';

export const functionalities = {
  lockSections: 'LOCK_SECTIONS',
  criticalSections: 'CRITICAL_SECTIONS',
  versioning: 'VERSIONING',
};

export const workTypes = {
  blogs: {
    label: 'Blogs',
    background: blogImg,
    rotation: 2,
    index: 0,
    content: '1. Create a simple blog post with a images, videos, text, and more, and share it with others.',
  },
  preprints: {
    label: 'Preprints',
    background: preprintImg,
    rotation: -4,
    index: 1,
    content: '2. Create a preprint where you can share your research with other collaborators and get feedback.',
  },
  articles: {
    label: 'Articles',
    background: articleImg,
    rotation: -7,
    index: 2,
    content: '3. Convert your preprint into a full article and publish it to the world.',
  },
};
