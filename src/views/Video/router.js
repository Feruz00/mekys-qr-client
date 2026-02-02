const videoRoutes = [
  {
    name: 'video',
    path: '/video/:id',
    component: () => import('./Page.vue'),
  },
];

export default videoRoutes;
