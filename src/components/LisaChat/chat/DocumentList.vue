<template>
  <div class="document-management">
    <!-- Document List -->
    <div class="border border-purple-200 rounded-lg bg-purple-50 mb-4">
      <div class="p-4">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <MaterialIcon name="folder" size="text-sm" color="text-white" />
            </div>
            <div>
              <h3 class="font-semibold text-purple-900">Document Library</h3>
              <p class="text-sm text-purple-700">{{ documents.length }} documents available</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button 
              @click="toggleView"
              class="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded transition-colors"
              :title="isGridView ? 'Switch to list view' : 'Switch to grid view'"
            >
              <MaterialIcon :name="isGridView ? 'view_list' : 'grid_view'" size="text-sm" />
            </button>
            <button 
              @click="toggleFilter"
              class="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded transition-colors"
              title="Filter documents"
            >
              <MaterialIcon name="filter_list" size="text-sm" />
            </button>
          </div>
        </div>

        <!-- Filter Panel -->
        <div v-if="showFilter" class="mb-4 p-3 bg-white rounded-lg border border-purple-100">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <!-- Search -->
            <div class="relative">
              <input 
                v-model="searchQuery"
                type="text"
                placeholder="Search documents..."
                class="w-full pl-8 pr-3 py-1.5 border border-purple-200 rounded"
              >
              <MaterialIcon 
                name="search"
                size="text-sm"
                color="text-purple-400"
                class="absolute left-2.5 top-1/2 transform -translate-y-1/2"
              />
            </div>
            <!-- Type Filter -->
            <div>
              <select 
                v-model="selectedType"
                class="w-full px-3 py-1.5 border border-purple-200 rounded"
              >
                <option value="">All Types</option>
                <option v-for="type in documentTypes" :key="type" :value="type">
                  {{ type.toUpperCase() }}
                </option>
              </select>
            </div>
            <!-- Sort -->
            <div>
              <select 
                v-model="sortBy"
                class="w-full px-3 py-1.5 border border-purple-200 rounded"
              >
                <option value="date">Upload Date</option>
                <option value="name">File Name</option>
                <option value="size">File Size</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Grid View -->
        <div v-if="isGridView" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div 
            v-for="doc in filteredDocuments" 
            :key="doc.id"
            class="bg-white rounded-lg border border-purple-100 overflow-hidden hover:border-purple-200 transition-colors cursor-pointer"
            @click="selectDocument(doc)"
          >
            <div class="aspect-[4/3] bg-purple-50 flex items-center justify-center">
              <MaterialIcon 
                :name="getDocumentIcon(doc.filePath)" 
                size="text-3xl"
                color="text-purple-600"
              />
            </div>
            <div class="p-3">
              <h4 class="font-medium text-gray-900 truncate">{{ doc.title || getFileName(doc.filePath) }}</h4>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                  {{ getFileExtension(doc.filePath) }}
                </span>
                <span class="text-xs text-gray-500">
                  {{ formatFileSize(doc.fileSize) }}
                </span>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                {{ formatDate(doc.uploadDate) }}
              </p>
            </div>
          </div>
        </div>

        <!-- List View -->
        <div v-else class="bg-white rounded-lg border border-purple-100">
          <div class="overflow-hidden">
            <table class="min-w-full divide-y divide-purple-100">
              <thead class="bg-purple-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-purple-900">File Name</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-purple-900">Type</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-purple-900">Size</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-purple-900">Upload Date</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-purple-900">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-purple-100">
                <tr 
                  v-for="doc in filteredDocuments" 
                  :key="doc.id"
                  class="hover:bg-purple-50 transition-colors"
                >
                  <td class="px-4 py-3 whitespace-nowrap">
                    <div class="flex items-center">
                      <MaterialIcon 
                        :name="getDocumentIcon(doc.filePath)" 
                        size="text-sm"
                        color="text-purple-600"
                        class="mr-2"
                      />
                      <span class="text-sm text-gray-900">{{ doc.title || getFileName(doc.filePath) }}</span>
                    </div>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span class="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                      {{ getFileExtension(doc.filePath) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {{ formatFileSize(doc.fileSize) }}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(doc.uploadDate) }}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-right">
                    <button 
                      @click.stop="selectDocument(doc)"
                      class="p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded"
                    >
                      <MaterialIcon name="visibility" size="text-sm" />
                    </button>
                    <button 
                      @click.stop="downloadDocument(doc)"
                      class="p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded ml-1"
                    >
                      <MaterialIcon name="download" size="text-sm" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- PDF Viewer -->
    <PdfViewer
      v-if="selectedDoc"
      :current-document="selectedDoc.filePath"
      :document-metadata="selectedDoc"
      @close="selectedDoc = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MaterialIcon from '@/components/icons/MaterialIcon.vue'
import PdfViewer from './PdfViewer.vue'

interface Document {
  id: string
  filePath: string
  title?: string
  uploadDate: string
  pageCount: number
  fileSize: number
}

interface Props {
  documents: Document[]
}

const props = defineProps<Props>()

// State
const isGridView = ref(true)
const showFilter = ref(false)
const searchQuery = ref('')
const selectedType = ref('')
const sortBy = ref('date')
const selectedDoc = ref<Document | null>(null)

// Computed
const documentTypes = computed(() => {
  const types = new Set(props.documents.map(doc => getFileExtension(doc.filePath).toLowerCase()))
  return Array.from(types)
})

const filteredDocuments = computed(() => {
  let filtered = [...props.documents]

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(doc => 
      (doc.title || getFileName(doc.filePath)).toLowerCase().includes(query) ||
      doc.id.toLowerCase().includes(query)
    )
  }

  // Apply type filter
  if (selectedType.value) {
    filtered = filtered.filter(doc => 
      getFileExtension(doc.filePath).toLowerCase() === selectedType.value.toLowerCase()
    )
  }

  // Apply sorting
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return (a.title || getFileName(a.filePath)).localeCompare(b.title || getFileName(b.filePath))
      case 'size':
        return b.fileSize - a.fileSize
      default: // date
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    }
  })

  return filtered
})

// Methods
const toggleView = () => {
  isGridView.value = !isGridView.value
}

const toggleFilter = () => {
  showFilter.value = !showFilter.value
}

const selectDocument = (doc: Document) => {
  selectedDoc.value = doc
}

const getFileName = (path: string): string => {
  if (!path) return 'Unknown file'
  const parts = path.split('/')
  return parts[parts.length - 1] || path
}

const getFileExtension = (path: string): string => {
  const fileName = getFileName(path)
  const parts = fileName.split('.')
  if (parts.length > 1) {
    return parts[parts.length - 1].toUpperCase()
  }
  return 'UNKNOWN'
}

const getDocumentIcon = (path: string): string => {
  const extension = getFileExtension(path).toLowerCase()
  
  switch (extension) {
    case 'pdf':
      return 'picture_as_pdf'
    case 'doc':
    case 'docx':
      return 'description'
    case 'txt':
      return 'text_snippet'
    case 'xls':
    case 'xlsx':
      return 'table_chart'
    case 'ppt':
    case 'pptx':
      return 'slideshow'
    default:
      return 'insert_drive_file'
  }
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

const downloadDocument = async (doc: Document) => {
  try {
    const response = await fetch(doc.filePath)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = getFileName(doc.filePath)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading document:', error)
  }
}
</script>

<style scoped>
.document-management {
  width: 100%;
}

/* Smooth transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Table styles */
table {
  border-collapse: separate;
  border-spacing: 0;
}

th:first-child {
  border-top-left-radius: 0.5rem;
}

th:last-child {
  border-top-right-radius: 0.5rem;
}

tr:last-child td:first-child {
  border-bottom-left-radius: 0.5rem;
}

tr:last-child td:last-child {
  border-bottom-right-radius: 0.5rem;
}
</style>