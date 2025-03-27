<template>
  <header class="w-full bg-white border-b border-gray-200">
    <div class="max-w-[1200px] mx-auto px-6 py-4 flex justify-between items-center">
      <!-- Back Button and Title -->
      <div class="flex items-center gap-4">
        <button 
          @click="goBack"
          class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Go back"
        >
          <MaterialIcon 
            name="arrow_back" 
            size="base"
            color="text-stone-600"
          />
        </button>
        <h1 class="text-xl font-semibold text-gray-900">Personal Account</h1>
      </div>
      
      <!-- Menu Button -->
      <div class="relative" ref="menuRef">
        <button 
          @click="toggleMenu"
          class="p-0 bg-[#4318FF] text-white h-10 w-10 border border-gray-200 rounded-full text-sm"
          aria-label="Menu"
        >
          <MaterialIcon 
          label="User"
            name="person"
          />
        </button>

        <!-- Dropdown Menu -->
        <div 
          v-if="isMenuOpen"
          class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
        >
          <button 
            @click="getLogout"
            class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <MaterialIcon name="logout" size="sm" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import MaterialIcon from '@/components/Icons/MaterialIcon.vue'

const router = useRouter()
const menuRef = ref<HTMLElement | null>(null)
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const goBack = () => {
  router.back()
}

const getLogout = () => {
  router.push({ name: 'login' })
  isMenuOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    isMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>