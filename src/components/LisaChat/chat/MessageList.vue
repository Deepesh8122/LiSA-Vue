<template>
  <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
    <div v-for="message in messages" :key="message.id" class="flex items-start gap-3">
      <!-- User/AI Icon -->
      <div class="flex-shrink-0 w-8 h-8">
        <div v-if="message.sender === 'user'" class="w-8 h-8 rounded-full bg-[#4318FF] flex items-center justify-center">
          <MaterialIcon name="person" size="text-base" color="text-white" />
        </div>
        <div v-else class="w-8 h-8">
          <LiSAIcon />
        </div>
      </div>

      <!-- Message Content -->
      <div class="flex-1">
        <!-- Text Message -->
        <div v-if="message.type === 'text'">
          <MarkdownRenderer :content="message.content" />
        </div>

        <!-- File Message -->
        <div v-else-if="message.type === 'files'" class="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
          <FileIcon class="w-5 h-5 text-lisa-primary" />
          <div class="flex-1">
            <div class="text-sm font-medium">{{ message.content }}</div>
            <div v-if="message.fileSize" class="text-xs text-stone-500">{{ formatFileSize(message.fileSize) }}</div>
          </div>
        </div>

        <!-- Loading Message -->
        <div v-else-if="message.type === 'loading'" class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600">{{ message.content }}</span>
            <div class="flex gap-1">
              <div class="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
              <div class="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
              <div class="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-else-if="message.type === 'error'" class="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
          <MaterialIcon name="error" size="text-base" color="text-red-500" />
          <div class="flex-1">
            <div class="text-sm font-medium text-red-800">{{ message.content }}</div>
            <div v-if="message.error" class="text-xs text-red-600 mt-1">{{ message.error }}</div>
          </div>
        </div>

        <!-- Timestamp -->
        <div class="text-xs text-stone-400 mt-1">
          {{ formatTimestamp(message.timestamp) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineExpose } from 'vue'
import MaterialIcon from '@/components/icons/MaterialIcon.vue'
import LiSAIcon from '@/components/Icons/LiSAIcon.vue'
import FileIcon from '@/components/Icons/FileIcon.vue'
import DownloadIcon from '@/components/Icons/DownloadIcon.vue'
import MarkdownRenderer from '@/components/LisaChat/chat/MarkdownRenderer.vue'

interface Message {
  id: number;
  sender: 'user' | 'ai';
  type: 'text' | 'image' | 'code' | 'file' | 'files' | 'error' | 'loading';
  content: string;
  timestamp: Date;
  alt?: string;
  fileName?: string;
  fileSize?: number;
  files?: File[];
  response?: any;
  error?: string;
}

const chatContainer = ref<HTMLElement | null>(null)
const messages = ref<Message[]>([])
let messageCounter = 0

// Handle new messages from MessageInput
const handleNewMessage = async (messageData: any) => {
  // Handle error messages
  if (messageData.type === 'error') {
    // Remove any existing loading messages
    removeLoadingMessage()
    
    messages.value.push({
      id: ++messageCounter,
      sender: 'ai',
      type: 'error',
      content: messageData.content,
      timestamp: new Date(),
      error: messageData.error
    })
    return
  }

  // Handle text messages with loading state
  if (messageData.type === 'text') {
    // If this is the initial message (with loading), add user message and loading indicator
    if (messageData.isLoading && !messageData.timeoutWarning) {
      // Add user message
      messages.value.push({
        id: ++messageCounter,
        sender: 'user',
        type: messageData.type,
        content: messageData.content,
        timestamp: new Date()
      })
      
      // Add loading message
      addLoadingMessage()
      return
    }
    
    // If this is a timeout warning, update the loading message
    if (messageData.isLoading && messageData.timeoutWarning) {
      updateLoadingMessage('This is taking longer than usual...')
      return
    }
    
    // If this is the response (not loading), remove loading and add AI response
    if (!messageData.isLoading && messageData.response) {
      // Remove loading message
      removeLoadingMessage()
      
      // Add AI response
      messages.value.push({
        id: ++messageCounter,
        sender: 'ai',
        type: 'text',
        content: messageData.response,
        timestamp: new Date()
      })
      return
    }
  }

  // Handle file uploads (existing logic)
  if (messageData.type === 'files') {
    // Add user message
    messages.value.push({
      id: ++messageCounter,
      sender: 'user',
      type: messageData.type,
      content: messageData.content,
      timestamp: new Date(),
      files: messageData.files
    })

    // Add system confirmation
    messages.value.push({
      id: ++messageCounter,
      sender: 'ai',
      type: 'text',
      content: `Files uploaded successfully to new API endpoint: ${messageData.content}`,
      timestamp: new Date()
    })
  }
}

// Add loading message
const addLoadingMessage = () => {
  messages.value.push({
    id: ++messageCounter,
    sender: 'ai',
    type: 'loading',
    content: 'LiSA is typing...',
    timestamp: new Date()
  })
}

// Remove loading message
const removeLoadingMessage = () => {
  const loadingIndex = messages.value.findIndex(msg => msg.type === 'loading')
  if (loadingIndex !== -1) {
    messages.value.splice(loadingIndex, 1)
  }
}

// Update loading message content
const updateLoadingMessage = (newContent: string) => {
  const loadingIndex = messages.value.findIndex(msg => msg.type === 'loading')
  if (loadingIndex !== -1) {
    messages.value[loadingIndex].content = newContent
  }
}

// Expose the handleNewMessage method
defineExpose({
  handleNewMessage
});

// Existing helper functions
const formatTimestamp = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date)
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// Scroll to bottom on new messages
watch(() => messages.value.length, () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
})
</script>

<style scoped>
.flex-col-reverse {
  display: flex;
  flex-direction: column-reverse;
}
</style>
