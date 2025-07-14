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
      { id: 1, title: 'Lease agreement summary for Unit 22', icon: 'LA', isDropDown: true },
      { id: 2, title: 'Maintenance request: AC not working', icon: '🛠️', isDropDown: true },
      { id: 3, title: 'Tenant payment status update', icon: '💳', isDropDown: true }
    ]
  },
  {
    title: 'Previous 7 Days',
    conversations: [
      { id: 4, title: 'Schedule property inspection', icon: '📅', isDropDown: true },
      { id: 5, title: 'Discuss rent increase notice', icon: '📈', isDropDown: true },
      { id: 6, title: 'Review tenant feedback', icon: '🗣️', isDropDown: true }
    ]
  },
  {
    title: 'Previous 30 Days',
    conversations: [
      { id: 7, title: 'Resolve plumbing issue in Apt 5', icon: '🚰', isDropDown: true },
      { id: 8, title: 'Send renewal reminder to tenants', icon: '🔔', isDropDown: true },
      { id: 9, title: 'Update property listing details', icon: '🏠', isDropDown: true },
      { id: 10, title: 'Confirm move-out inspection date', icon: '📆', isDropDown: true },
      { id: 11, title: 'Handle security deposit queries', icon: '💰', isDropDown: true },
      { id: 12, title: 'Review cleaning service contract', icon: '🧹', isDropDown: true },
      { id: 13, title: 'Discuss pet policy changes', icon: '🐾', isDropDown: true },
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