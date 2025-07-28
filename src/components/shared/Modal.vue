<template>
  <teleport to="body">
    <transition name="modal" appear>
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click="handleBackdropClick"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
        
        <!-- Modal Container -->
        <div
          ref="modalContent"
          :class="[
            'relative bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden',
            'transform transition-all duration-300 ease-out'
          ]"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <div class="flex items-center gap-3">
              <div v-if="icon" class="flex-shrink-0">
                <MaterialIcon :name="icon" size="text-lg" :color="iconColor" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">{{ title }}</h2>
                <p v-if="subtitle" class="text-sm text-gray-600">{{ subtitle }}</p>
              </div>
            </div>
            <button
              @click="closeModal"
              class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MaterialIcon name="close" size="text-base" />
            </button>
          </div>
          
          <!-- Content -->
          <div class="p-4 overflow-y-auto" :style="{ maxHeight: contentMaxHeight }">
            <slot />
          </div>
          
          <!-- Footer -->
          <div v-if="$slots.footer" class="p-4 border-t border-gray-200 bg-gray-50">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import MaterialIcon from '@/components/icons/MaterialIcon.vue'

interface Props {
  isOpen: boolean
  title: string
  subtitle?: string
  icon?: string
  iconColor?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnBackdrop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'lg',
  iconColor: 'text-blue-600',
  closeOnBackdrop: true
})

const emit = defineEmits<{
  close: []
  open: []
}>()

const modalContent = ref<HTMLElement>()

const contentMaxHeight = ref('calc(90vh - 120px)')

const closeModal = () => {
  emit('close')
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    closeModal()
  }
}

// Handle escape key
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen) {
    closeModal()
  }
}

// Prevent body scroll when modal is open
const preventBodyScroll = () => {
  document.body.style.overflow = 'hidden'
}

const restoreBodyScroll = () => {
  document.body.style.overflow = ''
}

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      preventBodyScroll()
      emit('open')
    } else {
      restoreBodyScroll()
    }
  }
)

onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey)
  if (props.isOpen) {
    preventBodyScroll()
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey)
  restoreBodyScroll()
})
</script>

<style scoped>
.modal-enter-active {
  transition: all 0.3s ease-out;
}

.modal-leave-active {
  transition: all 0.3s ease-in;
}

.modal-enter-from {
  opacity: 0;
}

.modal-enter-from .relative {
  transform: scale(0.9) translateY(-50px);
}

.modal-leave-to {
  opacity: 0;
}

.modal-leave-to .relative {
  transform: scale(0.9) translateY(-50px);
}
</style>
