const routes = {
  home: "/dashboard",
  myWork: {
    root: "/my-work",
    chooseType: "/my-work/choose-type",
    project: (_type: string, id: string | number) => `/my-work/${id}`,
    review: (_type: string, id: string | number) => `/my-work/${id}/review`,
    preview: (_type: string, id: string | number) => `/my-work/${id}/preview`,
  },
  blogs: {
    root: "/blogs",
    blog: (id: string | number) => `/blog/${id}`,
  },
  user: () => "/user/",
  login: "/login",
  adminLogin: "/admin-login",
  projects: {
    root: (type: string) => `/projects/${type}`,
    project: (type: string, id: string | number) => `/projects/${type}/${id}`,
  },
  about: "/about",
};

export default routes;
