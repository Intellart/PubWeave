// @flow
import React from 'react';
import type { Node } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home';
import { useScrollTopEffect } from '../utils/hooks';
import EditorPage from './pages/EditorPage2';
import Blogs from './pages/Blogs';
import MyArticles from './pages/MyArticles';

function App(): Node {
  useScrollTopEffect();

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
          <Route index element={<Home />} />
          <Route path="/submit-work" element={<MyArticles />} />
          <Route path="/submit-work/:id" element={<EditorPage />} />
          <Route path="/blogs" element={<Blogs />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
