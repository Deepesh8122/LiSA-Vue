<template>
  <div class="flex flex-col font-[Inter] min-h-screen w-screen bg-[#F9F9F9]">
    <div class="max-w-[1200px] w-full mx-auto p-[24px]">
      <div class="flex gap-[24px] max-lg:flex-col">
        <ProfileSidebar :user="userData" @edit="isEditing = true" />
        <ProfileContent
          :user="userData"
          :active-tab="activeTab"
          @update:active-tab="activeTab = $event"
        />
      </div>
    </div>

    <!-- Success Toast -->
    <div
      v-if="showSuccess"
      class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
    >
      Changes saved successfully!
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { UserProfile } from "./types/user";
import ProfileSidebar from "./components/ProfileSidebar.vue";
import ProfileContent from "./components/ProfileContent.vue";

const activeTab = ref<"profile" | "activity">("profile");
const isEditing = ref(false);
const showSuccess = ref(false);

const userData: UserProfile = {
  name: "David Yang",
  email: "david@example.com",
  role: "Premium Member",
  avatar: "https://placehold.co/400x400",
  location: "San Francisco, CA",
  timezone: "PST (GMT-8)",
  joined: "March 2023",
  bio: "Product designer and developer passionate about creating delightful user experiences. Leading design systems and user research initiatives.",
  phone: "+1 (555) 123-4567",
  website: "davidyang.design",
  github: "@davidyang",
  linkedin: "in/davidyang",
  skills: [
    "UI/UX Design",
    "Frontend Development",
    "User Research",
    "Design Systems",
    "Prototyping",
    "Figma",
    "React",
    "TypeScript",
  ],
  languages: ["English (Native)", "Mandarin (Fluent)", "Spanish (Basic)"],
  activity: [
    {
      type: "project",
      title: "Mobile App Redesign",
      desc: "Started new project",
      time: "2 hours ago",
      icon: "📱",
    },
    {
      type: "comment",
      title: "Design System Documentation",
      desc: "Left a comment",
      time: "1 day ago",
      icon: "💬",
    },
    {
      type: "update",
      title: "Portfolio Website",
      desc: "Updated case studies",
      time: "3 days ago",
      icon: "✨",
    },
  ],
};

const saveChanges = () => {
  isEditing.value = false;
  showSuccess.value = true;
  setTimeout(() => {
    showSuccess.value = false;
  }, 2000);
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter&display=swap");
</style>
