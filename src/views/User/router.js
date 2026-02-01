const userRoutes = [
  {
    name: 'user',
    path: '/',
    meta: { auth: true, role: ['user'] },
    component: () => import('./Page.vue'),
  },
  {
    name: 'media-create',
    path: '/user/upload',
    meta: { auth: true, role: ['user'] },
    component: () => import('./Create.vue'),
  },
];

export default userRoutes;
