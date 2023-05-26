const routes = {
  home: '/dashboard',
  myWork: {
    root: '/my-work',
    choose: (type) => `/my-work/${type}`,
    project: (type, id) => `/my-work/${type}/${id}`,
    review: (type, id) => `/my-work/${type}/${id}/review`,
  },
  user: (id) => `/user/${id}`,
  login: '/login',
  adminLogin: '/admin-login',
  projects: {
    root: (type) => `/projects/${type}`,
    project: (type, id) => `/projects/${type}/${id}`,
  },
  about: '/about',
};

export default routes;
