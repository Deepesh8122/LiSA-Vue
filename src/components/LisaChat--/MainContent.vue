<template>
  <main class="flex flex-col flex-1">
    <div class="flex flex-col flex-1 gap-4 justify-center items-center p-4 w-full max-w-[768px] mx-auto">
      <div class="flex justify-center items-center w-10 h-10 rounded-md"></div>
      <div class="flex flex-wrap gap-3.5 justify-center items-start">
        <SuggestionCard
          v-for="suggestion in suggestions"
          :key="suggestion.text"
          v-bind="suggestion"
        />
      </div>
    </div>
    <MessageInput />
  </main>
</template>

<script setup lang="ts">
import SuggestionCard from "./SuggestionCard.vue";
import MessageInput from "./MessageInput.vue";

const suggestions = [
  {
    icon: "message",
    text: "Message to comfort a friend",
    color: "CB8BD0",
  },
  {
    icon: "game",
    text: "Design a fun coding game",
    color: "E1C441",
  },
  {
    icon: "code",
    text: "Make me a personal webpage",
    color: "ED6464",
  },
  {
    icon: "study",
    text: "Study vocabulary",
    color: "75D0EB",
  },
];
</script>
