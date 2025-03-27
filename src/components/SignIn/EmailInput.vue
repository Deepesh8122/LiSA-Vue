<template>
  <div class="flex flex-col gap-1.5 w-full">
    <label class="text-base font-semibold text-zinc-950">Email Address</label>
    <input
      type="email"
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      class="p-5 w-full text-base font-medium bg-white rounded-lg border border-zinc-200 text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
      placeholder="Enter your email"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
}>();

defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
</script>
