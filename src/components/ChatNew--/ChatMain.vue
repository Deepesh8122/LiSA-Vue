<template>
    <main class="flex flex-col pt-2.5 mx-auto w-full bg-white">
      <header
        class="flex flex-wrap gap-5 justify-between self-center w-full max-w-[918px]"
      >
        <button
          class="flex gap-3 items-center px-4 py-3 rounded-xl bg-neutral-100"
        >
          <img
            src="https://cdn.builder.io/api/v1/image/assets/76072caaf8fb442d98226c591a72f472/54848bca14661e42adde8ef4c88b3f7454f4c888?placeholderIfAbsent=true"
            class="object-contain shrink-0 self-stretch my-auto w-8 rounded-lg aspect-square"
            alt="AI Model"
          />
          <div class="flex flex-col self-stretch">
            <span class="self-start text-sm font-medium text-zinc-800"
              >LiSA 2.o</span
            >
            <span class="text-xs text-stone-500">Advanced AI</span>
          </div>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/76072caaf8fb442d98226c591a72f472/c8e8974c420a5c337c0a86d8fb62a41ee3ece9d4?placeholderIfAbsent=true"
            class="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
            alt="Dropdown"
          />
        </button>
  
        <div class="flex gap-9 my-auto">
          <button>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/76072caaf8fb442d98226c591a72f472/0000c7c34a7204685a1e35f1ead1ca356e50ab2e?placeholderIfAbsent=true"
              class="w-5 aspect-square"
              alt="Share"
            />
          </button>
          <button>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/76072caaf8fb442d98226c591a72f472/01419b37fda8e64984589986be815b3b20b8f170?placeholderIfAbsent=true"
              class="w-5 aspect-square"
              alt="More"
            />
          </button>
        </div>
      </header>
  
      <section
        class="flex flex-col px-8 pt-8 pb-48 mt-2.5 bg-neutral-50 min-h-[500px]"
      >
        <ChatMessage
          content="Explain superconductors like I'm five years old."
          :isUser="true"
        />
        <ChatMessage
          content="Sure! Imagine you have a slide in a playground. When you slide down, you can go really fast because the slide is smooth and slippery. Now, think about electricity like little cars driving on a road. Normally, the road has bumps and cracks, so the cars can't go super fast and sometimes get stuck. But in a superconductor, the road is perfectly smooth like the playground slide. This means the little cars (electricity) can zoom super fast without getting stuck or slowed down. Superconductors are special materials that make this super smooth road for electricity, but they only work when they are really, really cold, like as cold as outer space!"
          :isUser="false"
        />
      </section>
  
      <footer class="px-8 py-8 w-full bg-white">
        <div
          class="flex flex-wrap gap-5 justify-between px-4 py-2.5 w-full bg-white rounded-2xl border border-gray-200 border-solid shadow-[0px_2px_4px_rgba(0,0,0,0.05)]"
        >
          <div class="flex gap-3.5 my-auto">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/76072caaf8fb442d98226c591a72f472/d9c0bbccdd5cb941bbde386d36ca2aafb43f7f4f?placeholderIfAbsent=true"
              class="object-contain shrink-0 w-5 aspect-square"
              alt="Message"
            />
            <input
              type="text"
              placeholder="Message LiSA..."
              class="text-neutral-400 bg-transparent outline-none"
            />
          </div>
          <button>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/76072caaf8fb442d98226c591a72f472/fdeb08ee06443eaa3901c29f98161e35d6a77573?placeholderIfAbsent=true"
              class="object-contain shrink-0 w-10 rounded-none aspect-square"
              alt="Send"
            />
          </button>
        </div>
      </footer>
    </main>
  </template>
  
  <script setup lang="ts">
  import ChatMessage from "./ChatMessage.vue";
  </script>
  