<template>
  <div 
    ref="chatContainer"
    class="flex overflow-y-auto flex-col-reverse flex-1 gap-8 px-6 py-4"
  >
    <div 
    v-for="(message, index) in reversedMessages" 
      :key="message.id"
      :class="{ 'ml-auto user-msg max-w-11/12 md:max-w-9/12': message.sender === 'user', 'ai-msg max-w-11/12 md:max-w-10/12': message.sender !== 'user' }"
      class="flex gap-4 items-start"
    >
      <!-- AI Avatar -->
      <div 
        v-if="message.sender === 'ai'"
        class="p-2 rounded-full border border-solid border-neutral-200 ai-msg"
      >
        <LisaIcon class="w-5 h-5 text-lisa-primary" />
      </div>

      <!-- Message Content -->
      <div 
        class="flex flex-col gap-3 max-w-3xl"
        :class="[
          message.sender === 'user' 
            ? 'bg-stone-100 ml-auto px-4 py-2' 
            : 'bg-white',
          'text-sm rounded-3xl text-stone-950'
        ]"
      >
        <!-- Text Content -->
        <div v-if="message.type === 'text'" v-html="message.content"></div>

        <!-- Image Content -->
        <div 
          v-else-if="message.type === 'image'" 
          class="rounded-lg overflow-hidden"
        >
          <img 
            :src="message.content" 
            :alt="message.alt || ''" 
            class="w-full max-w-xl h-auto rounded-lg"
            @click="openImagePreview(message.content)"
          >
        </div>

        <!-- Code Content -->
        <div 
          v-else-if="message.type === 'code'"
          class="relative"
        >
        <button 
          @click="copyCode(message.content)"
          class="p-1 text-xs text-stone-400 hover:text-stone-600 hover:bg-amber-300 h-7 w-7 rounded-2xl cursor-pointer absolute right-2 top-2 z-10"
        >
        <MaterialIcon 
          name="content_copy" 
          size="text-xs" 
          color="text-stone-400" 
        />
        </button>
          <pre class="bg-zinc-900 text-white p-4 rounded-lg overflow-x-auto">
            <code>{{ message.content }}</code>
          </pre>
        </div>

        <!-- File Content -->
        <div 
          v-else-if="message.type === 'file'"
          class="flex items-center gap-3 p-3 bg-stone-100 rounded-lg"
        >
          <div class="p-2 bg-[#4318FF] rounded-lg">
            <FileIcon class="w-4 h-4 text-white" />
          </div>
          <div class="flex-1">
            <div class="text-sm font-medium">{{ message.fileName }}</div>
            <div class="text-xs text-stone-500">{{ formatFileSize(message.fileSize) }}</div>
          </div>
          <button 
            @click="downloadFile(message.content)"
            class="p-2 hover:bg-stone-200 rounded-full cursor-pointer"
          >
            <DownloadIcon class="w-4 h-4 text-lisa-primary" />
          </button>
        </div>

        <!-- Function Call Badge -->
        <div v-if="message.functionCalls && message.functionCalls.length > 0" class="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded mt-2">
          🔧 Used functions: {{ message.functionCalls.map(f => f.name).join(', ') }}
        </div>

        <!-- Sources Badge -->
        <div v-if="message.sources && message.sources.length > 0" class="text-xs text-green-600 bg-green-50 px-2 py-1 rounded mt-2">
          📚 Sources: {{ message.sources.length }} document(s)
        </div>

        <!-- Error Badge -->
        <div v-if="message.isError" class="text-xs text-red-600 bg-red-50 px-2 py-1 rounded mt-2">
          ⚠️ Error occurred
        </div>

        <!-- <div class="text-xs text-stone-400 mt-1">
          {{ formatTimestamp(message.timestamp) }}
        </div> -->
      </div>
    </div>

    <!-- Loading Indicator -->
    <LoadingIndicator v-if="chatStore.isLoading" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAppStore } from '@/stores/useAppStore.js'
import MaterialIcon from '@/components/icons/MaterialIcon.vue'
import LisaIcon from '@/components/icons/LiSAIcon.vue'
import FileIcon from '@/components/icons/FileIcon.vue'
import DownloadIcon from '@/components/icons/DownloadIcon.vue'
import LoadingIndicator from './LoadingIndicator.vue'

const chatContainer = ref(null);
const { chatStore } = useAppStore()

// Use messages from the store
const messages = chatStore.messages

const formatTimestamp = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
};

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const copyCode = async (code) => {
  try {
    await navigator.clipboard.writeText(code);
    // You might want to add a toast notification here
  } catch (err) {
    console.error('Failed to copy code:', err);
  }
};

const openImagePreview = (src) => {
  // Implement image preview modal
  console.log('Opening preview for:', src);
};

const downloadFile = (url) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = url.split('/').pop() || 'download';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Scroll to bottom on new messages
watch(() => messages.value.length, () => {
  setTimeout(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  }, 100);
});

onMounted(() => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
});

const reversedMessages = computed(() => {
  return [...messages.value].reverse()
})
</script>

<style scoped>
.flex-col-reverse {
  display: flex;
  flex-direction: column-reverse;
}
</style>
