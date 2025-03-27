<template>
  <main class="flex w-full min-h-screen w-full lg:min-w-screen mx-auto">
    <section class="flex flex-col justify-center items-center px-24 bg-zinc-950 w-1/2 max-sm:w-full max-md:px-12 max-sm:hidden">
      <LisaLogo class="mb-10" />
      <TestimonialQuote>
        "This library has saved me countless hours of work and helped me deliver
        stunning designs to my clients faster than ever before."
        <template #author>Deepesh - LiSA AI</template>
      </TestimonialQuote>
    </section>
    <section class="flex flex-col p-8 w-1/2 max-sm:w-full bg-zinc-50">
      <div class="flex flex-col gap-7 max-w-[520px] w-full mx-auto m-auto h-inherit">
        <header class="flex flex-col gap-2.5 items-start w-full">
          <h1 class="text-3xl font-bold text-zinc-950">Sign In</h1>
          <p class="text-base font-medium text-zinc-500">
            Enter your email and password to sign in!
          </p>
        </header>

        <div class="flex flex-col gap-7 justify-center items-center w-full">
          <GoogleSignInButton />
          <div
            class="my-4 w-full h-px bg-zinc-200"
            role="separator"
            aria-orientation="horizontal"
          ></div>
          <EmailInput 
            :value="email" 
            @input="email = $event" 
            @blur="validateEmail" 
          />
          <p v-if="emailError" class="text-sm text-red-500">{{ emailError }}</p>
          <button 
              class="px-4 py-5 w-full text-base font-semibold rounded-lg bg-zinc-950 text-neutral-50 hover:bg-zinc-800 transition-colors cursor-pointer" 
              :disabled="!!emailError || isLoading"
              :class="{ 'opacity-50 cursor-not-allowed': !!emailError || isLoading }"
              @click="goToChatPage"
            >
              <span v-if="!isLoading">{{ buttonText }}</span>
              <span v-else>Loading...</span>
            </button>
        </div>

        <div class="flex flex-col gap-4 items-center w-full">
          <a href="#" class="text-sm font-medium cursor-pointer text-zinc-500 hover:text-zinc-700">
            Forgot your password?
          </a>
          <a href="#" class="text-sm font-medium cursor-pointer text-zinc-500 hover:text-zinc-700">
            Don't have an account? Sign up
          </a>
        </div>
      </div>

      <footer>
        <FooterLinks />
      </footer>
    </section>
  </main>
</template>

<script>
import GoogleSignInButton from "@/components/SignIn/GoogleSignInButton.vue"
import EmailInput from "@/components/SignIn/EmailInput.vue"
import FooterLinks from "@/components/SignIn/FooterLinks.vue"
import LisaLogo from "@/components/SignIn/LisaLogo.vue"
import TestimonialQuote from "@/components/SignIn/TestimonialQuote.vue"

export default {
  name: 'SignInPage',
  
  components: {
    GoogleSignInButton,
    EmailInput,
    FooterLinks,
    LisaLogo,
    TestimonialQuote
  },

  data() {
    return {
      email: '',
      password: '',
      emailError: '',
      isLoading: false,
      buttonText: 'Open Chat'
    }
  },

  methods: {
    validateEmail() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!this.email) {
        this.emailError = "Email is required."
      } else if (!emailPattern.test(this.email)) {
        this.emailError = "Please enter a valid email address."
      } else {
        this.emailError = ""
      }
    },

    async goToChatPage() {
      if (!this.emailError && !this.isLoading) {
        try {
          this.isLoading = true;
          console.log('Navigating to chat...');
          await this.$router.push({ name: 'Chat' });
        } catch (error) {
          console.error('Navigation failed:', error);
        } finally {
          this.isLoading = false;
        }
      }
    }
  }
}
</script>