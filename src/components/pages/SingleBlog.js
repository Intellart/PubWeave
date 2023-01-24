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
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  filter, find, get, isEmpty, isEqual, map,
} from 'lodash';
import { createReactEditorJS } from 'react-editor-js';
import { Chip } from '@mui/material';
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
  const createComment = (articleId, userId, comment, replyTo) => dispatch(actions.createComment(articleId, userId, comment, replyTo));

  const article = useSelector((state) => selectors.article(state), isEqual);
  const articleContent = useSelector((state) => selectors.articleContent(state), isEqual);
  const categories = useSelector((state) => selectors.getCategories(state), isEqual);

  useEffect(() => {
    if (!article && id) {
      fetchArticle(id);
    } else if (article && id) {
      setThumbnailLink(get(map(filter(get(articleContent, 'blocks', []), (block) => block.type === 'image'), (block) => get(block, 'data.file.url')), '[1]', SingleBlog));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article, id]);

  console.log(article);

  const getRoute = (catId) => get(find(categories, (cat) => cat.id === catId), 'category_name');

  return (
    <main className="blogs-wrapper">
      <section className="blogs-category-highlight single-page">
        <div className="category-highlight-single-page-text">
          <div className="category-highlight-single-page-text-left">
            <h1 className="category-highlight-category">{get(article, 'category', '')}</h1>
            <h2 className="category-highlight-title">title</h2>
            <div className="category-highlight-single-page-text-left-tags">
              {map(get(article, 'tags', []), (tag, index) => (
                <Link
                  key={index}
                  to={`/blogs/${getRoute(tag.category_id)}/${tag.tag_name}`}
                >
                  <Chip
                    variant='outlined'
                    key={tag.id}
                    sx={{ color: 'white', borderColor: 'white', marginRight: 1 }}
                    label={tag.tag_name}
                    className="category-highlight-single-page-text-left-tags-chip"
                  />
                </Link>
              ))}
            </div>
          </div>
          <div className="category-highlight-single-page-text-right">
            <div className="category-highlight-single-page-text-right-social-icons">
              <FontAwesomeIcon icon={faTwitter} style={{ width: 35, height: 35 }} />
              <FontAwesomeIcon icon={faLinkedin} style={{ width: 35, height: 35 }} />
              <FontAwesomeIcon icon={faFacebook} style={{ width: 35, height: 35 }} />
            </div>
            <div className="category-highlight-single-page-text-right-author">
              <Avatar alt="Remy Sharp" src={AvatarImg} />
              <div className="category-highlight-single-page-text-right-author-text">
                <p className="category-highlight-single-page-text-right-author-text-name">Author</p>
                <p className="category-highlight-single-page-text-right-author-text-date">date</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <img src={thumbnailLink} className="single-blog-img" alt="single blog" />
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
      <hr className="single-blog-content-divider" />
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

      <Footer />
    </main>
  );
}

export default Blogs;
