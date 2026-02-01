const videoRoutes = [
  {
    name: 'video',
    path: '/video/:id',
    meta: { auth: true },
    component: () => import('./Page.vue'),
  },
];

export default videoRoutes;
