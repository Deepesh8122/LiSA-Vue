<template>
  <div v-if="visible" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black opacity-50" @click="$emit('close')"></div>
      
      <!-- Modal -->
      <div class="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <!-- Header -->
        <div class="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-semibold">Chat History</h3>
          <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
            <MaterialIcon name="close" size="text-xl" />
          </button>
        </div>
        
        <!-- Content -->
        <div class="p-4 overflow-y-auto max-h-[60vh]">
          <div v-if="loading" class="text-center py-4">Loading history...</div>
          <div v-else-if="error" class="text-red-500 text-center py-4">{{ error }}</div>
          <div v-else class="space-y-4">
            <div v-for="message in messages" :key="message.id" 
                 class="p-3 rounded-lg" 
                 :class="message.role === 'user' ? 'bg-gray-100' : 'bg-blue-50'">
              <div class="flex items-start gap-2">
                <span class="font-semibold">{{ message.role === 'user' ? 'You' : 'LiSA' }}:</span>
                <span>{{ message.content }}</span>
              </div>
              <div class="text-xs text-gray-500 mt-1">
                {{ new Date(message.timestamp).toLocaleString() }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import MaterialIcon from '@/components/icons/MaterialIcon.vue';
import api from '@/services/api';

const props = defineProps<{
  visible: boolean;
  sessionId: string;
}>();

defineEmits(['close']);

const loading = ref(false);
const error = ref('');
const messages = ref<any[]>([]);

const fetchHistory = async () => {
  if (!props.sessionId) return;
  
  loading.value = true;
  error.value = '';
  
  try {
    const response = await api.getChatHistory(props.sessionId);
    messages.value = response.data;
  } catch (err) {
    console.error('Error fetching history:', err);
    error.value = 'Failed to load chat history';
  } finally {
    loading.value = false;
  }
};

watch(() => props.visible, (newValue) => {
  if (newValue) {
    fetchHistory();
  }
});
</script>
