<template>
  <div class="loading-indicator">
    <div class="loader-container">
      <div class="loader">
        <div class="dot dot1"></div>
        <div class="dot dot2"></div>
        <div class="dot dot3"></div>
      </div>
      <span class="loading-text">{{ message }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  message?: string
}>()

defineOptions({
  name: 'LoadingIndicator'
})
</script>

<style scoped>
.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.loader {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.dot {
  width: 0.5rem;
  height: 0.5rem;
  background-color: #4318FF;
  border-radius: 9999px;
  animation: bounce 0.5s infinite;
}

.dot2 {
  animation-delay: 0.1s;
}

.dot3 {
  animation-delay: 0.2s;
}

.loading-text {
  font-size: 0.875rem;
  color: #4B5563;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}
</style>
