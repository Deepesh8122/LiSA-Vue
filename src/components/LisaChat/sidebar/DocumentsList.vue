<template>
  <div class="px-4 py-3">
    <h3 class="text-sm font-medium text-stone-700 mb-3">Documents</h3>
    
    <!-- Loading state -->
    <div v-if="documentsStore.isLoading" class="text-xs text-stone-500">
      Loading documents...
    </div>

    <!-- Error state -->
    <div v-if="documentsStore.error" class="text-xs text-red-600 mb-2">
      {{ documentsStore.error }}
    </div>

    <!-- Documents list -->
    <div v-if="!documentsStore.isLoading && documentsStore.documents.length === 0" class="text-xs text-stone-500">
      No documents uploaded yet
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="document in documentsStore.documents"
        :key="document.id"
        class="flex items-center gap-2 p-2 rounded-lg hover:bg-stone-50 group"
      >
        <!-- PDF Icon -->
        <div class="p-1 bg-red-100 rounded">
          <FileIcon class="w-3 h-3 text-red-600" />
        </div>

        <!-- Document info -->
        <div class="flex-1 min-w-0">
          <div class="text-xs font-medium text-stone-700 truncate">
            {{ document.filename || document.title }}
          </div>
          <div class="text-xs text-stone-500">
            {{ formatFileSize(document.size) }} • {{ formatDate(document.created_at) }}
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            @click="askAboutDocument(document)"
            class="p-1 hover:bg-stone-200 rounded text-stone-500 hover:text-stone-700"
            title="Ask about this document"
          >
            <MessageIcon class="w-3 h-3" />
          </button>
          
          <button
            @click="deleteDocument(document.id)"
            class="p-1 hover:bg-red-100 rounded text-stone-500 hover:text-red-600"
            title="Delete document"
          >
            <DeleteIcon class="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/useAppStore.js'
import FileIcon from '@/components/icons/FileIcon.vue'
import MessageIcon from '@/components/icons/MessageIcon.vue'
import DeleteIcon from '@/components/icons/DeleteIcon.vue'

const { documentsStore, chatStore } = useAppStore()

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
}

const askAboutDocument = (document) => {
  const message = `What can you tell me about the document "${document.filename || document.title}"?`
  chatStore.sendMessage(message)
}

const deleteDocument = async (id) => {
  if (confirm('Are you sure you want to delete this document?')) {
    try {
      await documentsStore.deleteDocument(id)
    } catch (error) {
      console.error('Failed to delete document:', error)
    }
  }
}
</script>
