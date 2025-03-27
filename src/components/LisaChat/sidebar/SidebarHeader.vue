<template>
  <div class="flex gap-4 px-4 pt-3 pb-4 flex-row items-start justify-between">
    <div class="flex items-center w-[120px]">
      <img src="@/assets/LiSA_logo.png" alt="logo" class="w-full h-full" />
    </div>
    <button
      class="p-2 mt-[5px] rounded-lg transition-colors h-8 w-8 flex items-center justify-center cursor-pointer bg-neutral-200 hover:bg-neutral-300"
      aria-label="Hide sidebar"
      @click="$emit('toggle-sidebar')"
       v-tooltip="'Enter your new'" type="text" placeholder="Right"
    >
      <MaterialIcon 
        name="side_navigation" 
        size="base" 
        color="text-stone-600"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import MaterialIcon from '@/components/Icons/MaterialIcon.vue';
import Tooltip from 'primevue/tooltip';

defineEmits(['toggle-sidebar'])
</script>