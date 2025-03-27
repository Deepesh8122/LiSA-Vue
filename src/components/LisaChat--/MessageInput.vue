<template>
  <footer class="flex flex-col gap-2.5 items-center px-6 pt-0 pb-5 bg-white">
    <div
      class="flex flex-col gap-4 justify-center items-start py-2 pr-2 pl-4 w-full rounded-xl border border-stone-300 max-w-[768px]"
    >
      <p class="text-sm text-stone-500" contenteditable="true">Message LiSA</p>
      <!-- <textarea name="" id="" cols="30" rows="10">Message LiSA</textarea> -->
      <div class="flex justify-between items-center w-full">
        <button
          class="flex gap-2.5 items-center hover:bg-stone-50 p-2 rounded-lg"
          aria-label="Record audio"
        >
          <MicrophoneIcon />
        </button>
        <div class="flex gap-2.5 items-center">
          <button
            class="flex gap-2.5 items-center hover:bg-stone-50 p-2 rounded-lg"
            aria-label="Start recording"
          >
            <RecordIcon />
          </button>
          <button
            class="flex gap-2.5 items-center p-1.5 w-7 rounded-2xl bg-neutral-200 hover:bg-neutral-300"
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import MicrophoneIcon from "./ChatIcons/MicrophoneIcon.vue";
import RecordIcon from "./ChatIcons/RecordIcon.vue";
import SendIcon from "./ChatIcons/SendIcon.vue";
</script>
