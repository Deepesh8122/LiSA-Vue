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
        class="flex flex-col gap-1 p-3 w-full rounded-lg transition-all duration-200 relative group"
        :class="{
          'bg-stone-100': activeConversation === conversation.id || props.currentSessionId === conversation.id.toString(),
          'hover:bg-stone-100': !loadingConversation || loadingConversation !== conversation.id,
          'cursor-wait': loadingConversation === conversation.id,
          'opacity-75': loadingConversation === conversation.id
        }"
        :disabled="loadingConversation === conversation.id"
      >
        <div class="flex flex-row gap-2 items-start">
          <div class="d-flex flex-column flex-grow">
            <div class="flex items-center gap-2 relative">
              <!-- Loading indicator -->
              <LoadingIndicator 
                v-if="loadingConversation === conversation.id"
                message="Loading chat..."
                class="absolute -left-1"
              />
              
              <!-- Regular icon (hidden during loading) -->
              <span class="text-lg transition-opacity duration-200" 
                    :class="{ 'opacity-0': loadingConversation === conversation.id }">
                {{ conversation.icon }}
              </span>
              
              <span class="flex-1 text-sm font-medium text-zinc-800 text-left truncate">
                {{ conversation.title }}
              </span>
            </div>
            
            <div class="flex items-start gap-2 text-xs text-gray-500">
              <span>{{ conversation.messageCount }} messages</span>
              <span class="truncate">{{ conversation.lastMessage }}</span>
            </div>
          </div>

          <!-- Right side actions -->
          <div class="flex items-center ml-auto">
            <!-- Dots Menu Trigger (hidden during loading) -->
            <div v-if="!loadingConversation && conversation.isDropDown" 
                 @click.stop="toggleDropdown(conversation.id)"
                 class="flex gap-1 p-1 h-6 w-6 rounded-full items-center justify-center hover:bg-stone-200 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                 :class="{'opacity-100 bg-stone-200': activeConversation === conversation.id}">
              <div class="rounded-full bg-stone-500 h-[3px] w-[3px]"></div>
              <div class="rounded-full bg-stone-500 h-[3px] w-[3px]"></div>
              <div class="rounded-full bg-stone-500 h-[3px] w-[3px]"></div>
            </div>

            <!-- Dropdown Menu -->
            <div v-if="activeDropdown === conversation.id && !loadingConversation"
                 class="absolute right-0 top-full mt-1 w-48 z-11 py-1 bg-white rounded-lg shadow-lg border border-stone-200">
              <button 
                v-for="item in menuItems" 
                :key="item.action"
                @click.stop="handleAction(item.action, conversation)"
                class="flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-stone-100"
                :class="item.class">
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
defineOptions({
  name: 'TimeSection'
})
import { ref, onMounted, onUnmounted } from 'vue'
import EditIcon from '@/components/icons/EditIcon.vue'
import DeleteIcon from '@/components/icons/DeleteIcon.vue'
import RenameIcon from '@/components/icons/RenameIcon.vue'
import ShareIcon from '@/components/icons/ShareIcon.vue'
import api from '@/services/api'
import LoadingIndicator from '@/components/LisaChat/shared/LoadingIndicator.vue'
import { useToast } from '@/composables/useToast'
import html2pdf from 'html2pdf.js'

interface Conversation {
  id: number;
  title: string;
  icon: string;
  isDropDown?: boolean;
  messageCount: number;
  lastMessage: string;
}

const props = defineProps<{
  title: string;
  conversations: Conversation[];
  currentSessionId?: string;
}>();

const emit = defineEmits<{
  (e: 'select', id: string, history?: any[]): void;
  (e: 'error', message: string): void;
  (e: 'deleted', id: string): void;
}>();

const { showSuccess, showError } = useToast();

const isCollapsed = ref(false);
const activeDropdown = ref<number | null>(null);
const activeConversation = ref<number | null>(null);
const loadingConversation = ref<string | null>(null);

const menuItems = [
  { label: 'Share', action: 'share', icon: ShareIcon, class: 'text-stone-700' },
  { label: 'Delete', action: 'delete', icon: DeleteIcon, class: 'text-red-600' },
]

interface PDFOptions {
  margin: number | number[];
  filename: string;
  image: {
    type: string;
    quality: number;
  };
  html2canvas: {
    scale: number;
    useCORS: boolean;
    logging: boolean;
    letterRendering: boolean;
  };
  jsPDF: {
    unit: string;
    format: string;
    orientation: string;
    compress: boolean;
    putOnlyUsedFonts: boolean;
    floatPrecision: number;
  };
}

// Function to export chat history to PDF
const exportToPDF = async (chatHistory: any[], title: string) => {
  try {
    // Create HTML content for PDF
    const content = document.createElement('div');
    content.innerHTML = `
      <div style="padding: 20px; font-family: 'Arial', sans-serif;">
        <!-- Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 20px; background: #ffffff; border-bottom: 1px solid #e5e7eb; margin-bottom: 30px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="/src/assets/LiSA_logo.png" alt="LiSA Logo" style="height: 40px;" />
            <h1 style="color: #4318FF; margin: 0; font-size: 24px;">Chat History</h1>
          </div>
          <div style="color: #666; font-size: 14px;">
            ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
          </div>
        </div>

        <!-- Chat Title -->
        <h2 style="color: #374151; margin-bottom: 20px; font-size: 20px;">${title}</h2>

        <!-- Chat Messages -->
        <div style="margin: 20px 0;">
          ${chatHistory.map(msg => `
            <div style="
              display: flex;
              flex-direction: column;
              margin: ${msg.role === 'user' ? '12px 0 12px auto' : '12px auto 12px 0'};
              max-width: 80%;
              ${msg.role === 'user' 
                ? 'background: #4318FF; color: white;' 
                : 'background: #f3f4f6; color: #1f2937;'}
              padding: 12px 16px;
              border-radius: 12px;
              ${msg.role === 'user' 
                ? 'border-bottom-right-radius: 4px;' 
                : 'border-bottom-left-radius: 4px;'}
            ">
              <div style="font-weight: 500; margin-bottom: 4px; font-size: 14px;">
                ${msg.role === 'user' ? 'You' : 'LiSA'}
              </div>
              <div style="font-size: 15px;">${msg.content}</div>
              <div style="font-size: 12px; color: ${msg.role === 'user' ? 'rgba(255,255,255,0.7)' : '#666'}; margin-top: 4px;">
                ${new Date(msg.timestamp || msg.created_at).toLocaleString()}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Footer -->
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #666; font-size: 12px;">
          Generated by LiSA | Powered by HA1 LTD.
        </div>
      </div>
    `;

    // Configure PDF options
    const options: PDFOptions = {
      margin: [15, 15, 15, 15], // [top, right, bottom, left]
      filename: `LiSA-Chat-${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true,
        putOnlyUsedFonts: true,
        floatPrecision: 16
      }
    };

    // Generate PDF
    await html2pdf().from(content).set(options).save();
    showSuccess('Chat history exported successfully');
  } catch (error) {
    console.error('Error exporting PDF:', error);
    showError('Failed to export chat history');
  }
};

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
  if (isCollapsed.value) {
    activeDropdown.value = null;
    activeConversation.value = null;
  }
}

const toggleDropdown = (id: number) => {
  if (activeDropdown.value === id) {
    activeDropdown.value = null;
    activeConversation.value = null;
    return;
  }
  activeDropdown.value = id;
  activeConversation.value = id;
}

const handleAction = async (action: string, conversation: Conversation) => {
  try {
    if (action === 'delete') {
      // Show confirmation dialog
      if (confirm('Are you sure you want to delete this chat session?')) {
        await api.deleteSession(conversation.id.toString());
        
        // Move to a new chat after deletion
        const newChatResponse = await api.createNewSession();
        if (newChatResponse?.data?.session_id) {
          // Emit deletion event first
          emit('deleted', conversation.id.toString());
          showSuccess('Chat session deleted successfully');
          
          // Then select the new chat
          handleSelect(newChatResponse.data.session_id);
        } else {
          emit('deleted', conversation.id.toString());
          showSuccess('Chat session deleted successfully');
        }
      }
    } else if (action === 'share') {
      // Show loading state
      loadingConversation.value = conversation.id.toString();
      // Export chat history as PDF
      const response = await api.getChatHistory(conversation.id.toString());
      if (response?.data) {
        await exportToPDF(response.data, conversation.title);
      }
    }
  } catch (error) {
    console.error(`Error performing ${action}:`, error);
    emit('error', `Failed to ${action} chat session`);
  } finally {
    loadingConversation.value = null;
    activeDropdown.value = null;
    activeConversation.value = null;
  }
}

const handleSelect = async (conversationId: string) => {
  // Don't do anything if this conversation is already loading
  if (loadingConversation.value === conversationId) return;
  
  console.log('Selected conversation:', conversationId);
  
  // Set loading state for this conversation
  loadingConversation.value = conversationId;
  activeConversation.value = conversationId as unknown as number;
  
  try {
    const response = await api.getChatHistory(conversationId);
    if (response && response.data) {
      // Map the data to ensure correct role property
      const mappedData = response.data.map(msg => ({
        ...msg,
        role: msg.role || (msg.sender === 'ai' ? 'assistant' : 'user')
      }));
      
      // Emit the conversation selection with mapped history data
      emit('select', conversationId, mappedData);
    }
  } catch (error: any) {
    console.error('Error loading chat history:', error);
    // Reset active conversation on error
    activeConversation.value = null;
    // Emit error for parent component to handle
    emit('error', error.message || 'Failed to load chat history. Please try again.');
  } finally {
    // Clear loading state
    loadingConversation.value = null;
    
    // Close dropdown if open
    activeDropdown.value = null;
  }
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.group')) {
    activeDropdown.value = null;
    activeConversation.value = null;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.truncate-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
