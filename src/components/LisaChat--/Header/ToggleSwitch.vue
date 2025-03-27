<template>
  <div
    class="flex overflow-hidden flex-col justify-center items-start self-stretch px-1 py-0.5 my-auto rounded-lg border border-solid bg-stone-50 border-neutral-200 w-[27px]"
    role="switch"
    :aria-checked="modelValue"
    tabindex="0"
    @click="toggle"
    @keypress.space.prevent="toggle"
  >
    <div class="flex shrink-0 w-3 h-3 bg-white rounded-full"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ToggleSwitch",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  methods: {
    toggle() {
      this.$emit("update:modelValue", !this.modelValue);
    },
  },
});
</script>
