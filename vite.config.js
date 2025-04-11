import { fileURLToPath, URL } from 'node:url';
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss()
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://109.228.57.128:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  css: ['~/assets/css/main.css'],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.js', '.ts', '.json', '.vue']
  },
})
