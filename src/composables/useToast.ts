import { ref } from 'vue'
import type { Toast } from '@/components/shared/ToastNotification.vue'

// Global toast state
const toastInstance = ref<any>(null)

export function useToast() {
  const setToastInstance = (instance: any) => {
    toastInstance.value = instance
  }

  const showToast = (toast: Omit<Toast, 'id'>) => {
    if (toastInstance.value) {
      toastInstance.value.addToast(toast)
    } else {
      console.warn('Toast instance not initialized')
    }
  }

  const showSuccess = (title: string, message?: string) => {
    showToast({ type: 'success', title, message })
  }

  const showError = (title: string, message?: string) => {
    showToast({ type: 'error', title, message })
  }

  const showWarning = (title: string, message?: string) => {
    showToast({ type: 'warning', title, message })
  }

  const showInfo = (title: string, message?: string) => {
    showToast({ type: 'info', title, message })
  }

  return {
    setToastInstance,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}
