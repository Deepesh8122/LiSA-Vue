<template>
  <button
    class="flex justify-center items-center px-4 py-5 w-full rounded-lg border cursor-pointer border-zinc-200 hover:bg-zinc-50 transition-colors"
    @click="handleGoogleSignIn"
  >
    <div class="flex gap-2 items-center">
      <span v-html="googleIcon"></span>
      <span class="text-base font-semibold text-zinc-950"
        >Sign in with Google</span
      >
    </div>
  </button>
</template>

<script setup lang="ts">
const googleIcon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1_1176)">
<path d="M19.7874 10.225C19.7874 9.56668 19.7291 8.94168 19.6291 8.33334H10.2124V12.0917H15.6041C15.3624 13.325 14.6541 14.3667 13.6041 15.075V17.575H16.8207C18.7041 15.8333 19.7874 13.2667 19.7874 10.225Z" fill="#4285F4"/>
<path d="M10.2124 20C12.9124 20 15.1707 19.1 16.8207 17.575L13.604 15.075C12.704 15.675 11.5624 16.0417 10.2124 16.0417C7.60402 16.0417 5.39569 14.2833 4.60402 11.9083H1.28735V14.4833C2.92902 17.75 6.30402 20 10.2124 20Z" fill="#01B574"/>
<path d="M4.60407 11.9083C4.39574 11.3083 4.2874 10.6667 4.2874 9.99999C4.2874 9.33333 4.40407 8.69166 4.60407 8.09166V5.51666H1.2874C0.604068 6.86666 0.212402 8.38333 0.212402 9.99999C0.212402 11.6167 0.604068 13.1333 1.2874 14.4833L4.60407 11.9083Z" fill="#FBBC05"/>
<path d="M10.2124 3.95833C11.6874 3.95833 13.004 4.46667 14.0457 5.45834L16.8957 2.60833C15.1707 0.991667 12.9124 0 10.2124 0C6.30402 0 2.92902 2.25 1.28735 5.51667L4.60402 8.09167C5.39569 5.71667 7.60402 3.95833 10.2124 3.95833Z" fill="#EA4335"/>
</g>
<defs>
<clipPath id="clip0_1_1176">
<rect width="20" height="20" fill="white"/>
</clipPath>
</defs>
</svg>`;

const handleGoogleSignIn = () => {
  // Implement Google sign in logic
  console.log("Google sign in clicked");
};
</script>
