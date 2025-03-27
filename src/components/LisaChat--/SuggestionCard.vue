<template>
  <button
    class="flex flex-col gap-1.5 items-start p-2 bg-white rounded-xl border border-neutral-200 h-[84px] w-[133px] hover:bg-stone-50"
  >
    <component :is="iconComponent" />
    <p class="tracking-normal leading-5 text-stone-500">
      {{ text }}
    </p>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import MessageIcon from "./ChatIcons/MessageIcon.vue";
import GameIcon from "./ChatIcons/GameIcon.vue";
import CodeIcon from "./ChatIcons/CodeIcon.vue";
import StudyIcon from "./ChatIcons/StudyIcon.vue";

const props = defineProps<{
  icon: string;
  text: string;
}>();

const iconComponent = computed(() => {
  const icons = {
    message: MessageIcon,
    game: GameIcon,
    code: CodeIcon,
    study: StudyIcon,
  };
  return icons[props.icon as keyof typeof icons];
});
</script>
