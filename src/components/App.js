// @flow
import React from 'react';
import type { Node } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home';
import { useScrollTopEffect } from '../utils/hooks';
import About from './pages/About';

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
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
