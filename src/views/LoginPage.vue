<template>
  <main class="overflow-hidden bg-white">
    <div
      class="flex overflow-hidden flex-col justify-center w-full h-full md:max-w-screen md:h-screen md:overflow-x-hidden"
    >
      <div
        class="login-bg flex relative flex-col flex-1 justify-center p-4 lg:p-6 w-full max-md:max-w-full bg-cover bg-center bg-no-repeat"
        :style="{ backgroundImage: `url(${getImageUrl})` }"
      >
        <div
          class="z-0 bg-white self-center max-w-full rounded-[32px] shadow-[0px_4px_50px_rgba(0,0,0,0.08)] w-[1078px] overflow-hidden"
        >
          <div class="flex gap-5 max-md:flex-col">
            <div class="w-6/12 max-md:ml-0 max-md:w-full">
              <LoginForm />
            </div>
            <div class="w-6/12 max-md:ml-0 max-md:w-full">
              <LoginHero />
            </div>
          </div>
        </div>

        <footer
          class="flex relative z-0 gap-3 xl:gap-6 items-start self-start text-sm leading-none text-zinc-500 mt-5 mx-auto max-md:max-w-full"
        >
          <a href="#" class="hover:text-zinc-700">FAQs</a>
          <a href="#" class="hover:text-zinc-700">Privacy Policy</a>
          <a href="#" class="hover:text-zinc-700">Terms & Conditions</a>
          <a href="#" class="hover:text-zinc-700">Refund Policy</a>
        </footer>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import LoginForm from "@/components/LogIn/LoginForm.vue";
import LoginHero from "@/components/LogIn/LoginHero.vue";
import loginBg from '@/assets/images/login-bg-layer.svg';

// Computed property for image URL
const getImageUrl = loginBg;
</script>

<style scoped>
.login-bg {
  background-image: url('@/assets/images/login-bg-layer.png');
  @apply bg-cover bg-center bg-no-repeat;
}
</style>