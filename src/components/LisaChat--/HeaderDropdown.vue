<template>
  <div class="relative">
    <button
      class="flex relative gap-2 items-center p-2 h-8 bg-white rounded-lg cursor-pointer hover:bg-stone-50"
      @click="$emit('toggle')"
    >
      <span class="text-sm font-bold tracking-normal text-stone-500">
        LiSA 2.o
      </span>
      <DropdownIcon />
    </button>

    <div
      v-if="isOpen"
      class="absolute left-2 top-full z-20 px-0 py-2"
    >
    <GptModelSelector />
    </div>
  </div>
</template>

<script setup lang="ts">
import DropdownIcon from "./ChatIcons/DropdownIcon.vue";
import InfoIcon from "./ChatIcons/InfoIcon.vue";
import GptModelSelector from "./Header/GptModelSelector.vue";

defineProps<{
  isOpen: boolean;
}>();

defineEmits<{
  (e: "toggle"): void;
}>();

const options = ["Settings", "Help Center", "Logout"];
</script>
