import { onMounted, onUnmounted, type Ref } from 'vue'

export function useClickOutside(
  elementRef: Ref<HTMLElement | null>,
  callback: () => void
) {
  const handleClickOutside = (event: MouseEvent) => {
    if (elementRef.value && !elementRef.value.contains(event.target as Node)) {
      callback()
    }
  }

  onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside)
  })

  onUnmounted(() => {
    document.removeEventListener('mousedown', handleClickOutside)
  })
}

export interface SocialButtonProps {
  variant?: 'primary' | 'outline'
  fullWidth?: boolean
  icon?: string
}