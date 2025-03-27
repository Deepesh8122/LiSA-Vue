<template>
  <button
    class="flex gap-2 items-center p-2 w-full rounded-lg bg-stone-50 hover:bg-stone-200"
  >
    <div
      v-if="hasBorder"
      class="flex flex-col gap-2 justify-center items-center w-7 h-7 rounded-2xl border border-neutral-200"
    >
      <component :is="icon" v-if="icon" class="w-full h-full p-[3px]" />
    </div>
    <img
      v-else-if="hasImage"
      :src="imageUrl"
      alt=""
      class="w-6 h-6 rounded-full"
    />
    <component :is="icon" v-else class="w-6 h-6" />
    <span class="overflow-hidden flex-1 text-left text-sm pl-2 text-stone-950">
      {{ text }}
    </span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  text: string;
  icon?: any;
  hasBorder?: boolean;
  hasImage?: boolean;
  imageUrl?: string;
}>();
</script>