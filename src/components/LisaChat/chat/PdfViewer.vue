<!-- PDF Viewer Component -->
<template>
  <div class="pdf-viewer">
    <!-- Header with document info -->
    <div class="header-section border border-purple-200 rounded-lg p-4 bg-purple-50 mb-4">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
            <MaterialIcon name="picture_as_pdf" size="text-sm" color="text-white" />
          </div>
          <div>
            <h3 class="font-semibold text-purple-900">{{ getFileName(currentDocument) }}</h3>
            <p class="text-sm text-purple-700">{{ getDocumentInfo }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button 
            @click="downloadPdf"
            class="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded transition-colors"
            title="Download PDF"
          >
            <MaterialIcon name="download" size="text-sm" />
          </button>
          <button 
            @click="toggleFullscreen"
            class="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded transition-colors"
            title="Toggle fullscreen"
          >
            <MaterialIcon :name="isFullscreen ? 'fullscreen_exit' : 'fullscreen'" size="text-sm" />
          </button>
        </div>
      </div>

      <!-- Document metadata -->
      <div class="flex flex-wrap gap-3 text-sm">
        <div class="flex items-center gap-1">
          <MaterialIcon name="schedule" size="text-sm" color="text-purple-600" />
          <span class="text-gray-600">Upload Date:</span>
          <span class="font-medium">{{ formatDate(documentMetadata.uploadDate) }}</span>
        </div>
        <div class="flex items-center gap-1">
          <MaterialIcon name="description" size="text-sm" color="text-purple-600" />
          <span class="text-gray-600">Pages:</span>
          <span class="font-medium">{{ documentMetadata.pageCount }}</span>
        </div>
        <div class="flex items-center gap-1">
          <MaterialIcon name="folder" size="text-sm" color="text-purple-600" />
          <span class="text-gray-600">File Size:</span>
          <span class="font-medium">{{ formatFileSize(documentMetadata.fileSize) }}</span>
        </div>
      </div>
    </div>

    <!-- PDF Viewer -->
    <div 
      class="pdf-container bg-white rounded-lg shadow-sm border border-purple-100 overflow-hidden"
      :class="{ 'fullscreen': isFullscreen }"
    >
      <!-- Toolbar -->
      <div class="toolbar bg-gray-50 border-b border-purple-100 p-2 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <!-- Page Navigation -->
          <button 
            @click="previousPage"
            :disabled="currentPage === 1"
            class="p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MaterialIcon name="navigate_before" size="text-sm" />
          </button>
          <div class="flex items-center gap-1">
            <input 
              type="number" 
              v-model="currentPage"
              class="w-12 text-center border border-purple-200 rounded"
              :min="1"
              :max="totalPages"
            >
            <span class="text-gray-600 text-sm">/ {{ totalPages }}</span>
          </div>
          <button 
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MaterialIcon name="navigate_next" size="text-sm" />
          </button>
        </div>

        <!-- Zoom Controls -->
        <div class="flex items-center gap-2">
          <button 
            @click="zoomOut"
            class="p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded"
          >
            <MaterialIcon name="zoom_out" size="text-sm" />
          </button>
          <select 
            v-model="zoomLevel"
            class="text-sm border border-purple-200 rounded px-2 py-1"
          >
            <option value="0.5">50%</option>
            <option value="0.75">75%</option>
            <option value="1">100%</option>
            <option value="1.25">125%</option>
            <option value="1.5">150%</option>
            <option value="2">200%</option>
          </select>
          <button 
            @click="zoomIn"
            class="p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded"
          >
            <MaterialIcon name="zoom_in" size="text-sm" />
          </button>
        </div>
      </div>

      <!-- PDF Content -->
      <div class="pdf-content p-4" :style="{ transform: `scale(${zoomLevel})` }">
        <iframe 
          :src="pdfUrl"
          class="w-full min-h-[600px] border-0"
          :class="{ 'h-screen': isFullscreen }"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import MaterialIcon from '@/components/icons/MaterialIcon.vue'

interface DocumentMetadata {
  uploadDate: string
  pageCount: number
  fileSize: number
  title?: string
  id?: string
}

const props = defineProps<{
  currentDocument: string
  documentMetadata: DocumentMetadata
}>()

// State
const currentPage = ref(1)
const totalPages = ref(props.documentMetadata.pageCount)
const zoomLevel = ref(1)
const isFullscreen = ref(false)

// Base URL for PDF files
const server_URL = import.meta.env.VITE_API_BASE_URL || ''

// Computed
const pdfUrl = computed(() => `${server_URL}${props.currentDocument}`)

const getDocumentInfo = computed(() => {
  const parts: string[] = []
  if (props.documentMetadata.title) parts.push(props.documentMetadata.title)
  if (props.documentMetadata.id) parts.push(`ID: ${props.documentMetadata.id}`)
  return parts.join(' - ')
})

// Helpers
const getFileName = (path: string): string => {
  if (!path) return 'Unknown document'
  const parts = path.split('/')
  return parts[parts.length - 1] || path
}

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Pagination
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// Zoom
const zoomIn = () => {
  const levels = [0.5, 0.75, 1, 1.25, 1.5, 2]
  const currentIndex = levels.indexOf(zoomLevel.value)
  if (currentIndex < levels.length - 1) {
    zoomLevel.value = levels[currentIndex + 1]
  }
}
const zoomOut = () => {
  const levels = [0.5, 0.75, 1, 1.25, 1.5, 2]
  const currentIndex = levels.indexOf(zoomLevel.value)
  if (currentIndex > 0) {
    zoomLevel.value = levels[currentIndex - 1]
  }
}

// Fullscreen
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

// Download
const downloadPdf = async () => {
  try {
    const response = await fetch(pdfUrl.value)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = getFileName(props.currentDocument)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading PDF:', error)
  }
}
</script>

<style scoped>
/* your styles kept as-is */
</style>
