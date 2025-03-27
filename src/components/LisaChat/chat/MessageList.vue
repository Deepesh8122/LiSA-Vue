<template>
  <div 
    ref="chatContainer"
    class="flex overflow-y-auto flex-col-reverse flex-1 gap-8 px-6 py-4"
  >
    <div 
    v-for="(message, index) in reversedMessages" 
      :key="message.id"
      :class="{ 'ml-auto user-msg max-w-11/12 md:max-w-9/12': message.sender === 'user', 'ai-msg max-w-11/12 md:max-w-10/12': message.sender !== 'user' }"
      class="flex gap-4 items-start"
    >
      <!-- AI Avatar -->
      <div 
        v-if="message.sender === 'ai'"
        class="p-2 rounded-full border border-solid border-neutral-200 ai-msg"
      >
        <LisaIcon class="w-5 h-5 text-lisa-primary" />
      </div>

      <!-- Message Content -->
      <div 
        class="flex flex-col gap-3 max-w-3xl"
        :class="[
          message.sender === 'user' 
            ? 'bg-stone-100 ml-auto px-4 py-2' 
            : 'bg-white',
          'text-sm rounded-3xl text-stone-950'
        ]"
      >
        <!-- Text Content -->
        <div v-if="message.type === 'text'" v-html="message.content"></div>

        <!-- Image Content -->
        <div 
          v-else-if="message.type === 'image'" 
          class="rounded-lg overflow-hidden"
        >
          <img 
            :src="message.content" 
            :alt="message.alt || ''" 
            class="w-full max-w-xl h-auto rounded-lg"
            @click="openImagePreview(message.content)"
          >
        </div>

        <!-- Code Content -->
        <div 
          v-else-if="message.type === 'code'"
          class="relative"
        >
        <button 
          @click="copyCode(message.content)"
          class="p-1 text-xs text-stone-400 hover:text-stone-600 hover:bg-amber-300 h-7 w-7 rounded-2xl cursor-pointer absolute right-2 top-2 z-10"
        >
        <MaterialIcon 
          name="content_copy" 
          size="text-xs" 
          color="text-stone-400" 
        />
        </button>
          <pre class="bg-zinc-900 text-white p-4 rounded-lg overflow-x-auto">
            <code>{{ message.content }}</code>
          </pre>
        </div>

        <!-- File Content -->
        <div 
          v-else-if="message.type === 'file'"
          class="flex items-center gap-3 p-3 bg-stone-100 rounded-lg"
        >
          <div class="p-2 bg-[#4318FF] rounded-lg">
            <FileIcon class="w-4 h-4 text-white" />
          </div>
          <div class="flex-1">
            <div class="text-sm font-medium">{{ message.fileName }}</div>
            <div class="text-xs text-stone-500">{{ formatFileSize(message.fileSize) }}</div>
          </div>
          <button 
            @click="downloadFile(message.content)"
            class="p-2 hover:bg-stone-200 rounded-full cursor-pointer"
          >
            <DownloadIcon class="w-4 h-4 text-lisa-primary" />
          </button>
        </div>

        <!-- <div class="text-xs text-stone-400 mt-1">
          {{ formatTimestamp(message.timestamp) }}
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import MaterialIcon from '@/components/Icons/MaterialIcon.vue'
import LisaIcon from '@/components/Icons/LisaIcon.vue'
import FileIcon from '@/components/Icons/FileIcon.vue'
import DownloadIcon from '@/components/Icons/DownloadIcon.vue'

interface Message {
  id: number;
  sender: 'user' | 'ai';
  type: 'text' | 'image' | 'code' | 'file';
  content: string;
  timestamp: Date;
  alt?: string;
  fileName?: string;
  fileSize?: number;
}

const chatContainer = ref<HTMLElement | null>(null);
const messages = ref<Message[]>([
  {
    id: 1,
    sender: 'user',
    type: 'text',
    content: 'Can you show me how to implement a binary search tree in TypeScript?',
    timestamp: new Date()
  },
  {
    id: 2,
    sender: 'ai',
    type: 'code',
    content: `class TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;

  constructor(value: number) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}`,
    timestamp: new Date()
  },
  {
    id: 3,
    sender: 'ai',
    type: 'image',
    content: 'https://miro.medium.com/v2/resize:fit:1400/format:webp/1*tUBYCHi32Zj0B2UCw0qmlA.png',
    alt: 'Binary Search Tree Example',
    timestamp: new Date()
  },
  {
    id: 4,
    sender: 'ai',
    type: 'file',
    content: '/files/bst-implementation.ts',
    fileName: 'bst-implementation.ts',
    fileSize: 1024 * 15, // 15KB
    timestamp: new Date()
  },
  {
    id: 5,
    sender: 'user',
    type: 'text',
    content: "Explain superconductors like I'm five years old.",
    timestamp: new Date()
  },
  {
    id: 6,
    sender: 'ai',
    type: 'text',
    content: "Sure! Imagine you have a slide in a playground. When you slide down, you can go really fast because the slide is smooth and slippery. <br /><br /> Now, think about electricity like little cars driving on a road. Normally, the road has bumps and cracks, so the cars can't go super fast and sometimes get stuck. <br /><br /> But in a superconductor, the road is perfectly smooth like the playground slide. This means the little cars (electricity) can zoom super fast without getting stuck or slowed down. <br /> <br /> Superconductors are special materials that make this super smooth road for electricity, but they only work when they are really, really cold, like as cold as outer space!",
    timestamp: new Date()
  },
  {
    id: 7,
    sender: 'user',
    type: 'text',
    content: "Now explain it like I'm a physicist",
    timestamp: new Date()
  },
  {
    id: 8,
    sender: 'ai',
    type: 'text',
    content: "Certainly! Here's a more detailed explanation: <br><br><br>Superconductors are materials that exhibit zero electrical resistance and expel magnetic fields below a critical temperature, discovered by Heike Kamerlingh Onnes in 1911.<br><br>In normal conductors, electron scattering causes electrical resistance. However, in superconductors, electrons form Cooper pairs that move without scattering, resulting in zero resistance and the Meissner effect (magnetic field expulsion).<br><br>Conventional superconductors are explained by BCS theory through electron-phonon interactions, while high-temperature superconductor mechanisms remain under study. Applications include MRI machines, particle accelerators, maglev trains, and quantum computing.",
    timestamp: new Date()
  },
]);

const formatTimestamp = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const copyCode = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code);
    // You might want to add a toast notification here
  } catch (err) {
    console.error('Failed to copy code:', err);
  }
};

const openImagePreview = (src: string) => {
  // Implement image preview modal
  console.log('Opening preview for:', src);
};

const downloadFile = (url: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = url.split('/').pop() || 'download';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Scroll to bottom on new messages
watch(() => messages.value.length, () => {
  setTimeout(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  }, 100);
});

onMounted(() => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
});

const reversedMessages = computed(() => {
  return [...messages.value].reverse()
})
</script>

<style scoped>
.flex-col-reverse {
  display: flex;
  flex-direction: column-reverse;
}
</style>