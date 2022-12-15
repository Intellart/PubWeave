// @flow
import React from 'react';
import type { Node } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home';
import { useScrollTopEffect } from '../utils/hooks';
import EditorPage from './pages/EditorPage';
import Blogs from './pages/Blogs';

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
          <Route path="/about" element={<EditorPage />} />
          <Route path="/blogs" element={<Blogs />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
