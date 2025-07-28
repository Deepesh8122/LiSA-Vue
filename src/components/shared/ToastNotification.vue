<template>
  <teleport to="body">
    <transition-group
      name="toast"
      tag="div"
      class="fixed top-4 right-4 z-50 space-y-2"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg max-w-sm',
          'transform transition-all duration-300 ease-in-out',
          toastClasses[toast.type]
        ]"
      >
        <!-- Icon -->
        <div class="flex-shrink-0">
          <MaterialIcon
            :name="toastIcons[toast.type]"
            size="text-base"
            :color="toastIconColors[toast.type]"
          />
        </div>
        
        <!-- Content -->
        <div class="flex-1 min-w-0">
          <p :class="['text-sm font-medium', toastTextColors[toast.type]]">
            {{ toast.title }}
          </p>
          <p v-if="toast.message" :class="['text-xs mt-1', toastTextColors[toast.type]]">
            {{ toast.message }}
          </p>
        </div>
        
        <!-- Close Button -->
        <button
          @click="removeToast(toast.id)"
          :class="['flex-shrink-0 p-1 rounded hover:bg-opacity-20', toastHoverColors[toast.type]]"
        >
          <MaterialIcon
            name="close"
            size="text-sm"
            :color="toastIconColors[toast.type]"
          />
        </button>
      </div>
    </transition-group>
  </teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MaterialIcon from '@/components/icons/MaterialIcon.vue'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

const toasts = ref<Toast[]>([])

const toastClasses = {
  success: 'bg-green-50 border border-green-200',
  error: 'bg-red-50 border border-red-200',
  warning: 'bg-yellow-50 border border-yellow-200',
  info: 'bg-blue-50 border border-blue-200'
}

const toastIcons = {
  success: 'check_circle',
  error: 'error',
  warning: 'warning',
  info: 'info'
}

const toastIconColors = {
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-yellow-600',
  info: 'text-blue-600'
}

const toastTextColors = {
  success: 'text-green-800',
  error: 'text-red-800',
  warning: 'text-yellow-800',
  info: 'text-blue-800'
}

const toastHoverColors = {
  success: 'hover:bg-green-200',
  error: 'hover:bg-red-200',
  warning: 'hover:bg-yellow-200',
  info: 'hover:bg-blue-200'
}

const addToast = (toast: Omit<Toast, 'id'>) => {
  const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
  const newToast: Toast = {
    id,
    duration: 4000,
    ...toast
  }
  
  toasts.value.push(newToast)
  
  // Auto remove after duration
  setTimeout(() => {
    removeToast(id)
  }, newToast.duration)
}

const removeToast = (id: string) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

// Expose methods
defineExpose({
  addToast,
  removeToast
})
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
