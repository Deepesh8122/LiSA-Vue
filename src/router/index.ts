import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'
import LisaChatPage from '@/views/LisaChatPage.vue'
import UserProfilePage from '@/views/UserProfilePage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/chat/new'  // Changed to redirect to new chat
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/chat',
      redirect: '/chat/new'  // Added redirect
    },
    {
      path: '/chat/new',
      name: 'new-chat',
      component: LisaChatPage
    },
    {
      path: '/chat/:sessionId',
      name: 'chat-session',
      component: LisaChatPage
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
