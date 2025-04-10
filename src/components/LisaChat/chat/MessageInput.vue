<template>
  <div class="border-t border-solid border-t-gray-200 bg-white p-4">
    <div class="flex items-end gap-3">
      <!-- File Input -->
      <input 
        type="file" 
        ref="fileInput" 
        @change="handleFileUpload" 
        accept=".pdf"
        multiple
        class="hidden"
      />
      
      <button 
        aria-label="Attach file" 
        class="group p-2 cursor-pointer flex items-center justify-center rounded-full h-10 w-10 bg-neutral-200 hover:bg-[#4318FF] transition-colors flex-shrink-0"
        @click="$refs.fileInput.click()"
      >
        <MaterialIcon 
          name="attach_file" 
          size="text-xs" 
          color="text-stone-400 group-hover:text-white" 
        />
      </button>

      <div class="flex-1 min-h-[40px] flex items-end">
        <textarea
          v-model="message"
          rows="1"
          placeholder="Type a message..."
          class="w-full resize-none rounded-lg border border-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-[#4318FF] min-h-[40px] max-h-[120px]"
          @keydown.enter.prevent="sendMessage"
        ></textarea>
      </div>

      <button
        class="group p-2 cursor-pointer flex items-center justify-center rounded-full h-10 w-10 bg-neutral-200 hover:bg-[#4318FF] transition-colors flex-shrink-0"
        aria-label="Send message"
        @click="sendMessage"
      >
        <MaterialIcon 
          name="send" 
          size="text-xs" 
          color="text-stone-400 group-hover:text-white" 
        />
      </button>
    </div>
    <!-- File Upload Preview -->
    <div v-if="selectedFiles.length > 0" class="mt-2 flex flex-wrap gap-2">
      <div v-for="(file, index) in selectedFiles" :key="index" class="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
        <span class="text-sm">{{ file.name }}</span>
        <button @click="removeFile(index)" class="text-red-500 hover:text-red-700">
          <MaterialIcon name="close" size="text-xs" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MaterialIcon from '@/components/icons/MaterialIcon.vue'
import api from '@/services/api'
import { v4 as uuidv4 } from 'uuid'

const emit = defineEmits(['message-sent'])
const message = ref('')
const selectedFiles = ref([])
const sessionId = ref(uuidv4()) // Generate a unique session ID for the conversation

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  selectedFiles.value.push(...files)
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

const sendMessage = async () => {
  try {
    // Handle file upload if files are selected
    if (selectedFiles.value.length > 0) {
      await api.processPdfs(selectedFiles.value)
      emit('message-sent', {
        type: 'files',
        content: selectedFiles.value.map(f => f.name).join(', '),
        files: selectedFiles.value
      })
      selectedFiles.value = [] // Clear selected files
    }

    // Handle text message if present
    if (message.value.trim()) {
      const response = await api.askQuestion(message.value, sessionId.value)
      emit('message-sent', {
        type: 'text',
        content: message.value,
        response: response.data
      })
      message.value = '' // Clear message input
    }
  } catch (error) {
    console.error('Error sending message:', error)
    // You might want to show an error toast here
  }
}
</script>