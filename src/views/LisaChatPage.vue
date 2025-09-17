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
      <ConversationList ref="conversationList" @loadChatHistory="handleChatHistoryLoad" />
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
          @new-chat="handleNewChat"
        />
      <div class="flex flex-col flex-1 max-w-[767px] mx-auto w-full overflow-hidden justify-center">
        <MessageList ref="messageList" />
        <MessageInput @message-sent="handleMessage" />
      </div>
    </div>

    <!-- Enhanced Toast Notifications -->
    <ToastNotification ref="toastInstance" />

    <!-- Session History Modal -->
    <transition name="fade">
      <div v-if="showSessionHistory" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4">
          <!-- Backdrop -->
          <div class="fixed inset-0 bg-black/50" @click="closeSessionHistory"></div>
          
          <!-- Modal -->
          <div class="relative bg-white w-full max-w-4xl rounded-xl shadow-xl max-h-[90vh] overflow-hidden">
            <!-- Header -->
            <div class="p-6 border-b border-gray-200 flex justify-between items-center bg-[#4318FF]">
              <h3 class="text-xl font-semibold text-white">Chat History</h3>
              <button @click="closeSessionHistory" class="text-white hover:text-gray-200">
                X
              </button>
            </div>
            
            <!-- Content -->
            <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div v-if="sessionMessages.loading" class="text-center py-4">
                Loading chat history...
              </div>
              <div v-else-if="sessionMessages.error" class="text-red-500 text-center py-4">
                {{ sessionMessages.error }}
              </div>
              <div v-else class="space-y-4">
                <div v-for="message in sessionMessages.data" 
                     :key="message.id" 
                     class="p-4 rounded-lg" 
                     :class="message.role === 'user' ? 'bg-gray-100' : 'bg-blue-50'">
                  <div class="flex items-start gap-3">
                    <div class="flex-shrink-0">
                      <div v-if="message.role === 'user'" 
                           class="w-8 h-8 rounded-full bg-[#4318FF] flex items-center justify-center">
                        <MaterialIcon name="person" size="text-base" color="text-white" />
                      </div>
                      <div v-else class="w-8 h-8">
                        <!-- LiSA Icon -->
                        <LiSAIcon />
                      </div>
                    </div>
                    <div class="flex-1">
                      <div class="font-medium mb-1">
                        {{ message.role === 'user' ? 'You' : 'LiSA' }}
                      </div>
                      <div>{{ message.content }}</div>
                      <div class="text-xs text-gray-500 mt-2">
                        {{ new Date(message.timestamp).toLocaleString() }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import SidebarHeader from "@/components/LisaChat/sidebar/SidebarHeader.vue";
import ConversationList from "@/components/LisaChat/sidebar/ConversationList.vue";
import UserProfile from "@/components/LisaChat/sidebar/UserProfile.vue";
import ChatHeader from "@/components/LisaChat/chat/ChatHeader.vue";
import MessageList from "@/components/LisaChat/chat/MessageList.vue";
import MessageInput from "@/components/LisaChat/chat/MessageInput.vue";
import ToastNotification from "@/components/shared/ToastNotification.vue";
import { useToast } from "@/composables/useToast";
import api from "@/services";
import sessionManager from "@/services/sessionManager";

interface MessageData {
  type: 'text' | 'files';
  content: string;
  files?: File[];
  response?: any;
}

const isSidebarOpen = ref(window.innerWidth >= 768);
const messageList = ref<InstanceType<typeof MessageList> | null>(null);
const conversationList = ref<InstanceType<typeof ConversationList> | null>(null);
const toastInstance = ref<InstanceType<typeof ToastNotification> | null>(null);
const showWelcome = ref(true);
const showSessionHistory = ref(false);
const selectedSessionId = ref('');
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  created_at?: string;
}

interface SessionMessagesState {
  loading: boolean;
  error: string;
  data: ChatMessage[];
}

const sessionMessages = ref<SessionMessagesState>({
  loading: false,
  error: '',
  data: []
});
const router = useRouter();
const route = useRoute();
const { setToastInstance, showSuccess, showError } = useToast();

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const initializeSession = async () => {
  const sessionId = route.params.sessionId as string;
  
  // Clear any existing messages first
  if (messageList.value?.clearMessages) {
    messageList.value.clearMessages();
  }
  
  // If no session ID, we're starting a new chat - do nothing until first message
  if (!sessionId) {
    return;
  }
  
  try {
    // Check if this is a valid session ID format (not a new session)
    // Valid formats: meqngoar_6wfhjo2jn, session_1234567890, etc.
    const isExistingSession = sessionId && !sessionId.includes('_history');
    
    if (isExistingSession) {
      // Set the session ID without activating
      await sessionManager.setSessionId(sessionId);
      selectedSessionId.value = sessionId;

      try {
        // Fetch chat history
        const { data } = await api.getChatHistory(sessionId);
        
        // Load messages in order if we have any
        if (data && Array.isArray(data) && data.length > 0) {
          const sortedHistory = [...data].sort((a, b) => {
            const timeA = new Date(a.timestamp || a.created_at).getTime();
            const timeB = new Date(b.timestamp || b.created_at).getTime();
            return timeA - timeB;
          });

          // Add each message to the chat
          for (const msg of sortedHistory) {
            if (messageList.value?.handleNewMessage) {
              await messageList.value.handleNewMessage({
                type: 'text',
                content: msg.content,
                response: msg.role === 'assistant' ? msg.content : undefined,
                sender: msg.role,
                sessionId: sessionId,
                isHistory: true,
                timestamp: msg.timestamp || msg.created_at
              });
            }
          }
          showSuccess('Chat history loaded successfully');
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
        showError('Error', 'Failed to load chat history');
      }
    } else {
      // Invalid or new session ID format, clear it
      await router.replace({ name: 'chat' });
    }
  } catch (error) {
    console.error('Failed to initialize session:', error);
    showError('Error', 'Failed to initialize chat session');
    await router.replace({ name: 'chat' });
  }
}

const handleNewChat = async () => {
  try {
    // Clear current session and messages
    sessionManager.clearSession();
    if (messageList.value?.clearMessages) {
      messageList.value.clearMessages();
    }
    
    // Create a new session immediately
    const newSession = await sessionManager.createNewSession();
    
    // Navigate to chat with the new session ID
    await router.push({ 
      name: 'chat', 
      params: { sessionId: newSession.id },
      replace: true
    });
    
  } catch (error) {
    console.error('Error creating new chat:', error);
    showError('Failed to create new chat session');
  }
};

// Watch for route changes to handle direct session URL access
watch(
  () => route.params.sessionId,
  async (newSessionId) => {
    if (newSessionId) {
      try {
        await initializeSession();
      } catch (error) {
        console.error('Error initializing session:', error);
        showError('Error', 'Failed to load chat session');
      }
    }
  }
);

// Initialize toast system and session
onMounted(() => {
  if (toastInstance.value) {
    setToastInstance(toastInstance.value);
  }
  initializeSession();
});

const handleMessage = async (messageData: MessageData) => {
  try {
    let sessionId = route.params.sessionId as string;
    
    // If no session exists, create one
    if (!sessionId) {
      try {
        const newSession = await sessionManager.createNewSession();
        sessionId = newSession.id;
        
        // Update the route with the new session ID
        await router.push({ 
          name: 'chat', 
          params: { sessionId: sessionId },
          replace: true
        });
      } catch (error) {
        console.error('Failed to create new session:', error);
        throw new Error('Failed to create new chat session. Please try again.');
      }
    }
    
    const messageWithSession = {
      ...messageData,
      sessionId,
      isNewSession: !route.params.sessionId // Mark as new session if we just created it
    };
    
    // Pass the message to MessageList component
    if (messageList.value?.handleNewMessage) {
      await messageList.value.handleNewMessage(messageWithSession);
      
      if (messageData.type === 'files') {
        showSuccess('Files uploaded and processed successfully');
      }
      
      // Refresh the conversation list to show the new message
      if (conversationList.value?.fetchChatHistory) {
        await conversationList.value.fetchChatHistory();
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

const loadChatHistory = async (sessionId: string, history: any[]) => {
  console.log('Loading chat history for session:', sessionId);
  
  try {
    // Set loading state
    if (messageList.value?.handleNewMessage) {
      await messageList.value.handleNewMessage({
        type: 'loading',
        content: 'Loading chat history...',
        isLoading: true
      });
    }
    
    // Set the session ID first
    await sessionManager.setSessionId(sessionId);
    
    // Reset message list
    if (messageList.value?.clearMessages) {
      messageList.value.clearMessages();
    }

    // Sort messages by timestamp to ensure correct order
    const sortedHistory = [...history].sort((a, b) => {
      const timeA = new Date(a.timestamp || a.created_at).getTime();
      const timeB = new Date(b.timestamp || b.created_at).getTime();
      return timeA - timeB;
    });

    // Load messages into the chat
    for (const msg of sortedHistory) {
      if (messageList.value?.handleNewMessage) {
        await messageList.value.handleNewMessage({
          type: 'text',
          content: msg.content,
          response: msg.role === 'assistant' ? msg.content : undefined,
          sender: msg.role === 'assistant' ? 'ai' : 'user',
          sessionId: sessionId,
          isHistory: true,
          timestamp: msg.timestamp || msg.created_at
        });
      }
    }

    // Navigate to the chat with the session ID
    await router.push({ 
      name: 'chat', 
      params: { sessionId: sessionId },
      replace: true
    });

    showSuccess('Chat history loaded successfully');
  } catch (error) {
    console.error('Error loading chat history:', error);
    showError('Error', 'Failed to load chat history');
  } finally {
    // Remove loading message if it exists
    const messages = messageList.value?.messages?.() || [];
    const loadingIndex = messages.findIndex((msg: any) => msg.type === 'loading');
    if (loadingIndex !== -1) {
      messages.splice(loadingIndex, 1);
    }
  }
};

const handleChatHistoryLoad = async (sessionId: string, history: any[]) => {
  console.log('Handling chat history load:', { sessionId, historyLength: history.length });
  
  try {
    // Set the session ID first
    await sessionManager.setSessionId(sessionId);
    
    // Reset message list
    if (messageList.value?.clearMessages) {
      messageList.value.clearMessages();
    }

    // Sort messages by timestamp to ensure correct order
    const sortedHistory = [...history].sort((a, b) => {
      const timeA = new Date(a.timestamp || a.created_at).getTime();
      const timeB = new Date(b.timestamp || b.created_at).getTime();
      return timeA - timeB;
    });

    // Load messages into the chat
    for (const msg of sortedHistory) {
      if (messageList.value?.handleNewMessage) {
        await messageList.value.handleNewMessage({
          type: 'text',
          content: msg.content,
          response: msg.role === 'assistant' ? msg.content : undefined,
          sender: msg.role === 'assistant' ? 'assistant' : 'user',
          sessionId: sessionId,
          isHistory: true,
          timestamp: msg.timestamp || msg.created_at
        });
      }
    }

    // Update the URL to reflect the current session
    await router.push({ 
      name: 'chat', 
      params: { sessionId: sessionId },
      replace: true
    });

    showSuccess('Chat history loaded successfully');
  } catch (error) {
    console.error('Error loading chat history:', error);
    showError('Error', 'Failed to load chat history');
  }
};

const fetchSessionHistory = async (sessionId: string) => {
  sessionMessages.value.loading = true;
  sessionMessages.value.error = '';
  
  try {
    if (!sessionId) {
      throw new Error('No session ID provided');
    }

    console.log('Fetching history for session:', sessionId);
    const { data } = await api.getChatHistory(sessionId);
    
    // Transform messages
    sessionMessages.value.data = data.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp || msg.created_at)
    }));

    console.log('Processed messages:', sessionMessages.value.data);
  } catch (error: any) {
    console.error('Error fetching session history:', error);
    sessionMessages.value.error = error.message || 'Failed to load chat history';
    showError('Chat History Error', error.message || 'Failed to load chat history');
  } finally {
    sessionMessages.value.loading = false;
  }
};

const closeSessionHistory = () => {
  showSessionHistory.value = false;
  selectedSessionId.value = '';
  sessionMessages.value.data = [];
};
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
