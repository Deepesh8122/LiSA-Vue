<template>
  <div class="flex flex-col overflow-y-hidden h-full">
    <SearchBar class="sticky top-0 z-10 mb-3" @search="filterConversations" />

    <div class="flex-1 px-4 pb-3 overflow-y-auto h-full">
      <TimeSection
        v-for="(section, index) in filteredSections"
        :key="index"
        :title="section.title"
        :conversations="section.conversations"
        :current-session-id="currentSessionId"
        @select="handleSessionSelect"
        @deleted="handleSessionDeleted"
        @error="handleError"
      />

      <div v-if="loading" class="text-gray-500 mt-4">Loading chat history...</div>
      <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>
    </div>


  </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import SearchBar from './SearchBar.vue'
import TimeSection from './TimeSection.vue'
import sessionManager from '@/services/sessionManager'
import api from '@/services/api'

interface Conversation {
  id: string | number
  title: string
  icon: string
  isDropDown?: boolean
  timestamp: Date
  messageCount: number
  lastMessage: string
}

interface Section {
  title: string
  conversations: Conversation[]
}

interface SessionResponse {
  session_id: string;
  created_at: string;
  last_activity: string;
  message_count: number;
}

const emit = defineEmits<{
  (e: 'loadChatHistory', sessionId: string, history: any[]): void
  (e: 'error', message: string): void
}>();

const currentSessionId = ref(sessionManager.getSessionId())
console.log('Current Session ID:', currentSessionId.value)

const sections = ref<Section[]>([])

// Update active session whenever it changes
watch(currentSessionId, (newId) => {
  console.log('Session ID changed:', newId);
});
const loading = ref(true)
const error = ref('')

// Handle session deletion
const handleSessionDeleted = (sessionId: string) => {
  sections.value = sections.value.map(section => ({
    ...section,
    conversations: section.conversations.filter(conv => conv.id !== sessionId)
  })).filter(section => section.conversations.length > 0);
};

// Handle errors from child components
const handleError = (message: string) => {
  error.value = message;
  emit('error', message);
};
const searchTerm = ref('')

// Fetch chat history from the API
const fetchChatHistory = async () => {
  try {
    loading.value = true;
    const response = await api.getChatSessions();
    const sessions = response.data as SessionResponse[];
    console.log('All Sessions:', sessions);

    const grouped: { [key: string]: Conversation[] } = {
      'Today': [],
      'Previous 7 Days': [],
      'Previous 30 Days': []
    };

    const now = new Date();

    // First, sort sessions into groups without fetching messages
    sessions.forEach((session) => {
      const date = new Date(session.last_activity);
      const diffDays = Math.floor((+now - +date) / (1000 * 60 * 60 * 24));
      
      // Create conversation with temporary title
      const conversation: Conversation = {
        id: session.session_id,
        title: `Chat ${session.session_id.substr(-6)}`,
        icon: '💬',
        isDropDown: true,
        timestamp: date,
        messageCount: session.message_count,
        lastMessage: new Date(session.last_activity).toLocaleString()
      };

      // Add to appropriate group
      if (diffDays === 0) {
        grouped['Today'].push(conversation);
      } else if (diffDays <= 7) {
        grouped['Previous 7 Days'].push(conversation);
      } else {
        grouped['Previous 30 Days'].push(conversation);
      }
    });

    // Sort each group by timestamp
    Object.keys(grouped).forEach((group) => {
      grouped[group].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    });

    // Update sections immediately with basic info
    sections.value = ['Today', 'Previous 7 Days', 'Previous 30 Days']
      .map(title => ({
        title,
        conversations: grouped[title] || []
      }))
      .filter(section => section.conversations.length > 0);

    // Then update conversation titles one by one in the background
    let delay = 0;
    for (const section of sections.value) {
      for (const conversation of section.conversations) {
        // Add delay between requests to prevent overwhelming the server
        setTimeout(async () => {
          try {
            const historyResponse = await api.getChatHistory(conversation.id.toString());
            const firstUserMessage = historyResponse?.data?.find(msg => msg.role === 'user')?.content;
            if (firstUserMessage) {
              conversation.title = firstUserMessage.length > 30 
                ? `${firstUserMessage.substring(0, 30)}...` 
                : firstUserMessage;
            }
          } catch (error) {
            console.error(`Error fetching history for session ${conversation.id}:`, error);
            // Keep the default title on error
          }
        }, delay);
        delay += 200; // Add 200ms delay between each request
      }
    }

  } catch (err) {
    console.error('Error fetching sessions:', err)
    error.value = 'Failed to load chat sessions'
  } finally {
    loading.value = false
  }
}

// Filter conversations based on search term
const filterConversations = (query: string) => {
  searchTerm.value = query.toLowerCase()
}

// Computed property to get filtered sections
const filteredSections = computed(() => {
  if (!searchTerm.value) return sections.value

  return sections.value
    .map(section => ({
      ...section,
      conversations: section.conversations.filter(conv =>
        conv.title.toLowerCase().includes(searchTerm.value)
      )
    }))
    .filter(section => section.conversations.length > 0)
})

// Handle session selection
const handleSessionSelect = async (sessionId: string) => {
  try {
    // Don't show global loading, the TimeSection handles its own loading state
    const response = await api.getChatHistory(sessionId);
    if (response?.data) {
      // First set the session ID in the session manager
      await sessionManager.setSessionId(sessionId, response.data.length);
      
      // Then emit the chat history for loading in the main chat
      emit('loadChatHistory', sessionId, response.data);
      
      // Update current session ID
      currentSessionId.value = sessionId;
    }
  } catch (error) {
    console.error('Error loading chat history:', error);
  }
};

onMounted(fetchChatHistory)

</script>
