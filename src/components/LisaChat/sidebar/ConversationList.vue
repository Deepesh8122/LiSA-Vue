<template>
  <div class="flex flex-col overflow-y-hidden h-full">
    <SearchBar class="sticky top-0 z-10 mb-3" @search="filterConversations" />

    <div class="flex-1 px-4 pb-3 overflow-y-auto h-full">
      <TimeSection
        v-for="(section, index) in filteredSections"
        :key="index"
        :title="section.title"
        :conversations="section.conversations"
        @select="handleSessionSelect"
        @hover="handleHover"
      />

      <div v-if="loading" class="text-gray-500 mt-4">Loading chat history...</div>
      <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>
    </div>

    <ChatHistoryModal
      :visible="showModal"
      :messages="hoveredMessages"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import SearchBar from './SearchBar.vue'
import TimeSection from './TimeSection.vue'
import ChatHistoryModal from './ChatHistoryModal.vue'
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

const emit = defineEmits(['showSessionHistory'])

const sessionId = sessionManager.getSessionId()
console.log('Current Session ID:', sessionId)

const apiURL = `http://109.228.57.128:8080/chat/history/${sessionId}`

const rawMessages = ref<any[]>([])
const sections = ref<Section[]>([])
const loading = ref(true)
const error = ref('')
const searchTerm = ref('')

// Modal state
const showModal = ref(false)
const hoveredMessages = ref<any[]>([])

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

    sessions.forEach((session) => {
      const date = new Date(session.created_at);
      const diffDays = Math.floor((+now - +date) / (1000 * 60 * 60 * 24));

      const conversation: Conversation = {
        id: session.session_id,
        title: `Chat Session ${session.session_id.substr(-6)}`,
        icon: '💬',
        isDropDown: true,
        timestamp: date,
        messageCount: session.message_count,
        lastMessage: new Date(session.last_activity).toLocaleString()
      };

      if (diffDays === 0) grouped['Today'].push(conversation);
      else if (diffDays <= 7) grouped['Previous 7 Days'].push(conversation);
      else grouped['Previous 30 Days'].push(conversation);
    });

    // Sort each group by timestamp
    Object.keys(grouped).forEach(group => {
      grouped[group].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    })

    // Update sections
    sections.value = ['Today', 'Previous 7 Days', 'Previous 30 Days']
      .map(title => ({
        title,
        conversations: grouped[title] || []
      }))
      .filter(section => section.conversations.length > 0)

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

// Handle hover event on conversation
const handleHover = (msgContent: string) => {
  hoveredMessages.value = rawMessages.value.filter(m => m.content === msgContent)
  showModal.value = true
}

// Close the chat history modal
const closeModal = () => {
  showModal.value = false
  hoveredMessages.value = []
}

// Add handleSessionSelect function
const handleSessionSelect = (sessionId: string) => {
  console.log('Session selected:', sessionId);
  emit('showSessionHistory', sessionId);
};

onMounted(fetchChatHistory)

</script>
