<template>
  <div class="flex flex-col overflow-y-hidden h-full">
    <SearchBar class="sticky top-0 z-10 mb-3" @search="filterConversations" />

    <div class="flex-1 px-4 pb-3 overflow-y-auto h-full">
      <TimeSection
        v-for="(section, index) in filteredSections"
        :key="index"
        :title="section.title"
        :conversations="section.conversations"
        @hover="handleHover"
        @click="handleConversationClick"
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
import { useRouter } from 'vue-router'
import api from '@/services/api'
import SearchBar from './SearchBar.vue'
import TimeSection from './TimeSection.vue'
import ChatHistoryModal from './ChatHistoryModal.vue'
import sessionManager from '@/services/sessionManager'

interface Conversation {
  id: number
  title: string
  icon: string
  isDropDown?: boolean
}

interface Section {
  title: string
  conversations: Conversation[]
}

const router = useRouter()
const sessionId = sessionManager.getSessionId()
console.log('Current Session ID:', sessionId)

const rawMessages = ref<any[]>([])
const sections = ref<Section[]>([])
const loading = ref(true)
const error = ref('')
const searchTerm = ref('')

// Modal state
const showModal = ref(false)
const hoveredMessages = ref<any[]>([])

const fetchChatHistory = async () => {
  try {
    const response = await api.getChatSessions();
    const sessions = Array.isArray(response.data) ? response.data : [];

    // Transform sessions into conversations
    const grouped: { [key: string]: Conversation[] } = {
      'Today': [],
      'Previous 7 Days': [],
      'Previous 30 Days': []
    };

    sessions.forEach((session: any) => {
      const date = new Date(session.last_activity || session.created_at);
      const diffDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));

      const conversation: Conversation = {
        id: session.session_id,
        title: `Chat ${session.message_count} messages`,
        icon: '💬',
        isDropDown: true
      };

      if (diffDays === 0) grouped['Today'].push(conversation);
      else if (diffDays <= 7) grouped['Previous 7 Days'].push(conversation);
      else grouped['Previous 30 Days'].push(conversation);
    });

    // Sort conversations by last activity
    Object.values(grouped).forEach(group => {
      group.sort((a, b) => b.id.localeCompare(a.id));
    });

    const orderedTitles = ['Today', 'Previous 7 Days', 'Previous 30 Days']
    sections.value = orderedTitles
      .map(title => ({
        title,
        conversations: grouped[title] || []
      }))
      .filter(section => section.conversations.length > 0)

  } catch (error) {
    console.error('Failed to load chat sessions:', error);
    error.value = 'Failed to load chat history';
  } finally {
    loading.value = false;
  }
}

const filterConversations = (query: string) => {
  searchTerm.value = query.toLowerCase()
}

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

const handleHover = (msgContent: string) => {
  hoveredMessages.value = rawMessages.value.filter(m => m.content === msgContent)
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  hoveredMessages.value = []
}

const handleConversationClick = async (conversation: Conversation) => {
  try {
    // Load chat history
    const history = await api.getChatHistory(conversation.id);
    
    // Update messages in MessageList
    messageList.value?.setMessages(history.data);
    
    // Update URL
    router.push(`/chat/${conversation.id}`);
  } catch (error) {
    console.error('Failed to load chat history:', error);
  }
};

// Fetch chat sessions on mount
onMounted(async () => {
  try {
    const response = await api.getChatSessions();
    sections.value = transformSessions(response.data);
  } catch (error) {
    console.error('Failed to load chat sessions:', error);
  }
});
</script>
