<template>
  <div class="px-4">
    <div
      class="flex gap-3 items-center px-4 py-3 rounded-xl bg-neutral-100"
      role="search"
    >
      <div class="text-neutral-600">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 17L13.5 13.5M15 9C15 12.3137 12.3137 15 9 15C5.68629 15 3 12.3137 3 9C3 5.68629 5.68629 3 9 3C12.3137 3 15 5.68629 15 9Z" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round">
          </path>
        </svg>
      </div>
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Search conversations..."
        class="bg-transparent text-sm text-lisa-dark outline-none w-full placeholder:text-neutral-600"
        @input="handleSearch"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const emit = defineEmits<{
  (e: 'search', query: string): void
}>()

const searchQuery = ref('')

const handleSearch = () => {
  emit('search', searchQuery.value)
}
</script>