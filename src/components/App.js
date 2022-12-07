// @flow
import React from 'react';
import type { Node } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useScrollTopEffect } from '../utils/hooks';

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
          <Route index />
        </Routes>
      </div>
    </div>
  );
}

export default App;
