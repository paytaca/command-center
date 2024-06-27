const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('pages/IndexPage.vue') },
      { path: '/analytics', name: 'Analytics', component: () => import('pages/AnalyticsPage.vue') }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    name: 'Error404',
    component: () => import('pages/ErrorNotFound.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('pages/LoginPage.vue')
  }
]

export default routes
