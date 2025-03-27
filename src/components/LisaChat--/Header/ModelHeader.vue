<template>
  <header
    class="flex items-center pt-3 pr-2.5 pb-1 pl-2 w-full text-xs whitespace-nowrap rounded-lg text-stone-950"
  >
    <h2 class="flex-1 shrink self-stretch my-auto basis-0">Model</h2>
    <div class="flex shrink-0 self-stretch my-auto w-4 h-4"></div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ModelHeader",
});
</script>
