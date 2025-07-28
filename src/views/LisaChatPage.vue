<template>
  <div class="flex w-full max-w-screen h-screen max-h-screen bg-white overflow-hidden main-page relative">
    <!-- Welcome Pop-up -->
    <transition name="fade">
      <div
        v-if="showWelcome"
        class="fixed inset-0 flex items-center justify-center bg-stone-300/50 z-50"
      >
        <div class="bg-white rounded-xl shadow-xl p-8 flex flex-col items-center max-w-sm w-full">
          <div class="mb-4">
            <svg viewBox="0 0 40 40" width="48" height="48">
              <defs>
                <linearGradient id="welcome-gradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#4318FF"/>
                  <stop offset="100%" stop-color="#FF3D77"/>
                </linearGradient>
              </defs>
              <circle cx="20" cy="20" r="18" fill="url(#welcome-gradient)" />
              <text x="50%" y="55%" text-anchor="middle" fill="#fff" font-size="18" font-family="Arial" dy=".3em">👋</text>
            </svg>
          </div>
          <h3 class="text-3xl font-bold mb-2 text-[#4318FF]">Hello Hitesh!</h3>
          <h2 class="text-[20px] font-bold mb-2 text-[#4318FF]">Welcome Back</h2>
          <p class="text-gray-600 mb-6 text-center">Ask anything about your property management, lease, maintenance, or tenants. LiSA is here to help!</p>
          <button
            class="bg-gradient-to-r from-[#4318FF] to-[#FF3D77] text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-[#4318FF]/80 hover:to-[#FF3D77]/80 transition"
            @click="showWelcome = false"
          >
            Get Started
          </button>
        </div>
      </div>
    </transition>

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
      <div class="flex flex-col flex-1 max-w-[767px] mx-auto w-full overflow-hidden justify-center">
        <MessageList ref="messageList" />
        <MessageInput @message-sent="handleMessage" />
      </div>
    </div>

    <!-- Enhanced Toast Notifications -->
    <ToastNotification ref="toastInstance" />
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
import ToastNotification from "@/components/shared/ToastNotification.vue";
import { useToast } from "@/composables/useToast";
import { onMounted } from "vue";
import api from "@/services";

interface MessageData {
  type: 'text' | 'files';
  content: string;
  files?: File[];
  response?: any;
}

const isSidebarOpen = ref(window.innerWidth >= 768);
const messageList = ref<InstanceType<typeof MessageList> | null>(null);
const toastInstance = ref<InstanceType<typeof ToastNotification> | null>(null);
const showWelcome = ref(true);
const { setToastInstance, showSuccess, showError } = useToast();

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Initialize toast system
onMounted(() => {
  if (toastInstance.value) {
    setToastInstance(toastInstance.value);
  }
});

const handleMessage = async (messageData: MessageData) => {
  try {
    // Pass the message to MessageList component
    if (messageList.value?.handleNewMessage) {
      await messageList.value.handleNewMessage(messageData);
      
      if (messageData.type === 'files') {
        showSuccess('Files uploaded and processed successfully');
      }
    }
  } catch (err) {
    const error = err as Error;
    console.error('Error handling message:', error);
    showError('Processing Failed', error.message || 'An error occurred while processing your request');
  }
};

// Check API status on component mount
api.getStatus()
  .then(() => showSuccess('Connected to API successfully'))
  .catch((err: Error) => showError('Connection Failed', 'Unable to connect to API'));
</script>

<style scoped>
.main-page {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}

/* Add will-change to optimize animation performance */
.transition-all {
  will-change: margin-left, transform;
}
</style>
