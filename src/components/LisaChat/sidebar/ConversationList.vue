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

const fetchChatHistory = async () => {
  try {
    const response = await axios.get(apiURL)
    const data = response.data
    rawMessages.value = data

    console.log('Chat History:', data)

    const grouped: { [key: string]: Conversation[] } = {
      'Today': [],
      'Previous 7 Days': [],
      'Previous 30 Days': []
    }

    const now = new Date()

    const getSmartIcon = (item: any): string => {
      if (item.role === 'user') return '🙋‍♂️'

      const content = (item.content || '').toLowerCase()

      if (content.includes('weather')) return '🌦️'
      if (content.includes('news')) return '📰'
      if (content.includes('calendar') || content.includes('meeting')) return '📅'
      if (content.includes('email')) return '✉️'
      if (content.includes('reminder')) return '⏰'
      if (content.includes('joke')) return '😂'
      if (content.includes('code') || content.includes('function')) return '💻'
      if (content.includes('travel') || content.includes('flight')) return '✈️'

      return '🤖'
    }

    data.forEach((item: any) => {
      const date = new Date(item.timestamp)
      const diffDays = Math.floor((+now - +date) / (1000 * 60 * 60 * 24))

      const conversation: Conversation = {
        id: +new Date(item.timestamp), // Use timestamp for sorting
        title: item.content || '(No Content)',
        icon: getSmartIcon(item),
        isDropDown: true
      }

      if (diffDays === 0) grouped['Today'].push(conversation)
      else if (diffDays <= 7) grouped['Previous 7 Days'].push(conversation)
      else grouped['Previous 30 Days'].push(conversation)
    })

    // Sort each group by descending timestamp
    Object.keys(grouped).forEach(group => {
      grouped[group].sort((a, b) => b.id - a.id)
    })

    const orderedTitles = ['Today', 'Previous 7 Days', 'Previous 30 Days']
    sections.value = orderedTitles
      .map(title => ({
        title,
        conversations: grouped[title] || []
      }))
      .filter(section => section.conversations.length > 0)

  } catch (err) {
    console.error(err)
    error.value = 'Session not found.'
  } finally {
    loading.value = false
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

onMounted(fetchChatHistory)
</script>
