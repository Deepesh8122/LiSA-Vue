<template>
  <div class="flex w-full max-w-screen h-screen max-h-screen bg-white overflow-hidden main-page relative">
    <!-- Sidebar with transitions -->
    <div
      class="flex flex-col h-screen bg-white border-r border-solid border-r-stone-300 transition-transform duration-300 ease-in-out fixed z-20 "
      :class="[
        'w-[300px]',
        isSidebarOpen ? 'translate-x-0 md:relative' : 'md:absolute -translate-x-full',
      ]"
    >
      <SidebarHeader @toggle-sidebar="toggleSidebar"/>
      <ConversationList />
      <UserProfile />
    </div>

    

    <!-- Overlay for mobile -->
    <div 
      v-if="isSidebarOpen" 
      class="fixed inset-0 bg-black opacity-50 z-10 md:hidden"
      @click="toggleSidebar"
    ></div>

    <!-- Main Chat Area -->
    <div 
      class="flex flex-col flex-1 relative transition-all duration-300 ease-in-out"
      :class="[
        'md:ml-0',
        isSidebarOpen ? 'ml-[300px]' : 'ml-0',
        'max-sm:w-full max-sm:ml-0' // Reset margin on mobile
      ]"
    >
      <ChatHeader 
          :is-sidebar-open="isSidebarOpen" 
          @toggle-sidebar="toggleSidebar" 
        />
      <div class="flex flex-col flex-1 max-w-[767px] mx-auto w-full overflow-hidden">
        <MessageList />
        <MessageInput />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SidebarHeader from "@/components/LisaChat/sidebar/SidebarHeader.vue";
import SearchBar from "@/components/LisaChat/sidebar/SearchBar.vue";
import ConversationList from "@/components/LisaChat/sidebar/ConversationList.vue";
import UserProfile from "@/components/LisaChat/sidebar/UserProfile.vue";
import ChatHeader from "@/components/LisaChat/chat/ChatHeader.vue";
import MessageList from "@/components/LisaChat/chat/MessageList.vue";
import MessageInput from "@/components/LisaChat/chat/MessageInput.vue";

const isSidebarOpen = ref(window.innerWidth >= 768);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Close sidebar on route change (optional)
// onBeforeRouteLeave(() => {
//   isSidebarOpen.value = false;
// });
</script>

<style scoped>
.main-page {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Add will-change to optimize animation performance */
.transition-all {
  will-change: margin-left, transform;
}
</style>