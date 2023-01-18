// @flow
import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import { isEmpty, isEqual } from 'lodash';
import Home from './pages/Home';
import { useScrollTopEffect } from '../utils/hooks';
import EditorPage from './pages/EditorPage';
import EditorPageReadOnly from './pages/EditorPageReadOnly';
import Blogs from './pages/Blogs';
import MyArticles from './pages/MyArticles';
import SingleBlog from './pages/SingleBlog';
import About from './pages/About';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import { selectors as userSelectors } from '../store/userStore';
import Loader from './containers/Loader';

import Navbar from './containers/Navbar';
import CatchAllRoute from './pages/CatchAllRoute';

function App(): Node {
  const [isLoaded, setIsLoaded] = useState(false);
  useScrollTopEffect();

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
  }, []);

  const isAuthorized: boolean = useSelector((state) => !isEmpty(userSelectors.getUser(state)), isEqual);
  const isAdmin: boolean = useSelector((state) => !isEmpty(userSelectors.getAdmin(state)), isEqual);

  if (!isLoaded) {
    return (<Loader />);
  }

  return (
    <div className="App">
      <ToastContainer
        closeOnClick
        newestOnTop={false}
        pauseOnHover
        position="bottom-left"
        rtl={false}
      />
      <div className="application-wrapper">
        <Navbar isAuthorized={isAuthorized} isAdmin={isAdmin} />
        <Routes>
          {!isAuthorized && <Route path="/login" element={<LoginPage />} /> }
          <Route index element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/singleblog" element={<SingleBlog />} />
          <Route path="/singleblog/:id" element={<SingleBlog />} />
          <Route path="/blogs" element={<Blogs />} />

          {isAuthorized && (
            <>
              <Route path="/about" element={<About />} />
              <Route path="/submit-work" element={<MyArticles />} />
              <Route path="/submit-work/:id" element={<EditorPage />} />
              <Route path="/publish/:id" element={<EditorPageReadOnly />} />
            </>
          )}
          <Route path="*" element={<CatchAllRoute isAuthorized={isAuthorized} isAdmin={isAdmin} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
