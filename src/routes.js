const routes = {
  home: '/dashboard',
  myWork: {
    root: '/my-work',
    chooseType: '/my-work/choose-type',
    project: (type, id) => `/my-work/${id}`,
    review: (type, id) => `/my-work/${id}/review`,
    preview: (type, id) => `/my-work/${id}/preview`,
  },
  blogs: {
    root: '/blogs',
    blog: (id) => `/blog/${id}`,
  },
  user: () => '/user/',
  login: '/login',
  adminLogin: '/admin-login',
  projects: {
    root: (type) => `/projects/${type}`,
    project: (type, id) => `/projects/${type}/${id}`,
  },
  about: '/about',
};

export default routes;
