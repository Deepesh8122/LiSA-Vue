<template>
  <div class="flex w-full max-w-screen h-screen max-h-screen bg-white overflow-hidden main-page relative">
    <!-- Sidebar with transitions -->
    <div
      class="flex flex-col h-screen bg-white border-r border-solid border-r-stone-300 transition-transform duration-300 ease-in-out fixed z-20"
      :class="[
        'w-[320px]',
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
        <MessageList ref="messageList" />
        <MessageInput @message-sent="handleMessage" />
      </div>
    </div>

    <!-- Toast Notifications -->
    <div class="fixed bottom-4 right-4 flex flex-col gap-2">
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        :class="{
          'bg-red-500': toast.type === 'error',
          'bg-green-500': toast.type === 'success'
        }"
        class="text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300"
      >
        {{ toast.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SidebarHeader from "@/components/LisaChat/sidebar/SidebarHeader.vue";
import ConversationList from "@/components/LisaChat/sidebar/ConversationList.vue";
import UserProfile from "@/components/LisaChat/sidebar/UserProfile.vue";
import ChatHeader from "@/components/LisaChat/chat/ChatHeader.vue";
import MessageList from "@/components/LisaChat/chat/MessageList.vue";
import MessageInput from "@/components/LisaChat/chat/MessageInput.vue";
import api from "@/services";

interface MessageData {
  type: 'text' | 'files';
  content: string;
  files?: File[];
  response?: any;
}

const isSidebarOpen = ref(window.innerWidth >= 768);
const messageList = ref<InstanceType<typeof MessageList> | null>(null);
const toasts = ref<Array<{ id: number; type: 'success' | 'error'; message: string }>>([]);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  const id = Date.now();
  toasts.value.push({ id, type, message });
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  }, 3000);
};

const handleMessage = async (messageData: MessageData) => {
  try {
    // Pass the message to MessageList component
    if (messageList.value?.handleNewMessage) {
      await messageList.value.handleNewMessage(messageData);
      
      if (messageData.type === 'files') {
        showToast('Files uploaded and processed successfully');
      }
    }
  } catch (err) {
    const error = err as Error;
    console.error('Error handling message:', error);
    showToast(error.message || 'An error occurred while processing your request', 'error');
  }
};

// Check API status on component mount
api.getStatus()
  .then(() => showToast('Connected to API successfully'))
  .catch((err: Error) => showToast('Unable to connect to API', 'error'));
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