<template>
  <div class="overflow-hidden bg-white">
    <div class="w-full bg-neutral-50">
      <div class="flex gap-5 max-md:flex-col">
        <div class="w-[22%] max-md:w-full">
          <ChatSidebar />
        </div>
        <div class="ml-5 w-[78%] max-md:ml-0 max-md:w-full">
          <ChatMain />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatSidebar from "@/components/ChatNew--/ChatSidebar.vue";
import ChatMain from "@/components/ChatNew--/ChatMain.vue";
</script>

