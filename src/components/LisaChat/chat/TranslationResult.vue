<template>
  <div class="translation-result border border-blue-200 rounded-lg p-4 bg-blue-50">
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <MaterialIcon name="translate" size="text-sm" color="text-white" />
        </div>
        <div>
          <h3 class="font-semibold text-blue-900">Translation Complete</h3>
          <p class="text-sm text-blue-700">{{ translation.filename }}</p>
        </div>
      </div>
      <button 
        @click="toggleExpanded"
        class="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
      >
        <MaterialIcon 
          :name="isExpanded ? 'expand_less' : 'expand_more'" 
          size="text-base" 
        />
      </button>
    </div>

    <!-- Language Translation Info -->
    <div class="flex items-center gap-4 mb-3">
      <div class="flex items-center gap-2">
        <span class="px-2 py-1 bg-gray-200 rounded text-sm font-medium">
          {{ translation.source_language }}
        </span>
        <MaterialIcon name="arrow_forward" size="text-sm" color="text-gray-600" />
        <span class="px-2 py-1 bg-blue-200 rounded text-sm font-medium">
          {{ translation.target_language }}
        </span>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-3 gap-4 mb-3">
      <div class="text-center">
        <div class="text-lg font-semibold text-blue-900">{{ translation.original_word_count.toLocaleString() }}</div>
        <div class="text-xs text-blue-700">Original Words</div>
      </div>
      <div class="text-center">
        <div class="text-lg font-semibold text-green-900">{{ translation.translated_word_count.toLocaleString() }}</div>
        <div class="text-xs text-green-700">Translated Words</div>
      </div>
      <div class="text-center">
        <div class="text-lg font-semibold text-gray-900">{{ translation.page_count }}</div>
        <div class="text-xs text-gray-700">Pages</div>
      </div>
    </div>

    <!-- Expandable Details -->
    <div v-if="isExpanded" class="border-t border-blue-200 pt-3 space-y-4">
      <!-- Translation Service Info -->
      <div class="bg-white rounded-lg p-3">
        <h4 class="font-medium text-gray-900 mb-2">Translation Details</h4>
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span class="text-gray-600">Service:</span>
            <span class="ml-1 font-medium">{{ translation.translation_info.translation_service }}</span>
          </div>
          <div>
            <span class="text-gray-600">Chunks Processed:</span>
            <span class="ml-1 font-medium">{{ translation.translation_info.chunks_processed }}</span>
          </div>
          <div>
            <span class="text-gray-600">Source Language Code:</span>
            <span class="ml-1 font-medium">{{ translation.translation_info.source_language_code }}</span>
          </div>
          <div>
            <span class="text-gray-600">Target Language Code:</span>
            <span class="ml-1 font-medium">{{ translation.translation_info.target_language_code }}</span>
          </div>
          <div>
            <span class="text-gray-600">Original Size:</span>
            <span class="ml-1 font-medium">{{ translation.translation_info.document_size }}</span>
          </div>
          <div>
            <span class="text-gray-600">Translation Size:</span>
            <span class="ml-1 font-medium">{{ translation.translation_info.translation_size }}</span>
          </div>
        </div>
      </div>

      <!-- Content Preview -->
      <div class="bg-white rounded-lg p-3">
        <h4 class="font-medium text-gray-900 mb-2">Content Preview</h4>
        
        <!-- Original Content -->
        <div class="mb-3">
          <h5 class="text-sm font-medium text-gray-700 mb-1">Original ({{ translation.source_language }}):</h5>
          <div class="bg-gray-50 rounded p-2 text-sm text-gray-700 max-h-24 overflow-y-auto">
            {{ getContentPreview(translation.original_content) }}
          </div>
        </div>

        <!-- Translated Content -->
        <div>
          <h5 class="text-sm font-medium text-blue-700 mb-1">Translated ({{ translation.target_language }}):</h5>
          <div class="bg-blue-50 rounded p-2 text-sm text-blue-700 max-h-24 overflow-y-auto">
            {{ getContentPreview(translation.translated_content) }}
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2 flex-wrap">
        <button 
          @click="downloadTranslation"
          :disabled="isDownloading"
          class="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
        >
          <div v-if="isDownloading" class="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
          <MaterialIcon v-else name="download" size="text-sm" />
          {{ isDownloading ? 'Downloading...' : 'Download Translation' }}
        </button>
        
        <button 
          @click="viewFullContent"
          class="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm transition-colors"
        >
          <MaterialIcon name="visibility" size="text-sm" />
          View Full Content
        </button>
        
        <button 
          @click="copyTranslatedContent"
          class="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm transition-colors"
        >
          <MaterialIcon name="content_copy" size="text-sm" />
          Copy Translation
        </button>
      </div>
    </div>

    <!-- Quick Action Buttons (always visible) -->
    <div class="flex gap-2 mt-3">
      <button 
        @click="copyTranslatedContent"
        class="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-xs transition-colors"
      >
        <MaterialIcon name="content_copy" size="text-sm" />
        Copy
      </button>
      
      <button 
        @click="viewFullContent"
        class="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 text-xs transition-colors"
      >
        <MaterialIcon name="visibility" size="text-sm" />
        View
      </button>
    </div>

    <!-- Success Messages -->
    <div class="mt-2 text-sm text-blue-700">
      {{ translation.message }}
    </div>

    <!-- Full Content Modal -->
    <Modal
      :is-open="showContentModal"
      :title="`Translation: ${translation.filename}`"
      :subtitle="`${translation.source_language} → ${translation.target_language}`"
      icon="translate"
      icon-color="text-blue-600"
      @close="showContentModal = false"
    >
      <div class="space-y-6">
        <!-- Translation Stats -->
        <div class="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ translation.original_word_count.toLocaleString() }}</div>
            <div class="text-sm text-gray-600">Original Words</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ translation.translated_word_count.toLocaleString() }}</div>
            <div class="text-sm text-gray-600">Translated Words</div>
          </div>
        </div>

        <!-- Side-by-side Content -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Original Content -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-medium text-gray-900">Original ({{ translation.source_language }})</h3>
              <button 
                @click="copyTranslation"
                class="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Copy Both
              </button>
            </div>
            <div class="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto border">
              <div class="text-sm leading-relaxed whitespace-pre-wrap">{{ translation.original_content }}</div>
            </div>
          </div>

          <!-- Translated Content -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-medium text-blue-900">Translated ({{ translation.target_language }})</h3>
              <button 
                @click="copyTranslatedContent"
                class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                Copy Translation
              </button>
            </div>
            <div class="bg-blue-50 rounded-lg p-4 max-h-96 overflow-y-auto border border-blue-200">
              <div class="text-sm leading-relaxed whitespace-pre-wrap">{{ translation.translated_content }}</div>
            </div>
          </div>
        </div>

        <!-- Translation Info -->
        <div class="bg-white border rounded-lg p-4">
          <h4 class="font-medium text-gray-900 mb-3">Translation Information</h4>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-600">Service:</span>
              <span class="ml-2 font-medium">{{ translation.translation_info.translation_service }}</span>
            </div>
            <div>
              <span class="text-gray-600">Chunks:</span>
              <span class="ml-2 font-medium">{{ translation.translation_info.chunks_processed }}</span>
            </div>
            <div>
              <span class="text-gray-600">Document Size:</span>
              <span class="ml-2 font-medium">{{ translation.translation_info.document_size }}</span>
            </div>
            <div>
              <span class="text-gray-600">Translation Size:</span>
              <span class="ml-2 font-medium">{{ translation.translation_info.translation_size }}</span>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <button 
            @click="downloadTranslation"
            :disabled="isDownloading"
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <div v-if="isDownloading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <MaterialIcon v-else name="download" size="text-sm" />
            {{ isDownloading ? 'Downloading...' : 'Download Translation' }}
          </button>
          <button 
            @click="showContentModal = false"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MaterialIcon from '@/components/icons/MaterialIcon.vue'
import Modal from '@/components/shared/Modal.vue'
import { useToast } from '@/composables/useToast'
import type { TranslationResult } from '@/services/responseParser'

interface Props {
  translation: TranslationResult
  expanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  expanded: false
})

const isExpanded = ref(props.expanded)
const showContentModal = ref(false)
const isDownloading = ref(false)
const { showSuccess, showError, showInfo } = useToast()

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

const getContentPreview = (content: string, maxLength: number = 200): string => {
  if (!content) return 'No content available'
  if (content.length <= maxLength) return content
  return content.substring(0, maxLength) + '...'
}

// Download translation as a text file
const downloadTranslation = async () => {
  try {
    isDownloading.value = true
    
    // Create formatted content
    const content = `
TRANSLATION RESULT

Document: ${props.translation.filename}
Source Language: ${props.translation.source_language}
Target Language: ${props.translation.target_language}
Original Word Count: ${props.translation.original_word_count.toLocaleString()}
Translated Word Count: ${props.translation.translated_word_count.toLocaleString()}
Page Count: ${props.translation.page_count}
Translation Service: ${props.translation.translation_info.translation_service}

ORIGINAL CONTENT (${props.translation.source_language})
${'='.repeat(50)}

${props.translation.original_content}

TRANSLATED CONTENT (${props.translation.target_language})
${'='.repeat(50)}

${props.translation.translated_content}

--
Generated by LiSA Translation Service
${new Date().toLocaleString()}
    `.trim()
    
    // Create and download file
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    
    // Generate filename
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    const cleanFilename = props.translation.filename.replace(/\.[^/.]+$/, '')
    const filename = `${cleanFilename}_translation_${props.translation.source_language}-${props.translation.target_language}_${timestamp}.txt`
    
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    showSuccess('Download Complete', `Translation saved as ${filename}`)
    
  } catch (error) {
    console.error('Download error:', error)
    showError('Download Failed', 'Unable to download translation file')
  } finally {
    isDownloading.value = false
  }
}

// Copy translation content to clipboard
const copyTranslation = async () => {
  try {
    const content = `Original (${props.translation.source_language}):\n${props.translation.original_content}\n\nTranslated (${props.translation.target_language}):\n${props.translation.translated_content}`
    
    await navigator.clipboard.writeText(content)
    showSuccess('Copied!', 'Translation content copied to clipboard')
  } catch (error) {
    console.error('Copy error:', error)
    showError('Copy Failed', 'Unable to copy to clipboard')
  }
}

// Copy only translated content
const copyTranslatedContent = async () => {
  try {
    await navigator.clipboard.writeText(props.translation.translated_content)
    showSuccess('Copied!', 'Translated content copied to clipboard')
  } catch (error) {
    console.error('Copy error:', error)
    showError('Copy Failed', 'Unable to copy to clipboard')
  }
}

// Show full content in modal
const viewFullContent = () => {
  showContentModal.value = true
}

// Computed properties for additional formatting
const translationEfficiency = computed(() => {
  const ratio = props.translation.translated_word_count / props.translation.original_word_count
  return Math.round(ratio * 100)
})

const documentInfo = computed(() => {
  return {
    id: props.translation.document_id,
    filename: props.translation.filename,
    sourceLanguage: props.translation.source_language,
    targetLanguage: props.translation.target_language
  }
})

const hasRealContent = computed(() => {
  return props.translation.original_content !== 'Content available in full translation output' &&
         props.translation.translated_content !== 'Content available in full translation output'
})
</script>

<style scoped>
.translation-result {
  transition: all 0.3s ease;
}

.translation-result:hover {
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

/* Custom scrollbar for content preview */
.max-h-24::-webkit-scrollbar {
  width: 4px;
}

.max-h-24::-webkit-scrollbar-track {
  background: transparent;
}

.max-h-24::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

.max-h-24::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
