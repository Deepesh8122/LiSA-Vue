<template>
  <aside
    class="flex-col items-start px-2 pt-0 pb-2 h-screen bg-stone-50 w-[300px] max-md:w-[300px] max-sm:absolute max-sm:z-10 max-h-screen"
    :style="{
      display: isOpen ? 'flex' : 'none',
    }"
  >
    <SidebarHeader />
    <div class="overflow-y-auto h-full w-full">
      <nav class="flex flex-col items-start w-full text-left">
        <ChatOption 
          :icon="LiSAIcon"
          text="New Chat" 
          :has-border="true"
        />
        
        <ChatOption
          icon="dall-e"
          text="DALL•3 Ultra: image & art generator"
          :has-image="true"
          image-url="https://cdn.builder.io/api/v1/image/assets/TEMP/243bdb20dd970560dbab72efe05b85eac0ec1fd2"
        />
        
        <ChatOption 
          :icon="MenuIcon" 
          text="Explore LiSA" 
          :has-border="true" 
        />
      </nav>
      
      <div class="flex flex-col flex-1 gap-6 items-start pt-4 w-full">
        <TimeSection title="Today" :chats="todayChats" />
        <TimeSection title="Previous 7 Days" :chats="previousWeekChats" />
        <TimeSection title="Previous 30 Days" :chats="previousMonthChats" />
      </div>
    </div>
    <InviteMembersButton />
  </aside>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import SidebarHeader from "@/components/LisaChat--/SidebarHeader.vue";
import ChatOption from "@/components/LisaChat--/ChatOption.vue";
import TimeSection from "@/components/LisaChat--/TimeSection.vue";
import LiSAIcon from "@/components/LisaChat--/ChatIcons/LiSAIcon.vue";
import MenuIcon from "@/components/LisaChat--/ChatIcons/MenuIcon.vue";


import InviteMembersButton from "@/components/LisaChat--/InviteMembersButton.vue";

defineProps<{
  isOpen: boolean;
}>();

const todayChats = [
  "Amsterdam trip with the boys",
  "Superconductors: Smooth Roads, Superconductors: Smooth Roads",
];

const previousWeekChats = [
  "Excited About a Job Opportunity",
  "Fun fact about the Roman Empire",
  "3 day itinerary in the South of France",
];

const previousMonthChats = [
  "Marble Statue Pizza Cigar.",
  "Gradient Background Pack Giveaway",
  "Fern Gully, the Chief Leaf Officer",
  "Design an Uber-like app",
];
</script>
