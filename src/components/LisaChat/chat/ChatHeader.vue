<template>
  <header class="flex justify-between items-center p-4 border-b border-solid border-b-gray-200">
        <!-- Left Side Buttons -->
        <div class="flex gap-3 items-center">
          <button 
            v-for="(action, index) in actions" 
            :key="index"
            class="p-1 rounded-lg transition-colors h-8 min-w-8 items-center justify-center cursor-pointer"
            :class="action.class"
            :aria-label="action.label"
            @click="action.onClick"
            v-tooltip="'Enter your username'" type="text" placeholder="Right"
          >
            <MaterialIcon 
              :name="action.icon" 
              size="base" 
            />
            <p>
              {{action.label}}
            </p>
          </button>
        </div>
        
    <!-- Model Selector -->
    <div class="relative" ref="dropdownRef">
      <button
        @click="toggleDropdown"
        class="flex items-center gap-3 px-3 py-1 rounded-lg bg-neutral-200 hover:bg-neutral-300 transition-colors cursor-pointer min-w-[160px]"
      >
        <div class="flex flex-col items-start">
          <div class="text-sm font-bold text-zinc-800">{{ selectedModel.name }}</div>
          <!-- <div class="text-xs text-stone-500">{{ selectedModel.description }}</div> -->
        </div>
        <span 
          class="material-symbols-outlined text-stone-600 transition-transform duration-200 ml-auto cursor-pointer"
          :class="{ 'rotate-180': isDropdownOpen }"
        >
          expand_more
        </span>
      </button>

      <!-- Dropdown Menu -->
      <div 
        v-show="isDropdownOpen"
        class="absolute top-full right-0 mt-2 w-[320px] bg-white rounded-xl shadow-lg border border-stone-200 z-50"
      >
        <div class="p-2 flex items-center justify-between border-b border-stone-100">
          <div class="text-sm text-stone-500">Select a model</div>
          <MaterialIcon 
            name="info" 
            size="sm" 
            color="text-stone-400" 
            customClass="hover:text-stone-600 p-2 rounded-full hover:bg-stone-100 cursor-pointer"
          />
        </div>

        <div class="p-2">
          <button
            v-for="model in models"
            :key="model.id"
            @click="selectModel(model)"
            class="flex items-start gap-3 w-full p-3 rounded-lg transition-colors cursor-pointer"
            :class="[
              selectedModel.id === model.id ? 'bg-neutral-100' : 'hover:bg-neutral-50'
            ]"
          >
            <MaterialIcon 
              :name="model.icon"
              size="lg"
              :color="selectedModel.id === model.id ? 'text-lisa-primary' : 'text-stone-400'"
            />
            <div class="flex flex-col items-start">
              <span class="text-sm font-medium text-zinc-800">{{ model.name }}</span>
              <span class="text-xs text-stone-500">{{ model.description }}</span>
            </div>
          </button>
        </div>
        
        <div class="px-2 pb-2">
          <div class="h-px bg-stone-100 my-1"></div>
          <button 
            @click="startTempChat"
            class="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <MaterialIcon 
              name="timer"
              size="base"
              color="text-stone-500"
            />
            <span class="text-sm text-stone-600">Temporary chat</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import MaterialIcon from '@/components/Icons/MaterialIcon.vue'

interface Model {
  id: number
  name: string
  description: string
  icon: string
}

const models: Model[] = [
  {
    id: 1,
    name: 'LiSA-1.o',
    description: 'Newest and most advanced model',
    icon: 'rocket_launch'
  },
  {
    id: 2,
    name: 'LiSA-2.o',
    description: 'Advanced model for complex tasks',
    icon: 'network_intel_node'
  },
  {
    id: 3,
    name: 'LiSA-3.o',
    description: 'Great for everyday tasks',
    icon: 'lightbulb'
  }
]
const actions = computed(() => [
  {
    icon: props.isSidebarOpen ? 'menu' : 'dock_to_left',
    label: '',
    class: props.isSidebarOpen ? 'shows hidden' : 'hide flex bg-neutral-200 hover:bg-neutral-300',
    onClick: () => emit('toggle-sidebar')
  },
  {
    icon: 'add',
    label: 'New Chat',
    class: 'flex bg-[#4318FF] text-white hover:bg-[#4318FF] px-2 pr-3',
    onClick: () => console.log('Clear chat')
  },
    // {
  //   icon: 'add',
  //   label: 'New chat',
  //   class: 'bg-neutral-100 hover:bg-neutral-200',
  //   onClick: () => console.log('New chat')
  // },
])

interface Props {
  isSidebarOpen: boolean
}


const props = defineProps<Props>()
const emit = defineEmits(['toggle-sidebar'])
const dropdownRef = ref<HTMLElement | null>(null)
const isDropdownOpen = ref(false)
const selectedModel = ref(models[0])

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const selectModel = (model: Model) => {
  selectedModel.value = model
  isDropdownOpen.value = false
}

const startTempChat = () => {
  console.log('Starting temporary chat')
  isDropdownOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>