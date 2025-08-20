<template>
  <div class="flex flex-col gap-3.5">
    <!-- Collapsible Header -->
    <button 
      @click="toggleCollapse"
      class="flex items-center justify-between sticky top-0 z-10 bg-white w-full p-2 hover:bg-stone-100 rounded-lg group"
    >
      <h2 class="text-sm font-bold text-stone-500">{{ title }}</h2>
      <svg 
        class="w-4 h-4 text-stone-500 transition-transform duration-200"
        :class="{ 'rotate-180': isCollapsed }"
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor"
      >
        <path d="M19 9l-7 7-7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- Conversation List -->
    <div v-show="!isCollapsed" class="space-y-1">
      <button
        v-for="conversation in conversations"
        :key="conversation.id"
        :id="conversation.id"
        @click="handleSelect(conversation.id)" 
        class="flex flex-col gap-1 p-3 w-full rounded-lg transition-colors relative group hover:bg-stone-100"
        :class="{'bg-stone-100': activeConversation === conversation.id}"
      >
        <div class="flex flex-row gap-2">
          <div class="d-flex flex-column">
            <div class="flex items-center gap-2">
              <span class="text-lg">{{ conversation.icon }}</span>
              <span class="flex-1 text-sm font-medium text-zinc-800 text-left truncate">
                {{ conversation.title }}
              </span>
              <!-- <span class="text-xs text-gray-500">
                {{ formatTime(conversation.timestamp) }}
              </span> -->
            </div>
            
            <div class="flex items-start gap-2 text-xs text-gray-500">
              <!-- <span>{{ conversation.messageCount }} messages</span> -->
              <span class="truncate">{{ conversation.lastMessage }}</span>
            </div>
          </div>
          <div class="flex items-center ml-auto">
            <!-- Dots Menu Trigger -->
        <div 
          v-if="conversation.isDropDown" 
          @click.stop="toggleDropdown(conversation.id)"
          class="flex gap-1 p-1 h-6 w-6 rounded-full items-center justify-center hover:bg-stone-200 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
          :class="{'opacity-100 bg-stone-200': activeConversation === conversation.id}"
        >
          <div class="rounded-full bg-stone-500 h-[3px] w-[3px]"></div>
          <div class="rounded-full bg-stone-500 h-[3px] w-[3px]"></div>
          <div class="rounded-full bg-stone-500 h-[3px] w-[3px]"></div>
        </div>

        <!-- Dropdown Menu -->
        <div 
          v-if="activeDropdown === conversation.id"
          class="absolute right-0 top-full mt-1 w-48 z-11 py-1 bg-white rounded-lg shadow-lg border border-stone-200"
        >
          <button 
            v-for="item in menuItems" 
            :key="item.action"
            @click.stop="handleAction(item.action, conversation)"
            class="flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-stone-100"
            :class="item.class"
          >
            <component :is="item.icon" class="w-4 h-4" />
            {{ item.label }}
          </button>
        </div>
          </div>
        </div>
        
        
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import EditIcon from '@/components/icons/EditIcon.vue'
import DeleteIcon from '@/components/icons/DeleteIcon.vue'
import RenameIcon from '@/components/icons/RenameIcon.vue'

interface Conversation {
  id: number;
  title: string;
  icon: string;
  isDropDown?: boolean;
}

defineProps<{
  title: string;
  conversations: Conversation[];
}>()

const emit = defineEmits<{
  (e: 'select', id: string): void;
  (e: 'hover', content: string): void;
}>();

const isCollapsed = ref(false)
const activeDropdown = ref<number | null>(null)
const activeConversation = ref<number | null>(null)

const menuItems = [
  { label: 'Edit', action: 'edit', icon: EditIcon, class: 'text-stone-700' },
  { label: 'Rename', action: 'rename', icon: RenameIcon, class: 'text-stone-700' },
  { label: 'Delete', action: 'delete', icon: DeleteIcon, class: 'text-red-600' },
  { label: 'View History', action: 'history', icon: DeleteIcon, class: 'text-blue-600' }
]

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  if (isCollapsed.value) {
    activeDropdown.value = null
    activeConversation.value = null
  }
}

const toggleDropdown = (id: number) => {
  if (activeDropdown.value === id) {
    activeDropdown.value = null
    activeConversation.value = null
    return
  }
  activeDropdown.value = id
  activeConversation.value = id
}

const handleAction = (action: string, conversation: Conversation) => {
  console.log(`${action} conversation:`, conversation)

  if (action === 'history') {
    // Replace this with your modal logic
    window.parent.postMessage({ type: 'SHOW_HISTORY_MODAL', payload: conversation }, '*')
  }

  activeDropdown.value = null
  activeConversation.value = null
}

const handleSelect = (conversationId: string) => {
  console.log('Selected conversation:', conversationId);
  emit('select', conversationId);
  // Close dropdown if open
  activeDropdown.value = null;
  activeConversation.value = null;
};

const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (days < 7) {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]
  } else {
    return date.toLocaleDateString()
  }
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.group')) {
    activeDropdown.value = null
    activeConversation.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.truncate-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
