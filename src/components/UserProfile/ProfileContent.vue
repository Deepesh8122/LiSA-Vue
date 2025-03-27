<template>
  <div class="flex-1">
    <div
      class="bg-[#fff] rounded-[16px] border-[1px] border-[#EAEAEA] mb-[16px]"
    >
      <div class="flex border-b-[1px] border-[#EAEAEA]">
        <button
          v-for="tab in ['profile', 'activity']"
          :key="tab"
          @click="$emit('update:activeTab', tab)"
          class="px-[24px] py-[16px] text-[14px] font-[500] relative"
          :style="{ color: activeTab === tab ? '#007AFF' : '#666' }"
        >
          <span>{{ tab.charAt(0).toUpperCase() + tab.slice(1) }}</span>
          <div
            v-if="activeTab === tab"
            class="absolute bottom-0 left-0 w-full h-[2px] bg-[#007AFF]"
          ></div>
        </button>
      </div>
      <div class="p-[24px]">
        <div v-if="activeTab === 'profile'">
          <div class="mb-[32px]">
            <h3 class="text-[16px] font-[600] text-[#111] mb-[16px]">About</h3>
            <p class="text-[14px] leading-[1.6] text-[#666]">{{ user.bio }}</p>
          </div>
          <div class="mb-[32px]">
            <h3 class="text-[16px] font-[600] text-[#111] mb-[16px]">Skills</h3>
            <div class="flex flex-wrap gap-[8px]">
              <SkillBadge
                v-for="skill in user.skills"
                :key="skill"
                :skill="skill"
              />
            </div>
          </div>
          <div>
            <h3 class="text-[16px] font-[600] text-[#111] mb-[16px]">
              Contact
            </h3>
            <div class="grid grid-cols-2 gap-[16px] max-sm:grid-cols-1">
              <ContactCard label="Email" :value="user.email">
                <template #icon>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M2.5 6.66667L9.0755 11.0497C9.63533 11.4335 10.3647 11.4335 10.9245 11.0497L17.5 6.66667M4.16667 15.8333H15.8333C16.7538 15.8333 17.5 15.0871 17.5 14.1667V5.83333C17.5 4.91286 16.7538 4.16667 15.8333 4.16667H4.16667C3.24619 4.16667 2.5 4.91286 2.5 5.83333V14.1667C2.5 15.0871 3.24619 15.8333 4.16667 15.8333Z"
                      stroke="#666"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </template>
              </ContactCard>
              <ContactCard label="Phone" :value="user.phone">
                <template #icon>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M2.5 5C2.5 4.0795 3.2462 3.33333 4.16667 3.33333H7.15917C7.57042 3.33333 7.93695 3.58583 8.0845 3.97417L9.25 7.5C9.41583 7.92917 9.23667 8.40833 8.84167 8.6425L7.14167 9.67583C8.14167 11.7467 9.83667 13.4425 11.9083 14.4417L12.9417 12.7417C13.175 12.3467 13.6542 12.1675 14.0833 12.3333L17.6092 13.5C17.9975 13.6467 18.25 14.0133 18.25 14.425V17.5C18.25 18.4205 17.5038 19.1667 16.5833 19.1667H15.8333C8.46917 19.1667 2.5 13.1975 2.5 5.83333V5Z"
                      stroke="#666"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </template>
              </ContactCard>
              <ContactCard label="Website" :value="user.website">
                <template #icon>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M7.5 10L9.16667 11.6667L12.5 8.33333M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
                      stroke="#666"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </template>
              </ContactCard>
            </div>
          </div>
        </div>
        <div v-else-if="activeTab === 'activity'" class="space-y-4">
          <div
            v-for="activity in user.activity"
            :key="activity.title"
            class="flex items-start gap-4 p-4 border border-gray-100 rounded-lg"
          >
            <span class="text-2xl">{{ activity.icon }}</span>
            <div>
              <h4 class="text-[16px] font-[500] text-[#111]">
                {{ activity.title }}
              </h4>
              <p class="text-[14px] text-[#666]">{{ activity.desc }}</p>
              <span class="text-[12px] text-[#999]">{{ activity.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { UserProfile } from "../types/user";
import SkillBadge from "./shared/SkillBadge.vue";
import ContactCard from "./shared/ContactCard.vue";

defineProps<{
  user: UserProfile;
  activeTab: "profile" | "activity";
}>();

defineEmits<{
  (e: "update:activeTab", tab: "profile" | "activity"): void;
}>();
</script>
