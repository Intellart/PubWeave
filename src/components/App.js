// @flow
import React from 'react';
import type { Node } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import { isEmpty, isEqual } from 'lodash';
import Home from './pages/Home';
import { useScreenSize, useScrollTopEffect } from '../utils/hooks';
import EditorPage from './pages/EditorPage';
import EditorPageReadOnly from './pages/EditorPageReadOnly';
import Blogs from './pages/Blogs';
import MyArticles from './pages/MyArticles';
import SingleBlog from './pages/SingleBlog';
import About from './pages/About';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import { selectors as userSelectors } from '../store/userStore';
import { selectors as globalSelectors } from '../store/globalStore';
import Loader from './containers/Loader';

import CatchAllRoute from './pages/CatchAllRoute';
import UserPage from './pages/UserPage';
import RegisterPage from './pages/RegisterPage';
import ChooseType from './pages/ChooseType';
import Navbar from './navigation/Navbar';
import Footer from './navigation/Footer';
import ArticleSettings from './pages/ArticleSettings';

function App(): Node {
  useScrollTopEffect();
  const isLoading = useSelector((state) => globalSelectors.checkIsLoading(state), isEqual);

  const user = useSelector((state) => userSelectors.getUser(state), isEqual);
  const admin = useSelector((state) => userSelectors.getAdmin(state), isEqual);

  const isUser: boolean = !isEmpty(user);
  const isAdmin: boolean = !isEmpty(admin);

  const { isMobile } = useScreenSize();

  const isAuthorized = isUser || isAdmin;

  // console.log('App > isAuthorized', isAuthorized);

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (document.body) {
  //       document.body.classList.remove('preload');
  //     }
  //   }, 500);
  // }, []);

  if (isLoading) {
    return (<Loader />);
  }

  return (
    <div className="App">
      <ToastContainer
        closeOnClick
        newestOnTop={false}
        pauseOnHover
        position={isMobile ? 'top-left' : 'bottom-left'}
        rtl={false}
      />
      <div className="application-wrapper">
        <Navbar
          user={isUser ? user : admin}
          isAuthorized={isUser}
          isAdmin={isAdmin}
        />
        <Routes>
          {!isAuthorized && <Route path="/login" element={<LoginPage />} /> }
          {!isAuthorized && <Route path="/admin-login" element={<LoginPage forAdmin />} /> }
          {!isAuthorized && <Route path="/register" element={<RegisterPage />} /> }
          <Route index element={<Home />} />
          <Route path="/singleblog" element={<SingleBlog />} />
          <Route path="/singleblog/:id" element={<SingleBlog />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:cat" element={<Blogs />} />
          <Route path="/blogs/:cat/:tag" element={<Blogs />} />
          <Route path="/users/:userId" element={<Blogs />} />
          <Route path="/about" element={<About />} />
          <Route path="/my-work/choose-type" element={<ChooseType />} />

          {isAuthorized && (
            <>

              <Route path="/my-work/" element={<MyArticles />} />
              <Route path="/my-work/:id" element={<EditorPage />} />
              <Route path="/my-work/:id/review" element={<EditorPageReadOnly />} />
              <Route path="/my-work/:id/settings" element={<ArticleSettings />} />

              <Route path="/user/:id" element={<UserPage />} />
              {/* <Route path="/submit-work" element={<MyArticles />} /> */}
              {/* <Route path="/submit-work/:id" element={<EditorPage />} /> */}
            </>
          )}
          {isAdmin && (
            <Route path="/dashboard" element={<Dashboard />} />
          )}
          <Route path="*" element={<CatchAllRoute isUser={isUser} isAdmin={isAdmin} />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default App;
