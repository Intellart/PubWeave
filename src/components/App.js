// @flow
import React from 'react';
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

function App(): Node {
  // const [token, setToken] = useState();

  useScrollTopEffect();

  const isAuthorized: boolean = useSelector((state) => !isEmpty(userSelectors.getUser(state)), isEqual);

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
        <Routes>
          {!isAuthorized && <Route path="/login" element={<LoginPage />} /> }
          <Route index element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/submit-work" element={<MyArticles />} />
          <Route path="/submit-work/:id" element={<EditorPage />} />
          <Route path="/publish/:id" element={<EditorPageReadOnly />} />
          <Route path="/singleblog" element={<SingleBlog />} />
          <Route path="/singleblog/:id" element={<SingleBlog />} />

          {isAuthorized && (
            <>
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/about" element={<About />} />
            </>
          )}
        </Routes>
      </div>
    </div>
  );
}

export default App;
