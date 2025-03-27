<template>
  <button 
    class="px-4 py-5 w-full text-base font-semibold rounded-lg bg-zinc-950 text-neutral-50 hover:bg-zinc-800 transition-colors cursor-pointer" 
    :disabled="isDisabled || isLoading"
    :class="{ 'opacity-50 cursor-not-allowed': isDisabled || isLoading }"
    @click="goToChatPage"
  >
    <span v-if="!isLoading">{{ buttonText }}</span>
    <span v-else>Loading...</span>
  </button>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'SignInButton',
  
  props: {
    isDisabled: {
      type: Boolean,
      default: false
    },
    buttonText: {
      type: String,
      default: 'Open Chat'
    }
  },

  data() {
    return {
      isLoading: false,
      router: useRouter()
    }
  },

  methods: {
    async goToChatPage() {
      if (!this.isDisabled && !this.isLoading) {
        try {
          this.isLoading = true
          await this.router.push('/chat')
        } catch (error) {
          console.error('Navigation failed:', error)
        } finally {
          this.isLoading = false
        }
      }
    }
  },

  mounted() {
    console.log('SignInButton component mounted')
  }
}
</script>