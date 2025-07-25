<template>
  <div class="flex gap-4 items-start ai-msg max-w-11/12 md:max-w-10/12">
    <!-- AI Avatar -->
    <div class="p-2 rounded-full border border-solid border-neutral-200">
      <LisaIcon class="w-5 h-5 text-lisa-primary animate-pulse" />
    </div>

    <!-- Loading Content -->
    <div class="flex flex-col gap-3 max-w-3xl bg-white text-sm rounded-3xl text-stone-950 px-4 py-3">
      <div class="flex items-center gap-2">
        <div class="flex gap-1">
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
        <span class="text-gray-500 text-xs">{{ message || 'LiSA is thinking...' }}</span>
      </div>
      
      <!-- Function Call Indicator -->
      <div v-if="showFunctionCall" class="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
        🔧 Calling function: {{ functionName }}
      </div>
    </div>
  </div>
</template>

<script setup>
import LisaIcon from '@/components/icons/LiSAIcon.vue'

defineProps({
  message: {
    type: String,
    default: 'LiSA is thinking...'
  },
  showFunctionCall: {
    type: Boolean,
    default: false
  },
  functionName: {
    type: String,
    default: ''
  }
})
</script>
