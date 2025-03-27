<template>
  <button
    class="flex gap-3 items-center justify-center px-6 py-4 w-full text-base text-center rounded-xl transition-colors"
    :class="[
      variant === 'primary'
        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
        : 'bg-white text-gray-800 border border-black border-solid hover:bg-gray-50',
    ]"
  >
    <img v-if="icon" :src="icon" class="object-contain w-5 h-5" alt="" />
    <span><slot /></span>
  </button>
</template>

<script setup lang="ts">
import type { SocialButtonProps } from "./types";

withDefaults(defineProps<SocialButtonProps>(), {
  variant: "outline",
  fullWidth: true,
});
</script>
