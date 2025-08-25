<template>
  <div class="flex items-center space-x-2 text-[#4318FF]">
    <div class="animate-spin rounded-full h-4 w-4 border-2 border-b-[#4318FF] border-r-[#4318FF] border-t-transparent border-l-transparent"></div>
    <span class="text-xs animate-pulse">{{ message || 'Loading...' }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LoadingIndicator',
  props: {
    message: {
      type: String,
      required: false
    }
  }
})
</script>
