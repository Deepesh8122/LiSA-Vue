<template>
  <div class="flex gap-4 px-4 pt-3 pb-4 flex-row items-center justify-between">
    <div class="flex items-center">
      <img
        src="@/assets/LiSA_logo.png"
        alt="logo"
        class="logo"
      />
    </div>
    <button
      class="p-2 mt-[5px] rounded-lg transition-colors h-8 w-8 flex items-center justify-center cursor-pointer bg-neutral-200 hover:bg-neutral-300"
      aria-label="Hide sidebar"
      @click="$emit('toggle-sidebar')"
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

defineEmits(['toggle-sidebar'])
</script>

<style scoped>
/* Add styles for proper alignment */
.logo {
  height: 32px;
  width: auto;
  object-fit: contain;
  display: block; /* Ensure the image is treated as a block element */
  margin: 0; /* Remove any default margin */
}
</style>