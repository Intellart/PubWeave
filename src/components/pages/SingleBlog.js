// @flow
import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
import 'bulma/css/bulma.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faHeartBroken } from '@fortawesome/free-solid-svg-icons';
// import FeaturedImg from '../../images/featured-card.png';
// import { faComment } from '@fortawesome/free-regular-svg-icons';
import { faFacebook, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import Avatar from '@mui/material/Avatar';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  filter, get, isEmpty, isEqual, map,
} from 'lodash';
import { createReactEditorJS } from 'react-editor-js';
import Footer from '../containers/Footer';
import SingleBlog from '../../images/SingleBlog.png';
import AvatarImg from '../../images/Avatar.png';
import CommentModal from '../containers/CommentModal';
import { store } from '../../store';
import { actions, selectors } from '../../store/articleStore';
import { EDITOR_JS_TOOLS } from '../../utils/editor_constants';

const sampleBlog = () => (
  <section className="single-blog-content">
    <h2>Abstract</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget faucibus mauris. Maecenas pellentesque placerat consectetur. Suspendisse sed pharetra erat. Ut at vestibulum arcu. Ut a ex elit. Mauris purus odio, gravida id egestas id, pellentesque id libero. Vivamus tortor massa, lobortis id hendrerit eget, facilisis at orci. Duis tincidunt purus sem, id vulputate libero consequat at. Vivamus egestas tellus massa, at pretium quam maximus sed. Cras ac nisi posuere, cursus velit id, tincidunt metus. Etiam magna turpis, luctus quis lacinia nec, blandit mattis tellus.</p>
    <hr className="single-blog-content-divider" />
    <h2>Introduction</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget faucibus mauris. Maecenas pellentesque placerat consectetur. Suspendisse sed pharetra erat. Ut at vestibulum arcu. Ut a ex elit. Mauris purus odio, gravida id egestas id, pellentesque id libero. Vivamus tortor massa, lobortis id hendrerit eget, facilisis at orci. Duis tincidunt purus sem, id vulputate libero consequat at. Vivamus egestas tellus massa, at pretium quam maximus sed. Cras ac nisi posuere, cursus velit id, tincidunt metus. Etiam magna turpis, luctus quis lacinia nec, blandit mattis tellus.</p>
    <hr className="single-blog-content-divider" />
    <h2>Results</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget faucibus mauris. Maecenas pellentesque placerat consectetur. Suspendisse sed pharetra erat. Ut at vestibulum arcu. Ut a ex elit. Mauris purus odio, gravida id egestas id, pellentesque id libero. Vivamus tortor massa, lobortis id hendrerit eget, facilisis at orci. Duis tincidunt purus sem, id vulputate libero consequat at. Vivamus egestas tellus massa, at pretium quam maximus sed. Cras ac nisi posuere, cursus velit id, tincidunt metus. Etiam magna turpis, luctus quis lacinia nec, blandit mattis tellus. Proin interdum dolor est, eu condimentum felis commodo vitae. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Ut rutrum mi libero, at dignissim enim consectetur in. Duis sodales interdum ornare. Maecenas erat felis, egestas at tempus sed, euismod id mauris. Nam ac augue in lacus tincidunt tempor. Cras odio ipsum, vulputate nec mollis a, pellentesque eget arcu. Integer finibus metus sed diam luctus, in consequat tortor hendrerit. In turpis odio, aliquet quis bibendum vel, facilisis consequat enim. Donec dignissim mi eget pulvinar sagittis. Pellentesque nibh urna, sagittis eget elementum ut, tincidunt et magna. Nunc consequat dignissim orci, id auctor nulla dictum quis. Mauris in urna non dui viverra feugiat. In convallis augue in finibus viverra. Proin at imperdiet lacus. Integer urna sapien, laoreet sed leo tincidunt, luctus tristique eros. Quisque ultrices, sapien in rhoncus ultrices, libero urna vulputate nisi, mattis mattis arcu massa id augue. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam laoreet viverra metus non fermentum. Sed tempus dictum neque non lacinia. Cras feugiat velit metus, ornare faucibus nulla luctus sit amet. Maecenas venenatis porta venenatis. Sed fermentum lectus et nulla suscipit accumsan.
    </p>
    <hr className="single-blog-content-divider" />
    <h2>Discussion</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget faucibus mauris. Maecenas pellentesque placerat consectetur. Suspendisse sed pharetra erat. Ut at vestibulum arcu. Ut a ex elit. Mauris purus odio, gravida id egestas id, pellentesque id libero. Vivamus tortor massa, lobortis id hendrerit eget, facilisis at orci. Duis tincidunt purus sem, id vulputate libero consequat at. Vivamus egestas tellus massa, at pretium quam maximus sed. Cras ac nisi posuere, cursus velit id, tincidunt metus. Etiam magna turpis, luctus quis lacinia nec, blandit mattis tellus.</p>
    <hr className="single-blog-content-divider" />
    <h2>Materials and methods</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget faucibus mauris. Maecenas pellentesque placerat consectetur. Suspendisse sed pharetra erat. Ut at vestibulum arcu. Ut a ex elit. Mauris purus odio, gravida id egestas id, pellentesque id libero. Vivamus tortor massa, lobortis id hendrerit eget, facilisis at orci. Duis tincidunt purus sem, id vulputate libero consequat at. Vivamus egestas tellus massa, at pretium quam maximus sed. Cras ac nisi posuere, cursus velit id, tincidunt metus. Etiam magna turpis, luctus quis lacinia nec, blandit mattis tellus.</p>
    <div className="reaction-icons">
      <FontAwesomeIcon
        style={{
          width: 28, height: 28, color: '#11273F', marginRight: 6,
        }}
        icon={faHeart}
      />
      <p>56</p>
      <FontAwesomeIcon
        style={{
          width: 28, height: 28, color: '#11273F', marginRight: 8, marginLeft: 14,
        }}
        icon={faHeartBroken}
      /><p>0</p>
      <CommentModal />
      <p>12</p>
    </div>
  </section>
);

const ReactEditorJS = createReactEditorJS();

function Blogs(): Node {
  const { id } = useParams();

  store.getState();

  // eslint-disable-next-line no-unused-vars
  const [thumbnailLink, setThumbnailLink] = useState('');

  const dispatch = useDispatch();
  const fetchArticle = (artId) => dispatch(actions.fetchArticle(artId));
  const createComment = (articleId, userId, comment) => dispatch(actions.createComment(articleId, userId, comment));

  const article = useSelector((state) => selectors.article(state), isEqual);
  const articleContent = useSelector((state) => selectors.articleContent(state), isEqual);

  useEffect(() => {
    if (!article && id) {
      fetchArticle(id);
    } else if (article && id) {
      setThumbnailLink(get(map(filter(get(articleContent, 'blocks', []), (block) => block.type === 'image'), (block) => get(block, 'data.file.url')), '[1]', SingleBlog));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article, id]);

  return (
    <main className="blogs-wrapper">
      <section className="category-highlight">
        <div className="category-highlight-text">
          <div className="headline-category-chips-author">
            <div className="category-headline-chips">
              <h4>{get(article, 'category', 'Technology')}</h4>
              <h2>Sample Blog</h2>
              <div className="all-chips">
                <div className="chip highlighted-chip">
                  <div className="chip-content">Technology</div>
                </div>
                <div className="chip">
                  <div className="chip-content">Science</div>
                </div>
                <div className="chip">
                  <div className="chip-content">Business</div>
                </div>
                <div className="chip">
                  <div className="chip-content">Chip Content</div>
                </div>
              </div>
            </div>
            <div className='social-author-info-box'>
              <div className="social">
                <FontAwesomeIcon icon={faTwitter} style={{ width: 35, height: 35 }} />
                <FontAwesomeIcon icon={faLinkedin} style={{ width: 35, height: 35 }} />
                <FontAwesomeIcon icon={faFacebook} style={{ width: 35, height: 35 }} />
              </div>
              <div className='author-info-box'>
                <Avatar alt="Remy Sharp" src={AvatarImg} />
                <div className='author-name-date'>
                  <p className='author-name'>Joe Doe</p>
                  <p className="published-date">Jan 1, 2022</p>
                </div>
              </div>
            </div>
          </div>
          <div />
          <div />
          <div />
          <div />
        </div>
      </section>
      <img src={thumbnailLink} className="single-blog-img" alt="single blog" />
      {!id && sampleBlog()}
      {!isEmpty(article) && id && (
      <ReactEditorJS
        holder='editorjs'
        readOnly
        onReady={() => {
          const editor = document.getElementById('editorjs');
          if (editor) { editor.setAttribute('spellcheck', 'false'); }
        }}
        defaultValue={{
          blocks: get(articleContent, 'blocks', []),
        }}
        tools={EDITOR_JS_TOOLS}
      />
      )}

      <div className="reaction-icons">
        <FontAwesomeIcon
          style={{
            width: 28, height: 28, color: '#11273F', marginRight: 6,
          }}
          icon={faHeart}
        />
        <p>{get(article, 'likes', 0)}</p>
        <FontAwesomeIcon
          style={{
            width: 28, height: 28, color: '#11273F', marginRight: 8, marginLeft: 14,
          }}
          icon={faHeartBroken}
        /><p>{get(article, 'dislikes', 0)}</p>
        <CommentModal
          comments={get(article, 'blog_article_comments', {})}
          createComment={createComment}
          articleId={id}
          authorId={get(article, 'user.id', 1)}
        />
        <p>12</p>
      </div>

      <Footer />
    </main>
  );
}

export default Blogs;
