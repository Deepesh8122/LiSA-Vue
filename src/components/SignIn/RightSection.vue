<template>
  <section
    class="flex flex-col justify-center items-center px-24 bg-zinc-950 w-1/2 max-md:px-12 max-sm:hidden"
  >
    <LisaLogo />
    <TestimonialQuote>
      "This library has saved me countless hours of work and helped me deliver
      stunning designs to my clients faster than ever before."
      <template #author>Deepesh - LiSA AI</template>
    </TestimonialQuote>
  </section>
</template>

<script setup lang="ts">
import LisaLogo from "./LisaLogo.vue";
import TestimonialQuote from "./TestimonialQuote.vue";
</script>
