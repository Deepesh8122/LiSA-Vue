<template>
  <div class="flex flex-col gap-3.5">
    <h2 class="text-sm font-bold text-stone-500">{{ title }}</h2>
    <button
      v-for="conversation in conversations"
      :key="conversation.id"
      class="flex gap-3 items-center px-3 py-3 rounded-lg hover:bg-neutral-100 transition-colors"
    >
      <div
        v-if="conversation.isLetter"
        class="px-1.5 py-px text-xs text-white bg-blue-600 rounded"
      >
        {{ conversation.icon }}
      </div>
      <div v-else class="text-xl">{{ conversation.icon }}</div>
      <div class="flex-1 text-sm text-zinc-800">{{ conversation.title }}</div>
      <div v-if="conversation.isLetter" class="flex gap-1">
        <div class="rounded-full bg-stone-500 h-[3px] w-[3px]"></div>
        <div class="rounded-full bg-stone-500 h-[3px] w-[3px]"></div>
        <div class="rounded-full bg-stone-500 h-[3px] w-[3px]"></div>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Conversation {
  id: number;
  title: string;
  icon: string;
  isLetter?: boolean;
}

defineProps<{
  title: string;
  conversations: Conversation[];
}>();
</script>
