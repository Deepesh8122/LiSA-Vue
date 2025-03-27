<template>
  <div class="w-[300px] max-lg:w-full">
    <div
      class="bg-[#fff] rounded-[16px] border-[1px] border-[#EAEAEA] p-[24px] mb-[16px]"
    >
      <div class="flex flex-col items-center">
        <div class="relative mb-[24px]">
          <img
            :src="user.avatar"
            class="w-[120px] h-[120px] rounded-[24px] object-cover"
            alt="Profile photo"
          />
          <button
            @click="$emit('edit')"
            class="absolute bottom-[-6px] right-[-6px] w-[32px] h-[32px] bg-[#007AFF] rounded-[8px] flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M11.333 2.667L13.333 4.667M12.667 1.333L8.667 5.333L7.333 8L10 6.667L14 2.667L12.667 1.333Z"
                stroke="#FFF"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.333 8V12.667C13.333 13.0203 13.1926 13.3594 12.9425 13.6095C12.6925 13.8595 12.3536 14 12 14H3.33301C2.97939 14 2.64025 13.8595 2.3902 13.6095C2.14015 13.3594 1.99967 13.0203 1.99967 12.667V4C1.99967 3.64638 2.14015 3.30724 2.3902 3.05719C2.64025 2.80714 2.97939 2.66667 3.33301 2.66667H8.33301"
                stroke="#FFF"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
        <h1 class="text-[24px] font-[600] text-[#111] mb-[4px]">
          {{ user.name }}
        </h1>
        <div class="flex items-center gap-[8px] mb-[16px]">
          <div class="w-[8px] h-[8px] rounded-full bg-[#4CAF50]"></div>
          <span class="text-[14px] text-[#666]">{{ user.role }}</span>
        </div>
        <div
          class="flex items-center gap-[8px] text-[14px] text-[#666] mb-[24px]"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 9.33333C9.47276 9.33333 10.6667 8.13943 10.6667 6.66667C10.6667 5.19391 9.47276 4 8 4C6.52724 4 5.33334 5.19391 5.33334 6.66667C5.33334 8.13943 6.52724 9.33333 8 9.33333Z"
              stroke="#666"
              stroke-width="1.5"
            />
            <path
              d="M13.3333 6.66667C13.3333 11.3333 8 15.3333 8 15.3333C8 15.3333 2.66667 11.3333 2.66667 6.66667C2.66667 5.07537 3.29881 3.54924 4.42399 2.42406C5.54917 1.29888 7.07537 0.666667 8.66667 0.666667C10.258 0.666667 11.7841 1.29888 12.9093 2.42406C14.0345 3.54924 14.6667 5.07537 14.6667 6.66667Z"
              stroke="#666"
              stroke-width="1.5"
            />
          </svg>
          <span>{{ user.location }}</span>
        </div>
        <div class="w-full h-[1px] bg-[#EAEAEA] mb-[24px]"></div>
        <div class="w-full">
          <div class="flex items-center gap-[8px] mb-[12px]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 4V8L10.6667 9.33333M14.6667 8C14.6667 11.6819 11.6819 14.6667 8 14.6667C4.3181 14.6667 1.33333 11.6819 1.33333 8C1.33333 4.3181 4.3181 1.33333 8 1.33333C11.6819 1.33333 14.6667 4.3181 14.6667 8Z"
                stroke="#666"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
            <span class="text-[14px] text-[#666]">{{ user.timezone }}</span>
          </div>
          <div class="flex items-center gap-[8px]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 4H12M4 8H12M4 12H8"
                stroke="#666"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span class="text-[14px] text-[#666]">
              <span>Member since </span>
              <span>{{ user.joined }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="bg-[#fff] rounded-[16px] border-[1px] border-[#EAEAEA] p-[24px]"
    >
      <h3 class="text-[16px] font-[600] text-[#111] mb-[16px]">Languages</h3>
      <div class="flex flex-col gap-[12px]">
        <div
          v-for="lang in user.languages"
          :key="lang"
          class="text-[14px] text-[#666]"
        >
          {{ lang }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { UserProfile } from "../types/user";

defineProps<{
  user: UserProfile;
}>();

defineEmits<{
  (e: "edit"): void;
}>();
</script>
