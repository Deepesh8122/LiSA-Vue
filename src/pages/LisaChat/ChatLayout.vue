<template>
  <div class="flex w-full h-screen max-h-screen bg-white overflow-hidden">
    <Sidebar :is-open="isSidebarOpen" />
    <div class="flex flex-col flex-1 h-screen bg-white">
      <Header
        @toggle-sidebar="toggleSidebar"
        @toggle-dropdown="toggleDropdown"
        :is-dropdown-open="isDropdownOpen"
      />
      <MainContent />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Sidebar from "@/components/LisaChat--/Sidebar/SideBar.vue";
import Header from "@/components/LisaChat--/Header.vue";
import MainContent from "@/components/LisaChat--/MainContent.vue";

const isDropdownOpen = ref(false);
const isSidebarOpen = ref(true);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>
