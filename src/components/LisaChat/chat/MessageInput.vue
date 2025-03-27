<template>
  <div
    class="pt-6 pb-6 max-md:px-6 max-md:py-6 "
  >
    <div
      class="relative rounded-xl flex items-end gap-4 border border-solid bg-stone-50 border-stone-300 p-4 w-full max-md:w-full"
    >
    <div class="file-upload">
      <button aria-label="Attach file" class="group p-1.5 cursor-pointer flex items-center justify-center rounded-full h-8 w-8 bg-neutral-200 hover:bg-[#4318FF] transition-colors">
          <MaterialIcon 
          name="attach_file" 
          size="text-xs" 
          color="text-stone-400 group-hover:text-white" 
        />
        </button>
    </div>
      <div class="chat-box w-full">
        <input
        type="text"
        class="w-full py-2 h-full bg-transparent outline-none"
        placeholder="Type your message..."
      />
      </div>
      <div class="send-area flex gap-3 items-center"
      >
        <button aria-label="Attach file" class="group p-1.5 cursor-pointer flex items-center justify-center rounded-full h-8 w-8 bg-neutral-200 hover:bg-[#4318FF] transition-colors">
          <MaterialIcon 
          name="mic" 
          size="text-xs" 
          color="text-stone-400 group-hover:text-white" 
        />
        </button>

        <button
          class="group p-1.5 cursor-pointer flex items-center justify-center rounded-full h-8 w-8 bg-neutral-200 hover:bg-[#4318FF] transition-colors"
          aria-label="Send message"
        >
        <MaterialIcon 
          name="send" 
          size="text-xs" 
          color="text-stone-400 group-hover:text-white" 
        />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue' 
import MaterialIcon from '@/components/Icons/MaterialIcon.vue'

const props = defineProps<{
  (e: 'message', message: string): void
}>()
</script>