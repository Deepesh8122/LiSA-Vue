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
        <div v-if="message.type === 'text'" class="prose max-w-none" v-html="message.content"></div>

        <!-- File Message -->
        <div v-else-if="message.type === 'files'" class="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
          <FileIcon class="w-5 h-5 text-lisa-primary" />
          <div class="flex-1">
            <div class="text-sm font-medium">{{ message.content }}</div>
            <div v-if="message.fileSize" class="text-xs text-stone-500">{{ formatFileSize(message.fileSize) }}</div>
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

interface Message {
  id: number;
  sender: 'user' | 'ai';
  type: 'text' | 'image' | 'code' | 'file' | 'files';
  content: string;
  timestamp: Date;
  alt?: string;
  fileName?: string;
  fileSize?: number;
  files?: File[];
  response?: any;
}

const chatContainer = ref<HTMLElement | null>(null)
const messages = ref<Message[]>([])
let messageCounter = 0

// Handle new messages from MessageInput
const handleNewMessage = async (messageData: any) => {
  // Add user message
  messages.value.push({
    id: ++messageCounter,
    sender: 'user',
    type: messageData.type,
    content: messageData.content,
    timestamp: new Date(),
    files: messageData.files
  })

  // If it's a file upload, add system confirmation
  if (messageData.type === 'files') {
    messages.value.push({
      id: ++messageCounter,
      sender: 'ai',
      type: 'text',
      content: `Files processed successfully: ${messageData.content}`,
      timestamp: new Date()
    })
  }

  // If it's a text message, add AI response
  if (messageData.type === 'text' && messageData.response) {
    messages.value.push({
      id: ++messageCounter,
      sender: 'ai',
      type: 'text',
      content: messageData.response.answer || messageData.response,
      timestamp: new Date()
    })
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