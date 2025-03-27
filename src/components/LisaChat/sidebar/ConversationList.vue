<template>
  <div class="flex flex-col overflow-y-hidden h-full">
    <SearchBar class="sticky top-0 z-10 mb-3" @search="filterConversations" />
    <div class="flex-1 px-4 pb-3 overflow-y-auto h-full">
      <TimeSection
        v-for="(section, index) in filteredSections"
        :key="index"
        :title="section.title"
        :conversations="section.conversations"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import SearchBar from './SearchBar.vue'
import TimeSection from './TimeSection.vue'

interface Conversation {
  id: number;
  title: string;
  icon: string;
  isDropDown?: boolean;
}

interface Section {
  title: string;
  conversations: Conversation[];
}

const sections = ref<Section[]>([
  {
    title: 'Today',
    conversations: [
      { id: 1, title: 'Amsterdam trip with the boys', icon: '🤖', isDropDown: true },
      { id: 2, title: 'Code Review', icon: 'CR', isDropDown: true },
      { id: 3, title: 'Bug Analysis', icon: 'BA', isDropDown: true }
    ]
  },
  {
    title: 'Previous 7 Days',
    conversations: [
      { id: 4, title: 'Feature Planning', icon: 'FP', isDropDown: true },
      { id: 5, title: 'Design Review', icon: '🎨', isDropDown: true },
      { id: 6, title: '3 day itinerary in the South of France', icon: '🎨', isDropDown: true }
    ]
  },
  {
    title: 'Previous 30 Days',
    conversations: [
      { id: 7, title: 'Superconductors: Smooth Roads', icon: 'FP', isDropDown: true },
      { id: 8, title: 'Excited About a Job Opportunity', icon: '🎨', isDropDown: true },
      { id: 9, title: 'Fun fact about the Roman Empire', icon: '🎨', isDropDown: true },
      { id: 10, title: 'Marble Statue Pizza Cigar.', icon: '🎨', isDropDown: true },
      { id: 11, title: 'Gradient Background Pack Giveaway', icon: '🎨', isDropDown: true },
      { id: 12, title: 'Fern Gully, the Chief Leaf Officer', icon: '🎨', isDropDown: true },
      { id: 13, title: 'Design an Uber-like app', icon: '🎨', isDropDown: true },
    ]
  }
]);

const searchTerm = ref('')

const filterConversations = (query: string) => {
  searchTerm.value = query.toLowerCase()
}

const filteredSections = computed(() => {
  if (!searchTerm.value) return sections.value

  return sections.value.map(section => ({
    ...section,
    conversations: section.conversations.filter(conv => 
      conv.title.toLowerCase().includes(searchTerm.value)
    )
  })).filter(section => section.conversations.length > 0)
})
</script>