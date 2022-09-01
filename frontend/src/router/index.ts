import authenticateGuard from '@/core/routing/authenticate-guard'
import { provide } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home-view.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login-view.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/about-view.vue'),
  },
]

const router = createRouter({
  history: createWebHistory('/'),
  routes,
})

router.beforeEach(async (toRoute, fromRoute) => {
  try {
    const response = await authenticateGuard(toRoute, fromRoute)
    if (response.action === 'redirect') {
      return response.redirectTo
    }
  } catch (error) {
    return { name: 'login' }
  }
})

export default router
