import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'
import LisaChatPage from '@/views/LisaChatPage.vue'
import UserProfilePage from '@/views/UserProfilePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/chat'  // Redirect root to chat page
    },
    {
      path: '/chat',
      name: 'chat',
      component: LisaChatPage
    },
    {
      path: '/user-profile',
      name: 'UserProfile',
      component: UserProfilePage
    }
    // Login route commented out for now
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: LoginPage
    // }
  ]
})

export default router