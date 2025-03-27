<template>
  <section
    class="overflow-hidden p-2 rounded-2xl border border-solid shadow-sm bg-stone-50 border-[color:var(--Border,#E0E0E0)] w-[260px] max-w-[260px]"
  >
    <ModelHeader />

    <ModelItem
      modelName="LiSA-1.o"
      description="Newest and most advanced model"
      iconSrc="https://cdn.builder.io/api/v1/image/assets/76072caaf8fb442d98226c591a72f472/204f1bb46afe7d4c8e3151bcdcd4a6f002f079ca?placeholderIfAbsent=true"
      class="mt-1"
    />

    <ModelItem
      modelName="LiSA-2.o"
      description="Advanced model for complex tasks"
      iconSrc="https://cdn.builder.io/api/v1/image/assets/76072caaf8fb442d98226c591a72f472/5f3cd2ff5c28f8df709d275fb4fe7f746a0879da?placeholderIfAbsent=true"
      class="mt-1"
    />

    <ModelItem
      modelName="LiSA-3.o"
      description="Great for everyday tasks"
      iconSrc="https://cdn.builder.io/api/v1/image/assets/76072caaf8fb442d98226c591a72f472/005397f223c21f29a483b5629747388ae675988b?placeholderIfAbsent=true"
      class="mt-1"
    />

    <img
      src="https://cdn.builder.io/api/v1/image/assets/76072caaf8fb442d98226c591a72f472/32b915072eeb38ca8183ff7b8f23ca6f59c07ec5?placeholderIfAbsent=true"
      class="object-contain mt-1 w-full aspect-[250]"
      alt="Divider"
    />

    <div
      class="flex gap-2 items-center px-2.5 py-3 mt-1 w-full rounded-lg bg-stone-50 min-h-[37px]"
    >
      <div class="flex shrink-0 self-stretch my-auto w-4 h-4"></div>
      <p
        class="flex-1 shrink self-stretch my-auto text-xs basis-0 text-stone-950"
      >
        Temporary chat
      </p>
      <ToggleSwitch />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ModelHeader from "./ModelHeader.vue";
import ModelItem from "./ModelItem.vue";
import ToggleSwitch from "./ToggleSwitch.vue";

export default defineComponent({
  name: "GptModelSelector",
  components: {
    ModelHeader,
    ModelItem,
    ToggleSwitch,
  },
});
</script>
