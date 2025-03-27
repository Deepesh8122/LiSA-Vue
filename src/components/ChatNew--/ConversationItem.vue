<template>
  <article
    :class="[
      'flex gap-4 py-5 pr-11 pl-4 mt-6 rounded-2xl border border-solid',
      isActive ? 'bg-blue-50 border-blue-600' : 'bg-white border-gray-200',
    ]"
  >
    <span class="grow my-auto text-xl text-black">{{ emoji }}</span>
    <div>
      <h3
        :class="[
          'text-sm font-medium leading-5',
          isActive ? 'text-blue-600' : 'text-zinc-800',
        ]"
      >
        {{ title }}
      </h3>
      <time class="z-10 text-sm text-stone-500">{{ lastUpdated }}</time>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  emoji: string;
  title: string;
  lastUpdated: string;
  isActive?: boolean;
}>();
</script>
