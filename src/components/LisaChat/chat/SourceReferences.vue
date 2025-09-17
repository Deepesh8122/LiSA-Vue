<template>
  <div v-if="!isHidden && sources.length > 0" class="source-references border border-purple-200 rounded-lg p-4 bg-purple-50">
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
          <MaterialIcon name="source" size="text-sm" color="text-white" />
        </div>
        <div>
          <h3 class="font-semibold text-purple-900">Source Documents</h3>
          <p class="text-sm text-purple-700">{{ sources.length }} document{{ sources.length > 1 ? 's' : '' }} referenced</p>
        </div>
      </div>
      <button 
        @click="toggleExpanded"
        class="p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded"
      >
        <MaterialIcon 
          :name="isExpanded ? 'expand_less' : 'expand_more'" 
          size="text-base" 
        />
      </button>
    </div>

    <!-- Source List -->
    <div class="space-y-2">
      <div 
        v-for="(source, index) in displayedSources" 
        :key="index"
        class="bg-white rounded-lg p-3 border border-purple-100 hover:border-purple-200 transition-colors"
      >
        <div class="flex items-center gap-3">
          <!-- File Icon -->
          <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <MaterialIcon :name="getFileIcon(source)" size="text-base" color="text-purple-600" />
          </div>
          
          <!-- File Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <h4 class="font-medium text-gray-900 truncate">{{ getFileName(source) }}</h4>
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                {{ getFileExtension(source) }}
              </span>
            </div>
            <p class="text-sm text-gray-600 truncate">{{ source }}</p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-1">
            <button 
              @click="viewSource(source)"
              class="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded transition-colors"
              :title="'View ' + getFileName(source)"
            >
              <MaterialIcon name="visibility" size="text-sm" />
            </button>
            <button 
              @click="copySource(source)"
              class="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded transition-colors"
              :title="'Copy path'"
            >
              <MaterialIcon name="content_copy" size="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Show More/Less Button -->
    <button 
      v-if="sources.length > 3"
      @click="toggleShowAll"
      class="mt-3 w-full text-center text-purple-600 hover:text-purple-800 text-sm font-medium py-2 rounded hover:bg-purple-100 transition-colors"
    >
      {{ showAll ? 'Show less' : `Show ${sources.length - 3} more sources` }}
    </button>

    <!-- Expandable Details -->
    <div v-if="isExpanded" class="border-t border-purple-200 pt-3 mt-3">
      <!-- Source Statistics -->
      <div class="bg-white rounded-lg p-3 mb-3">
        <h4 class="font-medium text-gray-900 mb-2">Source Statistics</h4>
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span class="text-gray-600">Total Sources:</span>
            <span class="ml-1 font-medium">{{ sources.length }}</span>
          </div>
          <div>
            <span class="text-gray-600">File Types:</span>
            <span class="ml-1 font-medium">{{ uniqueFileTypes.join(', ') }}</span>
          </div>
        </div>
      </div>

      <!-- All Sources with Details -->
      <div class="bg-white rounded-lg p-3">
        <h4 class="font-medium text-gray-900 mb-2">All Referenced Sources</h4>
        <div class="space-y-2 max-h-48 overflow-y-auto">
          <div 
            v-for="(source, index) in sources" 
            :key="index"
            class="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
          >
            <div class="flex items-center gap-2 flex-1 min-w-0">
              <span class="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-medium text-purple-600">
                {{ index + 1 }}
              </span>
              <span class="truncate">{{ source }}</span>
            </div>
            <div class="flex items-center gap-1 ml-2">
              <button 
                @click="viewSource(source)"
                class="p-1 text-purple-600 hover:text-purple-800 rounded"
              >
                <MaterialIcon name="open_in_new" size="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-2 mt-3">
        <button 
          @click="exportSources"
          :disabled="isExporting"
          class="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm disabled:opacity-50"
        >
          <MaterialIcon name="download" size="text-sm" />
          {{ isExporting ? 'Exporting...' : 'Export List' }}
        </button>
        <button 
          @click="copyAllSources"
          class="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
        >
          <MaterialIcon name="content_copy" size="text-sm" />
          Copy All
        </button>
      </div>
    </div>
  </div>

  <div v-if="sources.length > 0" class="source-preview mt-4">
    <h3 class="font-semibold text-purple-900 mb-3">Source References</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ">
      <div 
        v-for="(source, index) in displayedSources" 
        :key="index"
        class="source-item group"
        @click="openModal(source)"
      >
        <!-- Image Preview -->
        <div class="preview-container">
          <!-- <img 
            v-if="isImage(source)" 
            :src="server_URL + source" 
            alt="Preview"
            class="preview-image"
          />
          <div 
            v-else 
            class="document-preview"
          >
            <MaterialIcon :name="getFileIcon(source)" size="text-3xl" color="text-purple-600" />
          </div> -->

          <!-- <iframe 
            v-if="shouldShowInIframe(selectedSource)" 
            :src="server_URL + source" 
            class="modal-iframe"
          ></iframe> -->
          <img 
            v-if="!shouldShowInIframe(selectedSource)" 
            :src="server_URL + source" 
            alt="Full Preview"
          />
          <div 
            v-else 
            class="document-preview"
          >
            <MaterialIcon :name="getFileIcon(source)" size="text-3xl" color="text-purple-600" />
          </div>
          
          <!-- Hover Overlay -->
          <div class="preview-overlay">
            <button class="preview-button">
              <MaterialIcon name="zoom_in" size="text-xl" color="text-white" />
              <span>Preview</span>
            </button>
          </div>
        </div>

        <!-- File Info -->
        <div class="source-info flex items-center gap-2">
          <h4 class="source-title">{{ getFileName(source) }}</h4>
          <span class="source-type">{{ getFileExtension(source) }}</span>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <transition name="fade">
      <div v-if="selectedSource" class="modal-overlay" @click="closeModal">
        <div class="modal-container" @click.stop>
          <!-- Modal Header -->
          <div class="modal-header">
            <h3 class="modal-title">{{ getFileName(selectedSource) }}</h3>
            <button @click="closeModal" class="modal-close">
              <MaterialIcon name="close" size="text-xl" />
            </button>
          </div>

          <!-- Modal Content -->
          <div class="modal-content">
            <iframe 
              v-if="shouldShowInIframe(selectedSource)" 
              :src="server_URL + selectedSource" 
              class="modal-iframe"
            ></iframe>
            <img 
              v-else
              :src="server_URL + selectedSource" 
              alt="Full Preview"
              class="modal-image"
            />
            <!-- <div 
              v-else 
              class="flex items-center justify-center p-8"
            >
              <MaterialIcon :name="getFileIcon(selectedSource)" size="text-3xl" color="text-purple-600" />
              <p class="ml-2 text-gray-600">Preview not available</p>
            </div> -->
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer">
            <button 
              @click="copySource(server_URL + selectedSource)"
              class="modal-action-btn"
            >
              <MaterialIcon name="content_copy" size="text-sm" />
              Copy Link
            </button>
            <a 
              :href="server_URL + selectedSource" 
              target="_blank" 
              rel="noopener noreferrer"
              class="modal-action-btn"
            >
              <MaterialIcon name="open_in_new" size="text-sm" />
              Open in New Tab
            </a>
          </div>
        </div>
      </div>
    </transition>
    
    <div class="flex flex-row gap-3 justify-between items-center mt-4">
      <p class="text-sm text-purple-700 mt-3">
        {{ sources.length }} document{{ sources.length > 1 ? 's' : '' }} referenced
      </p>
      <button 
         v-if="sources.length > 3"
         @click="toggleShowAll"
         class="px-3 text-center text-purple-600 hover:text-purple-800 text-sm font-medium py-2 rounded bg-purple-200 transition-colors"
       >
         {{ showAll ? 'Show less' : `Show ${sources.length - 3} more sources` }}
       </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MaterialIcon from '@/components/icons/MaterialIcon.vue'
import { useToast } from '@/composables/useToast'

interface Props {
  sources: string[]
  expanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  expanded: false
})

const isHidden = ref(true) // Fixed: Changed from true to false to show by default

const server_URL = import.meta.env.VITE_API_BASE_URL;

// File type checking functions
const isImage = (src: string): boolean => {
  return /\.(jpg|jpeg|png|gif|webp|bmp|tiff|svg|ico|heic)$/i.test(src);
};

const isDocumentType = (src: string): boolean => {
  return /\.(doc|docx|xls|xlsx|ppt|pptx|txt|csv|rtf)$/i.test(src);
};

const isPDF = (src: string): boolean => {
  return /\.pdf$/i.test(src);
};

// Check if file should be shown in iframe (PDF or other documents)
const shouldShowInIframe = (src: string): boolean => {
  return isPDF(src) || isDocumentType(src);
};

const isExpanded = ref(props.expanded)
const showAll = ref(false)
const isExporting = ref(false)
const selectedSource = ref<string | null>(null)
const { showSuccess, showError, showInfo } = useToast()

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

const openModal = (source: string) => {
  selectedSource.value = source
  // Prevent body scrolling when modal is open
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  selectedSource.value = null
  // Restore body scrolling
  document.body.style.overflow = ''
}

const toggleShowAll = () => {
  showAll.value = !showAll.value
}

const displayedSources = computed(() => {
  if (showAll.value || props.sources.length <= 3) {
    return props.sources
  }
  return props.sources.slice(0, 3)
})

const uniqueFileTypes = computed(() => {
  const types = new Set(props.sources.map(source => getFileExtension(source)))
  return Array.from(types).filter(type => type !== 'unknown')
})

// Helper functions
const getFileName = (source: string): string => {
  if (!source) return 'Unknown file'
  const parts = source.split('/')
  return parts[parts.length - 1] || source
}

const getFileExtension = (source: string): string => {
  const fileName = getFileName(source)
  const parts = fileName.split('.')
  if (parts.length > 1) {
    return parts[parts.length - 1].toUpperCase()
  }
  return 'unknown'
}

const getFileIcon = (source: string): string => {
  if (isPDF(source)) {
    return 'picture_as_pdf';
  }
  
  if (isImage(source)) {
    return 'image';
  }
  
  // Get extension for other file types
  const extension = getFileExtension(source).toLowerCase();
  
  // Document types
  if (isDocumentType(source)) {
    switch (extension) {
      case 'doc':
      case 'docx':
      case 'rtf':
        return 'description';
      case 'txt':
      case 'csv':
        return 'text_snippet';
      case 'xls':
      case 'xlsx':
        return 'table_chart';
      case 'ppt':
      case 'pptx':
        return 'slideshow';
      default:
        return 'article';
    }
  }
  
  // Media types
  switch (extension) {
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'webm':
      return 'movie';
    case 'mp3':
    case 'wav':
    case 'ogg':
    case 'flac':
      return 'audiotrack';
    default:
      return 'insert_drive_file';
  }
}

// Enhanced action handlers
const viewSource = (source: string) => {
  try {
    // Try to open the source if it's a URL
    if (source.startsWith('http://') || source.startsWith('https://')) {
      window.open(source, '_blank', 'noopener,noreferrer')
      showInfo('Opening Source', `Opening ${getFileName(source)} in new tab`)
    } else {
      // For local files, show info that file viewing isn't available
      showInfo('Source Information', `File: ${getFileName(source)}\nPath: ${source}`)
    }
  } catch (error) {
    console.error('Error viewing source:', error)
    showError('View Failed', 'Unable to open source document')
  }
}

const copySource = async (source: string) => {
  try {
    await navigator.clipboard.writeText(source)
    showSuccess('Copied!', `Source path copied: ${getFileName(source)}`)
  } catch (error) {
    console.error('Failed to copy source:', error)
    showError('Copy Failed', 'Unable to copy source path to clipboard')
  }
}

const copyAllSources = async () => {
  try {
    const timestamp = new Date().toLocaleString()
    const formattedSources = `SOURCE REFERENCES\nGenerated: ${timestamp}\n\n${props.sources.map((source, index) => `${index + 1}. ${source}`).join('\n')}`
    
    await navigator.clipboard.writeText(formattedSources)
    showSuccess('All Sources Copied!', `${props.sources.length} source references copied to clipboard`)
  } catch (error) {
    console.error('Failed to copy all sources:', error)
    showError('Copy Failed', 'Unable to copy sources to clipboard')
  }
}

const exportSources = async () => {
  try {
    isExporting.value = true
    
    const timestamp = new Date().toLocaleString()
    const content = `SOURCE REFERENCES
Generated: ${timestamp}
Total Sources: ${props.sources.length}
File Types: ${uniqueFileTypes.value.join(', ')}

${'='.repeat(50)}

${props.sources.map((source, index) => {
  const fileName = getFileName(source)
  const extension = getFileExtension(source)
  return `${index + 1}. ${fileName} (${extension})\n   Path: ${source}`
}).join('\n\n')}

${'='.repeat(50)}
Generated by LiSA Source Reference System
    `.trim()
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    
    const filename = `source-references_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`
    
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    showSuccess('Export Complete!', `Sources exported as ${filename}`)
    
  } catch (error) {
    console.error('Export error:', error)
    showError('Export Failed', 'Unable to export source references')
  } finally {
    isExporting.value = false
  }
}

// Computed properties for stats
const sourceStats = computed(() => {
  return {
    total: props.sources.length,
    fileTypes: uniqueFileTypes.value,
    avgLength: Math.round(props.sources.reduce((sum, source) => sum + source.length, 0) / props.sources.length)
  }
})
</script>

<style scoped>
.source-references {
  transition: all 0.3s ease;
}

.source-references:hover {
  box-shadow: 0 4px 12px rgba(147, 51, 234, 0.15);
}

/* Custom scrollbar for source list */
.max-h-48::-webkit-scrollbar {
  width: 4px;
}

.max-h-48::-webkit-scrollbar-track {
  background: transparent;
}

.max-h-48::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

.max-h-48::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

/* Source Preview Grid */
.source-item {
  background-color: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid rgb(208, 204, 212);
  cursor: pointer;
  transition: all 0.2s;
}

.source-item:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-color: rgb(233, 213, 255);
  transform: scale(1.02);
}

.preview-container {
  position: relative;
  aspect-ratio: 16/9;
  background-color: rgb(245, 243, 255);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.document-preview {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(245, 243, 255);
}

.preview-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.group:hover .preview-overlay {
  opacity: 1;
}

.preview-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  color: white;
  font-weight: 500;
}

.source-info {
  padding: 0.75rem;
}

.source-title {
  font-weight: 500;
  color: rgb(17, 24, 39);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.875rem;
}

.source-type {
  font-size: 0.75rem;
  color: rgb(147, 51, 234);
  background-color: rgb(245, 243, 255);
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  display: inline-block;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
}

.modal-container {
  background-color: white;
  border-radius: 0.75rem;
  max-width: 56rem;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid rgb(229, 231, 235);
}

.modal-title {
  font-weight: 600;
  font-size: 1.125rem;
  color: rgb(17, 24, 39);
}

.modal-close {
  padding: 0.25rem;
  color: rgb(107, 114, 128);
  border-radius: 9999px;
  transition: all 0.2s;
}

.modal-close:hover {
  color: rgb(55, 65, 81);
  background-color: rgb(243, 244, 246);
}

.modal-content {
  flex: 1;
  overflow: auto;
  padding: 1rem;
  min-height: 0;
}

.modal-image {
  max-width: 100%;
  height: auto;
  margin: 0 auto;
}

.modal-iframe {
  width: 100%;
  height: 100%;
  min-height: 60vh;
  border: none;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid rgb(229, 231, 235);
}

.modal-action-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: rgb(245, 243, 255);
  color: rgb(109, 40, 217);
  transition: background-color 0.2s;
}

.modal-action-btn:hover {
  background-color: rgb(237, 233, 254);
}

/* Animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Source item animation */
.space-y-2 > div {
  animation: slideInUp 0.3s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>