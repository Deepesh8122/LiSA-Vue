<template>
  <span
    class="px-[12px] py-[6px] bg-[#F5F5F5] rounded-[20px] text-[14px] text-[#666]"
  >
    {{ skill }}
  </span>
</template>

<script lang="ts" setup>
defineProps<{
  skill: string;
}>();
</script>
