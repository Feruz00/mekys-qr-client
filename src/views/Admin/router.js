const adminRouter = [
  {
    name: 'admin',
    path: '/admin',
    meta: { auth: true, role: ['admin'] },
    component: () => import('./Page.vue'),
  },
  {
    name: 'create-user',
    path: '/admin/create-user',
    meta: { auth: true, role: ['admin'] },
    component: () => import('./Create.vue'),
  },
  {
    name: 'edit-user',
    path: '/admin/edit-user/:id',
    meta: { auth: true, role: ['admin'] },
    component: () => import('./Update.vue'),
  },
];

export default adminRouter;
