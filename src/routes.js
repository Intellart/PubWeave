const routes = {
  home: '/dashboard',
  myWork: {
    root: '/my-work',
    chooseType: '/my-work/choose-type',
    project: (type, id) => `/my-work/${id}`,
    review: (type, id) => `/my-work/${id}/review`,
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
