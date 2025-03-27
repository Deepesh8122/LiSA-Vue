<template>
  <article :class="['flex flex-col', isUser ? 'items-end' : 'items-start']">
    <div
      :class="[
        'flex gap-6 text-base leading-6 text-zinc-800',
        isUser ? 'flex-row-reverse' : 'flex-row',
      ]"
    >
      <img
        :src="
          isUser
            ? 'https://cdn.builder.io/api/v1/image/assets/76072caaf8fb442d98226c591a72f472/54848bca14661e42adde8ef4c88b3f7454f4c888?placeholderIfAbsent=true'
            : 'https://cdn.builder.io/api/v1/image/assets/76072caaf8fb442d98226c591a72f472/c31df4a9dfca4c9127d23b9ff37a68eca8af4356?placeholderIfAbsent=true'
        "
        class="object-contain shrink-0 self-start w-10 rounded-none aspect-square"
        :alt="isUser ? 'User Avatar' : 'AI Avatar'"
      />
      <div
        class="p-6 bg-white rounded-3xl shadow-[0px_2px_4px_rgba(0,0,0,0.05)] max-w-[624px]"
      >
        {{ content }}
      </div>
    </div>

    <div
      v-if="!isUser"
      class="flex gap-3 mt-4 ml-16 text-sm text-center text-stone-500"
    >
      <button
        class="flex gap-2 px-4 py-2.5 bg-white rounded-xl shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
      >
        <img
          src="https://cdn.builder.io/api/v1/image/assets/76072caaf8fb442d98226c591a72f472/4c1a5e73e785cbd2ec998dce32ea6e49bcc8c4ef?placeholderIfAbsent=true"
          class="w-5 aspect-square"
          alt="Copy"
        />
        <span>Copy</span>
      </button>
      <button
        class="flex gap-2 px-4 py-2.5 bg-white rounded-xl shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
      >
        <img
          src="https://cdn.builder.io/api/v1/image/assets/76072caaf8fb442d98226c591a72f472/01419b37fda8e64984589986be815b3b20b8f170?placeholderIfAbsent=true"
          class="w-5 aspect-square"
          alt="Regenerate"
        />
        <span>Regenerate</span>
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  content: string;
  isUser: boolean;
}>();
</script>
