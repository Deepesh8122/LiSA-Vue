<template>
  <div
    ref="chatContainer"
    class="overflow-y-auto py-4 space-y-6 flex flex-col"
    :class="{
      'pointer-events-none flex-0 pb-[40px]': messages.length === 0,
      'flex mt-auto': messages.length > 0
    }"
    :aria-disabled="messages.length === 0"
  >
    <transition name="fade">
      <div v-if="messages.length === 0" class="flex items-center justify-center h-full text-lg text-[30px] font-noramal color-[#4318FF]">
        <div class="mr-4 w-[32px] h-[32px] lisa-responsed">
          <LiSAIcon />
        </div>
        Where should we begin?
      </div>
    </transition>
    <div v-for="message in messages" :key="message.id" class="flex items-start gap-4">
      <!-- User/AI Icon -->
      <div class="flex-shrink-0 w-8 h-8">
        <div v-if="message.sender === 'user'" 
             class="w-8 h-8 rounded-full bg-[#4318FF] flex items-center justify-center"
        >
          <MaterialIcon name="person" size="text-base" color="text-white" />
        </div>
        <div v-else class="w-8 h-8">
          <div class="mr-4 w-[28px] h-[28px] lisa-responsed">
            <LiSAIcon />
          </div>
        </div>
      </div>

      <!-- Message Content -->
      <div class="flex-1">
        <!-- Text Message -->
        <div v-if="message.type === 'text'">
          <!-- Display regular markdown content with sources -->
          <MarkdownRenderer 
            :content="message.content"
            :sources="message.sources"
          />

          <!-- <pre>
            {{ message }}
          </pre> -->

          <!-- Display structured translation results if available -->
          <div v-if="isHidden && message.translations && message.translations.length > 0" class="space-y-4 mb-4">
            <TranslationResult 
              v-for="(translation, index) in message.translations" 
              :key="`translation-${message.id}-${index}`"
              :translation="translation"
              :expanded="false"
            />
          </div>

          <!-- Display structured summary results if available -->
          <div v-if="isHidden && message.summaries && message.summaries.length > 0" class="space-y-4 mb-4">
            <DocumentSummary 
              v-for="(summary, index) in message.summaries" 
              :key="`summary-${message.id}-${index}`"
              :summary="summary"
              :expanded="false"
            />
          </div>

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
        <div v-else-if="message.type === 'loading'" class="bg-white/50 backdrop-blur-sm rounded-lg shadow-sm">
          <LoadingIndicator :message="message.content" />
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
import LiSAIcon from '@/components/icons/LiSAIcon.vue'
import FileIcon from '@/components/icons/FileIcon.vue'
import DownloadIcon from '@/components/icons/DownloadIcon.vue'
import MarkdownRenderer from '@/components/LisaChat/chat/MarkdownRenderer.vue'
import TranslationResult from '@/components/LisaChat/chat/TranslationResult.vue'
import DocumentSummary from '@/components/LisaChat/chat/DocumentSummary.vue'
import SourceReferences from '@/components/LisaChat/chat/SourceReferences.vue'
import LoadingIndicator from '@/components/LisaChat/chat/LoadingIndicator.vue'
import type { Message } from '@/components/types'

const chatContainer = ref<HTMLElement | null>(null)
const messages = ref<Message[]>([])
let messageCounter = 0;

let isHidden = false;

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
    // If this message is from history, add it directly
    if (messageData.isHistory) {
      const message: Message = {
        id: ++messageCounter,
        sender: messageData.response ? 'ai' : 'user',
        type: 'text',
        content: messageData.response || messageData.content,
        timestamp: messageData.timestamp ? new Date(messageData.timestamp) : new Date(),
        parsedResponse: messageData.parsedResponse,
        sessionId: messageData.sessionId,
        sources: messageData.sources,
        functionCalls: messageData.functionCalls,
        translations: messageData.translations,
        summaries: messageData.summaries,
        isStructuredResponse: messageData.isStructuredResponse
      }
      messages.value.push(message)
      return
    }

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
      
      // Create enhanced message with structured data
      const enhancedMessage: Message = {
        id: ++messageCounter,
        sender: 'ai',
        type: 'text',
        content: messageData.response,
        timestamp: new Date(),
        parsedResponse: messageData.parsedResponse,
        sessionId: messageData.sessionId,
        sources: messageData.sources,
        functionCalls: messageData.functionCalls,
        translations: messageData.translations,
        summaries: messageData.summaries,
        isStructuredResponse: messageData.isStructuredResponse
      }
      
      messages.value.push(enhancedMessage)
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

const serverURL = import.meta.env.VITE_API_BASE_URL;

// Check if file extension is image
const isImage = (src: string): boolean => {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(src);
};

// Loading state management
const isLoading = ref(false)

// Add loading message
const addLoadingMessage = () => {
  isLoading.value = true
  messages.value.push({
    id: ++messageCounter,
    sender: 'ai',
    type: 'loading',
    content: 'LiSA is thinking...',
    timestamp: new Date()
  })
}

// Remove loading message
const removeLoadingMessage = () => {
  isLoading.value = false
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

// Clear all messages
const clearMessages = () => {
  messages.value = [];
  messageCounter = 0;
};

// Get current messages
const getMessages = () => {
  return messages.value;
};

// Expose the methods
defineExpose({
  handleNewMessage,
  clearMessages,
  messages: getMessages
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
watch(
  () => messages.value.length,
  (newLen, oldLen) => {
    if (chatContainer.value) {
      // Always scroll to bottom on new message
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  }
)

// Also scroll to bottom when the last message is from AI
watch(
  () => messages.value[messages.value.length - 1]?.sender,
  (sender) => {
    if (sender === 'ai' && chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  }
)
</script>

<style scoped>
.flex-col-reverse {
  display: flex;
  flex-direction: column-reverse;
}
/* Optionally, you can add a cursor style for disabled state */
.pointer-events-none[aria-disabled="true"] {
  cursor: not-allowed;
}
/* Fade animation for "Ready when you are." */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}
</style>
