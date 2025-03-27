<template>
  <section
    class="flex flex-col justify-center p-4 w-full lg:p-8 2xl:p-15 md:max-w-full"
  >
    <div class="flex gap-3 items-start max-w-full w-[382px]">
      <img
        src="@/assets/LiSA_logo.png"
        class="object-contain aspect-[1.98] w-[150px] lg:w-[150px] 2xl:w-[200px]"
        alt="Logo"
      />
    </div>

    <header
      class="flex flex-col justify-center pr-7 mt-14 w-full md:pr-5 md:mt-8 2xl:mt-10 md:max-w-full"
    >
      <h1 class="text-4xl lg:text-5xl font-bold leading-tight text-gray-800">
        Welcome Back
      </h1>
      <p class="mt-2 text-lg/7 text-6 leading-6 text-black">
        Welcome back! Please enter your details.
      </p>
    </header>

    <form
      @submit.prevent="handleSubmit"
      class="flex flex-col justify-center text-4xl mt-14 w-full md:mt-8 2xl:mt-10 md:max-w-full"
    >
      <FormInput
        v-model="email"
        label="Email"
        placeholder="Enter your email"
        type="email"
      />

      <label
        class="flex gap-2 items-center mt-4 w-full text-sm leading-none text-gray-800"
      >
        <input
          type="checkbox"
          v-model="rememberMe"
          class="w-4 h-4 rounded-sm border border-solid border-stone-500"
        />
        <span>Remember me</span>
      </label>

      <SocialButton 
        class="flex mt-8 flex-col items-center w-full h-[52px] px-4 py-3.5 rounded-xl bg-gradient-to-r from-[#4318FF] to-[#FF3D77]"
        variant="primary"
        @click="handleSubmit"
      >
        Continue with Email
      </SocialButton>

      <p
        class="flex gap-1 justify-center mt-8 text-sm leading-none text-center"
      >
        <span class="text-black">Don't have an account?</span>
        <a href="#" class="font-medium text-indigo-600">Sign up</a>
      </p>

      <div class="relative flex items-center justify-center mt-10">
        <hr class="w-full border-t border-gray-300" />
        <span class="absolute px-4 text-sm text-black bg-white">or</span>
      </div>

      <SocialButton
        class="mt-10 md:mb-5"
        icon="https://cdn.builder.io/api/v1/image/assets/76072caaf8fb442d98226c591a72f472/ccb5427375dd6195e2d5d092b9d2e527242cc54e?placeholderIfAbsent=true"
      >
        Continue with Google
      </SocialButton>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from 'vue-router';
import FormInput from "./FormInput.vue";
import SocialButton from "./SocialButton.vue";

const router = useRouter();
const email = ref("");
const rememberMe = ref(false);

const handleSubmit = async (event: Event) => {
  event.preventDefault();
  
  try {
    // Basic validation
    if (!email.value) {
      alert('Please enter your email');
      return;
    }

    // Store user data if remember me is checked
    if (rememberMe.value) {
      localStorage.setItem('user-email', email.value);
    }

    // Navigate to chat page
    await router.push({ 
      name: 'chat',
      // Optional: Pass any required data
      // params: { userId: '123' }
    });
  } catch (error) {
    console.error('Navigation failed:', error);
    alert('Failed to navigate to chat page');
  }
};
</script>
