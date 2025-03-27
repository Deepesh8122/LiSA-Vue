<template>
  <nav
    class="flex flex-col px-6 pt-6 pb-9 mx-auto w-full bg-white shadow-[1px_0px_2px_rgba(0,0,0,0.05)]"
  >
    <header class="flex gap-3 self-start">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/76072caaf8fb442d98226c591a72f472/aebea3c88b82e027cd941baacf7eaa5fcefbb76f?placeholderIfAbsent=true"
        class="object-contain shrink-0 my-auto w-10 rounded-none aspect-square"
        alt="LiSA Chat Logo"
      />
      <div class="flex flex-col">
        <h1 class="text-lg font-semibold text-neutral-900">LiSA Chat</h1>
        <p class="self-start text-sm text-stone-500">AI Assistant</p>
      </div>
    </header>

    <div
      class="flex gap-1.5 px-4 py-3 mt-8 text-sm rounded-xl bg-neutral-100 text-neutral-400"
    >
      <img
        src="https://cdn.builder.io/api/v1/image/assets/76072caaf8fb442d98226c591a72f472/74230ecec0174890edbce943f8b055a4408bc476?placeholderIfAbsent=true"
        class="object-contain shrink-0 w-5 aspect-square"
        alt="Search"
      />
      <input
        type="text"
        placeholder="Search conversations..."
        class="grow bg-transparent outline-none"
      />
    </div>

    <section class="mt-8">
      <h2 class="ml-3 text-xs font-medium text-stone-500">Today</h2>
      <ConversationItem
        emoji="🌍"
        title="Amsterdam trip with the boys"
        lastUpdated="Last updated 2h ago"
      />
      <ConversationItem
        emoji="⚡"
        title="Superconductors: Smooth Roads"
        lastUpdated="Last updated 2h ago"
        :isActive="true"
      />
    </section>

    <section class="mt-6">
      <h2 class="ml-3 text-xs font-medium text-stone-500">Previous 7 Days</h2>
      <ConversationItem
        emoji="💼"
        title="Excited About a Job Opportunity"
        lastUpdated="Last updated 2h ago"
      />
      <ConversationItem
        emoji="🏛️"
        title="Fun fact about the Roman Empire"
        lastUpdated="Last updated 2h ago"
      />
    </section>

    <section class="mt-6">
      <h2 class="ml-3 text-xs font-medium text-stone-500">Previous 30 Days</h2>
    </section>

    <footer class="flex gap-5 mx-3 mt-14">
      <div class="flex gap-2.5">
        <span
          class="self-start px-1.5 w-8 h-8 text-sm font-medium text-center text-white whitespace-nowrap bg-blue-600 rounded-lg flex items-center justify-center"
        >
          DY
        </span>
        <div class="flex flex-col text-stone-500">
          <span class="self-start text-xs">Premium Account</span>
          <time class="text-sm">Last updated 2h ago</time>
        </div>
      </div>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/76072caaf8fb442d98226c591a72f472/baffbbb6bc66499bd8f8bdeade288a2fd3b4f126?placeholderIfAbsent=true"
        class="object-contain shrink-0 my-auto w-5 aspect-square"
        alt="Settings"
      />
    </footer>
  </nav>
</template>

<script setup lang="ts">
import ConversationItem from "./ConversationItem.vue";
</script>
