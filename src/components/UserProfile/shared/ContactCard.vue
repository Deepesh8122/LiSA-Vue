<template>
  <div
    class="flex items-center gap-[12px] p-[16px] border-[1px] border-[#EAEAEA] rounded-[12px]"
  >
    <slot name="icon"></slot>
    <div>
      <div class="text-[12px] text-[#666] mb-[4px]">{{ label }}</div>
      <div class="text-[14px] text-[#111]">{{ value }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  label: string;
  value: string;
}>();
</script>
