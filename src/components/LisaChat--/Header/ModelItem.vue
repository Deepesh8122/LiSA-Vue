<template>
  <article
    class="flex gap-2 items-center px-2.5 py-2.5 w-full rounded-lg bg-stone-50 min-h-[42px]"
  >
    <div
      class="flex flex-col justify-center items-center self-stretch my-auto w-6 h-6 rounded-2xl bg-neutral-200 min-h-6"
    >
      <img
        v-if="iconSrc"
        :src="iconSrc"
        class="object-contain w-[9px] aspect-[1.12]"
        :alt="`${modelName} icon`"
      />
    </div>
    <div class="flex-1 shrink my-auto text-xs basis-0 text-neutral-300">
      <span class="block text-[12px] text-[rgba(13,13,13,1)]">{{
        modelName
      }}</span>
      <span class="block text-[10px] leading-[13px] text-[rgba(13,13,13,1)]">{{
        description
      }}</span>
    </div>
    <div
      v-if="showChevron"
      class="flex flex-col justify-center items-center self-stretch my-auto w-4 min-h-4"
    >
      <img
        :src="iconSrc"
        class="object-contain aspect-[0.92] w-[11px]"
        :alt="modelName"
      />
    </div>
  </article>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ModelItem",
  props: {
    modelName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    iconSrc: {
      type: String,
      required: true,
    },
    showChevron: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
