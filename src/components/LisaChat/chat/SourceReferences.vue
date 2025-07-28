<template>
  <div v-if="sources.length > 0" class="source-references border border-purple-200 rounded-lg p-4 bg-purple-50">
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
          class="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
        >
          <MaterialIcon name="download" size="text-sm" />
          Export List
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

const isExpanded = ref(props.expanded)
const showAll = ref(false)
const isExporting = ref(false)
const { showSuccess, showError, showInfo } = useToast()

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
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
  const extension = getFileExtension(source).toLowerCase()
  
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
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return 'image'
    case 'mp4':
    case 'avi':
    case 'mov':
      return 'movie'
    case 'mp3':
    case 'wav':
      return 'audiotrack'
    default:
      return 'insert_drive_file'
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
