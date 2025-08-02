<!-- ChatHistoryModal.vue -->
<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="bg-white max-w-md w-full rounded-xl p-6 shadow-xl" @mouseleave="close">
      <h2 class="text-lg font-bold mb-4">Full Chat</h2>
      <div class="max-h-96 overflow-y-auto space-y-2">
        <div
          v-for="(msg, i) in messages"
          :key="i"
          :class="msg.role === 'user' ? 'text-left' : 'text-left'"
          class="bg-gray-100 p-2 rounded"
        >
          <span class="block text-sm font-medium">{{ msg.role.toUpperCase() }}</span>
          <span class="block text-base">{{ msg.content }}</span>
          <span class="block text-xs text-gray-500">{{ formatTime(msg.timestamp) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  visible: boolean
  messages: { role: string; content: string; timestamp: string }[]
}>()

const emit = defineEmits(['close'])

const close = () => emit('close')

const formatTime = (ts: string) => new Date(ts).toLocaleString()
</script>
