<template>
  <div class="pt-6 pb-6 max-md:px-6 max-md:py-6">
    <div
      class="relative rounded-xl flex items-end gap-4 border border-solid bg-stone-50 border-stone-300 p-4 w-full max-md:w-full"
    >
      <!-- File Upload -->
      <div class="file-upload">
        <input
          ref="fileInput"
          type="file"
          accept=".pdf"
          @change="handleFileUpload"
          class="hidden"
        />
        <button
          @click="$refs.fileInput.click()"
          :disabled="documentsStore.isLoading"
          aria-label="Upload PDF"
          class="group p-1.5 cursor-pointer flex items-center justify-center rounded-full h-8 w-8 bg-neutral-200 hover:bg-[#4318FF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MaterialIcon 
            name="attach_file" 
            size="text-xs" 
            color="text-stone-400 group-hover:text-white" 
          />
        </button>
      </div>

      <!-- Message Input -->
      <div class="chat-box w-full">
        <input
          v-model="messageText"
          type="text"
          class="w-full py-2 h-full bg-transparent outline-none"
          placeholder="Type your message..."
          @keypress.enter="sendMessage"
          :disabled="chatStore.isLoading"
        />
      </div>

      <!-- Controls -->
      <div class="send-area flex gap-3 items-center">
        <button
          aria-label="Voice input"
          class="group p-1.5 cursor-pointer flex items-center justify-center rounded-full h-8 w-8 bg-neutral-200 hover:bg-[#4318FF] transition-colors"
        >
          <MaterialIcon 
            name="mic" 
            size="text-xs" 
            color="text-stone-400 group-hover:text-white" 
          />
        </button>

        <button
          @click="sendMessage"
          :disabled="!messageText.trim() || chatStore.isLoading"
          class="group p-1.5 cursor-pointer flex items-center justify-center rounded-full h-8 w-8 bg-neutral-200 hover:bg-[#4318FF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <MaterialIcon 
            name="send" 
            size="text-xs" 
            color="text-stone-400 group-hover:text-white" 
          />
        </button>
      </div>
    </div>

    <!-- Upload Progress -->
    <div v-if="documentsStore.isLoading" class="mt-2 text-sm text-gray-600">
      Uploading document...
    </div>

    <!-- Error Message -->
    <div v-if="documentsStore.error" class="mt-2 text-sm text-red-600">
      {{ documentsStore.error }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAppStore } from '@/stores/useAppStore.js'
import MaterialIcon from '@/components/icons/MaterialIcon.vue'

const { documentsStore, chatStore } = useAppStore()

const messageText = ref('')
const fileInput = ref(null)

const sendMessage = async () => {
  if (!messageText.value.trim() || chatStore.isLoading) return
  
  const message = messageText.value
  messageText.value = ''
  
  await chatStore.sendMessage(message)
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.includes('pdf')) {
    documentsStore.error = 'Please select a PDF file'
    return
  }

  try {
    await documentsStore.uploadDocument(file)
    // Clear the file input
    event.target.value = ''
  } catch (error) {
    console.error('Upload failed:', error)
  }
}
</script>
