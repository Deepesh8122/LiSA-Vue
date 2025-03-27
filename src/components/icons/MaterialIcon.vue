<template>
    <span 
      class="material-symbols-outlined"
      :class="[size, color]"
    >
      {{ name }}
    </span>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    name: string;
    size?: 'text-sm' | 'text-base' | 'text-lg' | 'text-xl';
    color?: string;
  }>();
  </script>