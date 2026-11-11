import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import DetailView from '../views/DetailView.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/detail/:date',
    name: 'detail',
    component: DetailView
  }
];

const router = createRouter({
  history: createWebHistory(), 
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

export default router;
