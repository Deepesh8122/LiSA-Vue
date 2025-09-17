<template>
  <div class="border-t border-solid border-t-gray-200 bg-white py-6 px-0 gap-4 flex flex-col">
    
    <!-- File Upload Preview -->
    <div v-if="selectedFiles.length > 0" class=" flex flex-wrap gap-4">
      <div v-for="(file, index) in selectedFiles" :key="index" class="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
        <span class="text-sm">{{ file.name }}</span>
        <button @click="removeFile(index)" class="text-red-500 hover:text-red-700">
          <MaterialIcon name="close" size="text-xs" />
        </button>
      </div>
    </div>

    <!-- Inline Upload Progress -->
    <div v-if="isUploading" class=" space-y-2">
      <!-- Progress Bar -->
      <div class="w-full bg-gray-200 rounded-full h-1">
        <div 
          class="bg-[#4318FF] h-1 rounded-full transition-all duration-300" 
          :style="{ width: uploadProgress + '%' }"
        ></div>
      </div>
      
      <!-- Upload Status -->
      <div class="text-xs text-gray-600">
        {{ uploadProgressText }}
      </div>
      
      <!-- Individual File Status -->
      <div class="space-y-1">
        <div v-for="(file, index) in uploadingFiles" :key="index" class="text-xs flex items-center justify-between">
          <span class="truncate flex-1">{{ file.name }}</span>
          <span class="ml-2 text-xs">
            <span v-if="file.status === 'uploading'" class="text-blue-600">Uploading...</span>
            <span v-else-if="file.status === 'completed'" class="text-green-600">✓</span>
            <span v-else-if="file.status === 'error'" class="text-red-600">✗</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Upload Summary -->
    <div v-if="uploadSummary" class=" p-2 bg-blue-50 rounded-lg">
      <div class="flex items-center justify-between">
        <span class="text-xs text-blue-800">{{ uploadSummary }}</span>
        <button @click="uploadSummary = ''" class="text-blue-600 hover:text-blue-800">
          <MaterialIcon name="close" size="text-xs" />
        </button>
      </div>
    </div>

    <!-- Recording Status -->
    <div v-if="isRecording" class=" p-2 bg-red-50 rounded-lg border border-red-200">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <span class="text-xs text-red-800">Recording... {{ formatDuration(recordingDuration) }}</span>
        <span class="text-xs text-red-600 ml-auto">Click mic to stop</span>
      </div>
    </div>

    <!-- Processing Audio Status -->
    <div v-if="isProcessingAudio" class=" p-2 bg-blue-50 rounded-lg">
      <div class="flex items-center gap-2">
        <div class="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
        <span class="text-xs text-blue-800">Processing voice recording...</span>
      </div>
    </div>

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
        :class="[
          'group p-2 flex items-center justify-center rounded-full h-12 w-12 transition-colors flex-shrink-0',
          'bg-neutral-200 hover:bg-[#4318FF] cursor-pointer'
        ]"
        @click="$refs.fileInput.click()"
      >
        <div v-if="isUploading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-[#4318FF]"></div>
        <MaterialIcon v-else
          name="attach_file" 
          size="text-xs" 
          color="text-stone-400 group-hover:text-white" 
        />
      </button>

      <!-- Microphone Button -->
      <button 
        aria-label="Record voice message" 
        :class="[
          'group p-2 flex items-center justify-center rounded-full h-12 w-12 transition-colors flex-shrink-0',
          isRecording 
            ? 'bg-red-500 hover:bg-red-600 cursor-pointer animate-pulse' 
            : isProcessingAudio 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-neutral-200 hover:bg-[#4318FF] cursor-pointer'
        ]"
        :disabled="isProcessingAudio"
        @click="toggleRecording"
      >
        <div v-if="isProcessingAudio" class="animate-spin rounded-full h-4 w-4 border-b-2 border-[#4318FF]"></div>
        <MaterialIcon v-else
          name="mic" 
          size="text-xs" 
          :color="isRecording ? 'text-white' : 'text-stone-400 group-hover:text-white'" 
        />
      </button>

      <div class="flex-1 min-h-[40px] flex items-end relative">
        <textarea
          v-model="message"
          ref="messageInput"
          rows="1"
          placeholder="Type a message..."
          :disabled="isProcessing"
          :class="[
            'w-full resize-none rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-[#4318FF] min-h-[48px] max-h-[200px] overflow-y-auto',
            'transition-all duration-200 ease-in-out',
            'placeholder-gray-400 text-gray-800',
            isProcessing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
          ]"
          @input="autoGrow"
          @focus="onFocus"
          @blur="onBlur"
          @keydown.enter.exact.prevent="sendMessage"
          @keydown.enter.shift.exact.prevent="newLine"
          @keydown.esc="onEscape"
        ></textarea>
        <div class="absolute right-2 bottom-2 text-xs text-gray-400" v-if="showCharCount">
          {{ message.length }}/2000
        </div>
      </div>

      <button
        :disabled="(!message.trim() && selectedFiles.length === 0) || isProcessing"
        :class="[
          'group p-2 flex items-center justify-center rounded-full h-12 w-12 transition-colors flex-shrink-0',
          ((!message.trim() && selectedFiles.length === 0) || isProcessing)
            ? 'bg-gray-300 cursor-not-allowed' 
            : 'bg-neutral-200 hover:bg-[#4318FF] cursor-pointer'
        ]"
        aria-label="Send message"
        @click="sendMessage"
      >
        <div v-if="isProcessing" class="animate-spin rounded-full h-4 w-4 border-b-2 border-[#4318FF]"></div>
        <MaterialIcon 
          v-else
          name="send" 
          size="text-xs" 
          :class="[
          'text-stone-400',
          ((!message.trim() && selectedFiles.length === 0) || isProcessing)
            ? 'bg-gray-300 cursor-not-allowed' 
            : 'group-hover:text-white cursor-pointer'
        ]"
        />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import MaterialIcon from '@/components/icons/MaterialIcon.vue'
import api from '@/services/api'
import sessionManager from '@/services/sessionManager'
import { v4 as uuidv4 } from 'uuid'

const emit = defineEmits(['message-sent'])
const message = ref('')
const selectedFiles = ref([])
const messageInput = ref(null)
const showCharCount = ref(false)

// Auto-grow textarea function
const autoGrow = () => {
  if (!messageInput.value) return
  
  // Reset height to auto to accurately calculate new height
  messageInput.value.style.height = 'auto'
  
  // Calculate new height
  const newHeight = Math.min(messageInput.value.scrollHeight, 200)
  messageInput.value.style.height = `${newHeight}px`
  
  // Show char count when approaching limit
  showCharCount.value = message.value.length > 1000
}

// Handle new line with Shift+Enter
const newLine = (event) => {
  const cursorPosition = event.target.selectionStart
  message.value = message.value.slice(0, cursorPosition) + '\n' + message.value.slice(cursorPosition)
  
  // Wait for next tick to set cursor position
  nextTick(() => {
    event.target.selectionStart = event.target.selectionEnd = cursorPosition + 1
    autoGrow()
  })
}

// Focus handlers
const onFocus = () => {
  showCharCount.value = message.value.length > 1000
}

const onBlur = () => {
  showCharCount.value = false
}

// Escape key handler
const onEscape = () => {
  messageInput.value?.blur()
}
// Initialize or get existing session ID
const sessionId = ref(sessionManager.getSessionId() || uuidv4())

// Loading states
const isUploading = ref(false)
const isProcessing = ref(false) // New loading state for chat queries
const uploadProgress = ref(0)
const uploadingFiles = ref([])
const uploadSummary = ref('')
const completedFiles = ref(0)
const totalFiles = ref(0)
const timeoutWarning = ref(false) // For showing timeout warning
let timeoutWarningTimer = null

// Audio recording states
const isRecording = ref(false)
const isProcessingAudio = ref(false)
const recordingDuration = ref(0)
let mediaRecorder = null
let recordedChunks = []
let recordingTimer = null
let stream = null

const uploadProgressText = computed(() => {
  if (totalFiles.value === 0) return 'Preparing upload...'
  if (uploadProgress.value === 100) return `Upload complete!`
  return `Uploading ${totalFiles.value} file${totalFiles.value > 1 ? 's' : ''}...`
})

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  selectedFiles.value.push(...files)
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

// Helper function to format duration
const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Audio recording functions
const toggleRecording = async () => {
  if (isRecording.value) {
    stopRecording()
  } else {
    await startRecording()
  }
}

const startRecording = async () => {
  try {
    // Request microphone access
    stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        sampleRate: 16000,
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true
      }
    })
    
    // Create MediaRecorder with the best available format
    let options = { mimeType: 'audio/webm;codecs=opus' }
    
    // Try different formats in order of preference
    if (MediaRecorder.isTypeSupported('audio/wav')) {
      options = { mimeType: 'audio/wav' }
    } else if (MediaRecorder.isTypeSupported('audio/webm')) {
      options = { mimeType: 'audio/webm' }
    } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
      options = { mimeType: 'audio/mp4' }
    }
    
    mediaRecorder = new MediaRecorder(stream, options)
    
    recordedChunks = []
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data)
      }
    }
    
    mediaRecorder.onstop = async () => {
      await processRecording()
    }
    
    // Start recording
    mediaRecorder.start()
    isRecording.value = true
    recordingDuration.value = 0
    
    // Start timer
    recordingTimer = setInterval(() => {
      recordingDuration.value += 1
    }, 1000)
    
  } catch (error) {
    console.error('Error starting recording:', error)
    
    let errorMessage = 'Failed to start recording'
    if (error.name === 'NotAllowedError') {
      errorMessage = 'Microphone access denied. Please allow microphone access and try again.'
    } else if (error.name === 'NotFoundError') {
      errorMessage = 'No microphone found. Please check your audio devices.'
    } else if (error.name === 'NotSupportedError') {
      errorMessage = 'Audio recording is not supported in this browser.'
    }
    
    emit('message-sent', {
      type: 'error',
      content: errorMessage,
      error: error.message || 'Unknown recording error'
    })
  }
}

const stopRecording = () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop()
  }
  
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
    stream = null
  }
  
  if (recordingTimer) {
    clearInterval(recordingTimer)
    recordingTimer = null
  }
  
  isRecording.value = false
}

const processRecording = async () => {
  if (recordedChunks.length === 0) {
    emit('message-sent', {
      type: 'error',
      content: 'No audio recorded',
      error: 'Recording was too short or failed'
    })
    return
  }
  
  try {
    isProcessingAudio.value = true
    
    // Create audio blob from recorded chunks
    const audioBlob = new Blob(recordedChunks, { type: 'audio/webm' })
    
    // Convert to FLAC format
    const flacBlob = await convertToFlac(audioBlob)
    
    // Send to speech-to-text API
    const response = await api.speechToText(flacBlob)
    
    // Insert transcribed text into message input
    if (response.data && response.data.trim()) {
      message.value = response.data.trim()
    } else {
      emit('message-sent', {
        type: 'error',
        content: 'No speech detected in recording',
        error: 'Please try speaking more clearly'
      })
    }
    
  } catch (error) {
    console.error('Error processing recording:', error)
    
    emit('message-sent', {
      type: 'error',
      content: 'Failed to process voice recording',
      error: error.message || 'Unknown processing error'
    })
  } finally {
    isProcessingAudio.value = false
    recordedChunks = []
  }
}

const convertToFlac = async (webmBlob) => {
  return new Promise((resolve, reject) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const fileReader = new FileReader()
    
    fileReader.onload = async (e) => {
      try {
        const arrayBuffer = e.target.result
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
        
        // Convert to WAV format (simpler than FLAC)
        const wavBlob = audioBufferToWav(audioBuffer)
        resolve(wavBlob)
        
      } catch (error) {
        console.error('Audio conversion error:', error)
        // If conversion fails, try with original blob
        resolve(webmBlob)
      }
    }
    
    fileReader.onerror = () => {
      reject(new Error('Failed to read audio file'))
    }
    
    fileReader.readAsArrayBuffer(webmBlob)
  })
}

// Convert AudioBuffer to WAV format
const audioBufferToWav = (audioBuffer) => {
  const numberOfChannels = audioBuffer.numberOfChannels
  const sampleRate = audioBuffer.sampleRate
  const format = 1 // PCM
  const bitDepth = 16
  
  const length = audioBuffer.length
  const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2)
  const view = new DataView(arrayBuffer)
  
  // WAV header
  const writeString = (offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }
  
  writeString(0, 'RIFF')
  view.setUint32(4, 36 + length * numberOfChannels * 2, true)
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, format, true)
  view.setUint16(22, numberOfChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * numberOfChannels * bitDepth / 8, true)
  view.setUint16(32, numberOfChannels * bitDepth / 8, true)
  view.setUint16(34, bitDepth, true)
  writeString(36, 'data')
  view.setUint32(40, length * numberOfChannels * 2, true)
  
  // PCM data
  let offset = 44
  for (let i = 0; i < length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(channel)[i]))
      view.setInt16(offset, sample * 0x7FFF, true)
      offset += 2
    }
  }
  
  return new Blob([arrayBuffer], { type: 'audio/wav' })
}

// Check if this is a new chat session
const isNewChatSession = () => {
  return !sessionManager.getSessionId();
}

const sendMessage = async () => {
  try {
    // Handle file upload if files are selected
    if (selectedFiles.value.length > 0) {
      isUploading.value = true
      uploadProgress.value = 0
      totalFiles.value = selectedFiles.value.length
      uploadingFiles.value = selectedFiles.value.map(file => ({
        ...file,
        status: 'uploading',
        progress: 0
      }))
      
      try {
        // Upload all files in a single bulk request with progress tracking
        const result = await api.uploadDocumentsWithProgress(
          selectedFiles.value,
          (progress) => {
            uploadProgress.value = progress
          }
        )
        
        // Mark all files as completed
        uploadingFiles.value = uploadingFiles.value.map(file => ({
          ...file,
          status: 'completed'
        }))
        
        // Emit success message for the bulk upload
        emit('message-sent', {
          type: 'files',
          content: `${selectedFiles.value.length} file(s) uploaded successfully`,
          files: selectedFiles.value,
          uploadResults: result
        })
        
        // Show upload summary
        uploadSummary.value = `${selectedFiles.value.length} files uploaded successfully`
        
        selectedFiles.value = [] // Clear selected files
        
      } catch (error) {
        console.error('Error during file upload:', error)
        
        // Mark all files as error
        uploadingFiles.value = uploadingFiles.value.map(file => ({
          ...file,
          status: 'error'
        }))
        
        emit('message-sent', {
          type: 'error',
          content: 'Failed to upload files',
          error: error.message || 'Unknown error occurred'
        })
      } finally {
        isUploading.value = false
        uploadProgress.value = 0
        totalFiles.value = 0
        uploadingFiles.value = []
        
        // Clear upload summary after 3 seconds
        setTimeout(() => {
          uploadSummary.value = ''
        }, 3000)
      }
    }

    // Handle text message if present and no files are uploading
    if (message.value.trim() && !isUploading.value) {
      const currentMessage = message.value.trim()
      message.value = '' // Clear message input immediately
      let retryCount = 0;
      const maxRetries = 3;
      
      try {
        // Set processing state
        isProcessing.value = true

        let emittedLoading = false;
        // Only emit loading state if not a new chat
        if (!isNewChatSession()) {
          emit('message-sent', {
            type: 'text',
            content: currentMessage,
            isLoading: true
          })
          emittedLoading = true;
        }

        // Create new session if needed
        if (isNewChatSession()) {
          await sessionManager.createNewSession();
          sessionId.value = sessionManager.getSessionId();
        }

        const response = await (async () => {
          try {
            // Set timeout warning to show after 15 seconds
            timeoutWarningTimer = setTimeout(() => {
              timeoutWarning.value = true
              if (!emittedLoading) {
                emit('message-sent', {
                  type: 'text',
                  content: currentMessage,
                  isLoading: true,
                  timeoutWarning: true
                })
                emittedLoading = true;
              }
            }, 15000)

            const result = await api.chatQuery(currentMessage);

            // Clear timeout warning
            if (timeoutWarningTimer) {
              clearTimeout(timeoutWarningTimer)
              timeoutWarningTimer = null
            }
            timeoutWarning.value = false

            return result;
          } catch (error) {
            const hasTimeoutError = error && 
              (error.code === 'ECONNABORTED' || 
               (error.message && 
                (error.message.includes('timeout') || 
                 error.message.includes('Network Error'))));
            
            if (hasTimeoutError && retryCount < maxRetries) {
              retryCount++;
              const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
              await new Promise(resolve => setTimeout(resolve, delay));
              return await api.chatQuery(currentMessage);
            }
            throw error;
          }
        })();

        // Handle enhanced response with structured data
        if (response.parsedData) {
          // Send structured response
          emit('message-sent', {
            type: 'text',
            content: currentMessage,
            response: response.data.response || response.data.answer || response.data,
            parsedResponse: response.parsedData,
            sources: response.parsedData.sources,
            functionCalls: response.parsedData.functionCalls,
            translations: response.parsedData.translations,
            summaries: response.parsedData.summaries,
            isStructuredResponse: response.parsedData.hasFunctionCalls,
            source_attribution: response.parsedData?.source_attribution || response.data?.source_attribution || null,
            isLoading: false
          })
        } else {
          // Fallback to simple response
          emit('message-sent', {
            type: 'text',
            content: currentMessage,
            response: response.data.response || response.data.answer || response.data,
            sessionId: response.sessionId,
            source_attribution: response.data?.source_attribution || null,
            isLoading: false
          })
        }

      } catch (error) {
        console.error('Error sending chat message:', error)
        
        // Clear timeout warning on error
        if (timeoutWarningTimer) {
          clearTimeout(timeoutWarningTimer)
          timeoutWarningTimer = null
        }
        timeoutWarning.value = false

        // Determine error message based on error type
        // Determine error message based on error type
        const errorMsg = 
          error.code === 'ECONNABORTED' || error.message.includes('timeout')
            ? `Request timed out after ${maxRetries} attempts. The server may be busy, please try again in a moment.`
            : error.message.includes('Network Error')
            ? 'Unable to connect to the server. Please check your internet connection and try again.'
            : error.response?.status === 401
            ? 'Authentication failed. Please log in again.'
            : error.response?.status >= 500
            ? 'Server error. Please try again in a moment.'
            : 'An error occurred while processing your message.';
        
        // Provide better error messages for timeout
        let errorMessage = 'Failed to send message'
        if (error.code === 'ECONNABORTED') {
          errorMessage = 'Request timed out - the server may be busy. Please try again.'
        } else if (error.response?.status >= 500) {
          errorMessage = 'Server error - please try again in a moment.'
        } else if (error.response?.status >= 400) {
          errorMessage = 'Bad request - please check your message and try again.'
        }
        
        // Emit error message for parent component to handle
        emit('message-sent', {
          type: 'error',
          content: errorMessage,
          error: error.message || 'Unknown error occurred',
          isLoading: false
        })
      } finally {
        // Always clear processing state and timers
        isProcessing.value = false
        if (timeoutWarningTimer) {
          clearTimeout(timeoutWarningTimer)
          timeoutWarningTimer = null
        }
        timeoutWarning.value = false
      }
    }
  } catch (error) {
    console.error('Error sending message:', error)
    // Emit error message for parent component to handle
    emit('message-sent', {
      type: 'error',
      content: 'Failed to send message',
      error: error.message || 'Unknown error occurred'
    })
  }
}
</script>
