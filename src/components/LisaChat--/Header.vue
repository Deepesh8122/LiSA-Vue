<template>
  <header
    class="flex relative justify-between items-center px-4 py-2 bg-white border border-neutral-200"
  >
    <HeaderDropdown
      :is-open="isDropdownOpen"
      @toggle="$emit('toggleDropdown')"
    />
    <UserAvatar  />
  </header>
</template>

<script setup lang="ts">
import HeaderDropdown from "./HeaderDropdown.vue";
import UserAvatar from "./UserAvatar.vue";

defineProps<{
  isDropdownOpen: boolean;
}>();

defineEmits<{
  (e: "toggleDropdown"): void;
  (e: "toggleSidebar"): void;
}>();
</script>
