// @flow
import React from 'react';
import type { Node } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
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

function App(): Node {
  // const [token, setToken] = useState();

  useScrollTopEffect();

  const setToken = (userToken) => {
    sessionStorage.setItem('token', JSON.stringify(userToken));

    window.location.href = '/';
  };

  function getToken() {
    const tokenString = sessionStorage.getItem('token');
    if (tokenString) {
      const userToken = JSON.parse(tokenString);

      return userToken?.token;
    }
  }

  const token = getToken();

  if (!token) {
    return <LoginPage setToken={setToken} />;
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
        <Routes>
          <Route index element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/submit-work" element={<MyArticles />} />
          <Route path="/submit-work/:id" element={<EditorPage />} />
          <Route path="/publish/:id" element={<EditorPageReadOnly />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/singleblog" element={<SingleBlog />} />
          <Route path="/singleblog/:id" element={<SingleBlog />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
