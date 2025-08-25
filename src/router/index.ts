import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'
import LisaChatPage from '@/views/LisaChatPage.vue'
import UserProfilePage from '@/views/UserProfilePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/chat/:sessionId?',
      name: 'chat',
      component: LisaChatPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/user-profile',
      name: 'UserProfile',
      component: UserProfilePage,
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/chat')
  } else {
    next()
  }
})

export default router
