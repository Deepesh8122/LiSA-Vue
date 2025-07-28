<template>
  <div class="document-summary border border-green-200 rounded-lg p-4 bg-green-50">
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <MaterialIcon name="description" size="text-sm" color="text-white" />
        </div>
        <div>
          <h3 class="font-semibold text-green-900">Document Summary</h3>
          <p class="text-sm text-green-700">{{ summary.filename }}</p>
        </div>
      </div>
      <button 
        @click="toggleExpanded"
        class="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded"
      >
        <MaterialIcon 
          :name="isExpanded ? 'expand_less' : 'expand_more'" 
          size="text-base" 
        />
      </button>
    </div>

    <!-- Summary Type Badge -->
    <div class="mb-3">
      <span class="inline-flex items-center px-2 py-1 bg-green-200 text-green-800 rounded-full text-sm font-medium">
        <MaterialIcon name="auto_awesome" size="text-sm" color="text-green-600" class="mr-1" />
        {{ summary.summary_type.charAt(0).toUpperCase() + summary.summary_type.slice(1) }} Summary
      </span>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-2 gap-4 mb-3">
      <div class="text-center">
        <div class="text-lg font-semibold text-green-900">{{ summary.word_count.toLocaleString() }}</div>
        <div class="text-xs text-green-700">Total Words</div>
      </div>
      <div class="text-center">
        <div class="text-lg font-semibold text-blue-900">{{ summary.key_points.length }}</div>
        <div class="text-xs text-blue-700">Key Points</div>
      </div>
    </div>

    <!-- Summary Content Preview -->
    <div class="bg-white rounded-lg p-3 mb-3">
      <h4 class="font-medium text-gray-900 mb-2 flex items-center gap-1">
        <MaterialIcon name="summarize" size="text-sm" color="text-gray-600" />
        Summary
      </h4>
      <div class="text-sm text-gray-700 leading-relaxed">
        {{ getSummaryPreview() }}
      </div>
      <button 
        v-if="needsReadMore"
        @click="toggleSummaryExpanded"
        class="mt-2 text-green-600 hover:text-green-800 text-sm font-medium"
      >
        {{ isSummaryExpanded ? 'Show less' : 'Read more' }}
      </button>
    </div>

    <!-- Key Points -->
    <div v-if="summary.key_points.length > 0" class="bg-white rounded-lg p-3 mb-3">
      <h4 class="font-medium text-gray-900 mb-2 flex items-center gap-1">
        <MaterialIcon name="checklist" size="text-sm" color="text-gray-600" />
        Key Points
      </h4>
      <ul class="space-y-2">
        <li 
          v-for="(point, index) in displayedKeyPoints" 
          :key="index"
          class="flex items-start gap-2 text-sm text-gray-700"
        >
          <div class="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
            <span class="text-xs font-medium text-green-600">{{ index + 1 }}</span>
          </div>
          <span>{{ point }}</span>
        </li>
      </ul>
      <button 
        v-if="summary.key_points.length > 3"
        @click="toggleKeyPointsExpanded"
        class="mt-2 text-green-600 hover:text-green-800 text-sm font-medium"
      >
        {{ showAllKeyPoints ? 'Show less' : `Show ${summary.key_points.length - 3} more points` }}
      </button>
    </div>

    <!-- Expandable Details -->
    <div v-if="isExpanded" class="border-t border-green-200 pt-3 space-y-4">
      <!-- Document Information -->
      <div class="bg-white rounded-lg p-3">
        <h4 class="font-medium text-gray-900 mb-2">Document Information</h4>
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span class="text-gray-600">Document ID:</span>
            <span class="ml-1 font-medium">{{ summary.document_id.substring(0, 8) }}...</span>
          </div>
          <div>
            <span class="text-gray-600">Summary Type:</span>
            <span class="ml-1 font-medium">{{ summary.summary_type }}</span>
          </div>
          <div>
            <span class="text-gray-600">Word Count:</span>
            <span class="ml-1 font-medium">{{ summary.word_count.toLocaleString() }}</span>
          </div>
          <div>
            <span class="text-gray-600">Key Points:</span>
            <span class="ml-1 font-medium">{{ summary.key_points.length }}</span>
          </div>
        </div>
      </div>

      <!-- Full Summary -->
      <div class="bg-white rounded-lg p-3">
        <h4 class="font-medium text-gray-900 mb-2">Full Summary</h4>
        <div class="text-sm text-gray-700 leading-relaxed max-h-64 overflow-y-auto">
          <div v-html="formatSummaryContent(summary.summary)"></div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2">
        <button class="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
          <MaterialIcon name="download" size="text-sm" />
          Download Summary
        </button>
        <button class="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm">
          <MaterialIcon name="share" size="text-sm" />
          Share Summary
        </button>
      </div>
    </div>

    <!-- Success Message -->
    <div class="mt-2 text-sm text-green-700">
      {{ summary.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MaterialIcon from '@/components/icons/MaterialIcon.vue'
import type { SummaryResult } from '@/services/responseParser'

interface Props {
  summary: SummaryResult
  expanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  expanded: false
})

const isExpanded = ref(props.expanded)
const isSummaryExpanded = ref(false)
const showAllKeyPoints = ref(false)

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

const toggleSummaryExpanded = () => {
  isSummaryExpanded.value = !isSummaryExpanded.value
}

const toggleKeyPointsExpanded = () => {
  showAllKeyPoints.value = !showAllKeyPoints.value
}

const needsReadMore = computed(() => {
  return props.summary.summary.length > 300
})

const getSummaryPreview = (): string => {
  if (!needsReadMore.value || isSummaryExpanded.value) {
    return props.summary.summary
  }
  return props.summary.summary.substring(0, 300) + '...'
}

const displayedKeyPoints = computed(() => {
  if (showAllKeyPoints.value || props.summary.key_points.length <= 3) {
    return props.summary.key_points
  }
  return props.summary.key_points.slice(0, 3)
})

const formatSummaryContent = (content: string): string => {
  if (!content) return 'No summary content available'
  
  // Convert line breaks to HTML breaks
  return content.replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text
}

// Computed properties for additional functionality
const summaryStats = computed(() => {
  return {
    wordCount: props.summary.word_count,
    keyPointsCount: props.summary.key_points.length,
    summaryLength: props.summary.summary.length,
    summaryType: props.summary.summary_type
  }
})

const documentInfo = computed(() => {
  return {
    id: props.summary.document_id,
    filename: props.summary.filename,
    type: props.summary.summary_type
  }
})
</script>

<style scoped>
.document-summary {
  transition: all 0.3s ease;
}

.document-summary:hover {
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.15);
}

/* Custom scrollbar for full summary */
.max-h-64::-webkit-scrollbar {
  width: 4px;
}

.max-h-64::-webkit-scrollbar-track {
  background: transparent;
}

.max-h-64::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

.max-h-64::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

/* Key points animation */
.space-y-2 > li {
  animation: slideInLeft 0.3s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
