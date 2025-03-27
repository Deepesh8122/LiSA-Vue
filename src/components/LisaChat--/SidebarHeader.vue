<template>
  <header class="flex justify-between items-center px-0 py-2 w-full sticky top-0 z-10 bg-stone-50">
    <button
      class="flex gap-2 justify-center items-center p-0 w-9 h-9 rounded-lg bg-stone-50 hover:bg-stone-200 cursor-pointer"
      aria-label="Toggle sidebar"
      @click="$emit('click')"
    >
      <SidebarIcon class="w-[22px] h-[22px]" />
    </button>
    <button
      class="flex gap-2 justify-center items-center p-0 w-9 h-9 rounded-lg bg-stone-50 hover:bg-stone-200 cursor-pointer"
      aria-label="Edit"
    >
      <EditIcon class="w-[22px] h-[22px]"/>
    </button>
  </header>
</template>

<script setup lang="ts">
import EditIcon from "./ChatIcons/EditIcon.vue";
import SidebarIcon from "./ChatIcons/SidebarIcon.vue";
defineEmits<{
  (e: "click"): void;
}>();

</script>
