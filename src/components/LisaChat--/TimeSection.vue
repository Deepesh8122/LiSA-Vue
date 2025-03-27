<template>
  <section class="flex flex-col items-start w-full text-left">
    <h2 class="flex-1 p-2 text-[12px] font-medium w-full text-stone-500 sticky bg-stone-50 top-0 z-10">
      {{ title }}
    </h2>
    <div 
      v-for="(chat, index) in chats"
      :key="index"
      class="group relative flex items-center justify-between w-full px-2 py-3 h-8 rounded-lg"
      :class="{'bg-stone-200': activeDropdown === index, 'hover:bg-stone-200': activeDropdown !== index}"
    >
      <button class="text-sm text-stone-950 text-left overflow-hidden overflow-ellipsis whitespace-nowrap overflow-hidden">
        {{ chat }}
      </button>
      <div class="relative group-hover:opacity-100" :class="{'opacity-100': activeDropdown === index || isHovered(index), 'opacity-0': !isHovered(index) && activeDropdown !== index}">
        <button 
          @click="(e) => toggleDropdown(index, e)"
          class="dropdown-trigger items-center justify-center w-6 h-6 rounded-full"
          :class="{'bg-stone-300': activeDropdown === index, 'hover:bg-stone-300': activeDropdown !== index}"
        >
          <span class="text-stone-500">•••</span>
        </button>
        <!-- Dropdown Menu -->
        <div 
          v-show="activeDropdown === index"
          class="dropdown-menu absolute right-0 mt-1 w-40 py-2 bg-white rounded-lg shadow-lg z-20 border border-stone-200"
        >
          <button 
            v-for="(item, i) in menuItems" 
            :key="i"
            @click="handleMenuClick(item.action, chat)"
            class="w-full px-4 py-2 text-left text-sm text-stone-700 hover:bg-stone-100"
          >
            {{ item.label }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  title: string;
  chats: string[];
}>();

const activeDropdown = ref<number | null>(null);
const hoveredIndex = ref<number | null>(null);

const menuItems = [
  { label: 'Rename', action: 'rename' },
  { label: 'New', action: 'new' },
  { label: 'Delete', action: 'delete' }
];

const isHovered = (index: number): boolean => {
  return hoveredIndex.value === index;
};

const toggleDropdown = (index: number, event: Event) => {
  event.stopPropagation();
  // Close any open dropdown if clicking a different one
  if (activeDropdown.value !== null && activeDropdown.value !== index) {
    activeDropdown.value = null;
  }
  activeDropdown.value = activeDropdown.value === index ? null : index;
};

const handleMenuClick = (action: string, chat: string) => {
  console.log(`Action: ${action} for chat: ${chat}`);
  activeDropdown.value = null;
  hoveredIndex.value = null;
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const isDropdownButton = target.closest('.dropdown-trigger');
  const isDropdownMenu = target.closest('.dropdown-menu');

  if (!isDropdownButton && !isDropdownMenu) {
    activeDropdown.value = null;
    hoveredIndex.value = null;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>