<template>
  <div class="flex flex-col w-full">
    <label
      :for="id"
      class="self-start text-sm font-medium leading-none text-gray-800"
    >
      {{ label }}
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      :placeholder="placeholder"
      class="py-3 px-4 mt-2 text-base rounded-xl border border-black border-solid bg-slate-50 text-neutral-400 w-full"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { FormInputProps } from "./types";

const props = withDefaults(defineProps<FormInputProps>(), {
  type: "text",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const id = computed(
  () => `input-${props.label.toLowerCase().replace(/\s+/g, "-")}`,
);
</script>
