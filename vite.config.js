import { fileURLToPath, URL } from 'node:url';
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      vue(),
      vueDevTools(),
      tailwindcss()
    ],
    devServer: {
      https: false
    },
    base: env.VITE_BASE_URL || '/lisa/',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'https://lisa-front-api.ha1ltd.com/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    css: {
      // Remove 'include', keep preprocessorOptions and postcss if needed
      preprocessorOptions: {},
      postcss: {}
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        'vue': 'vue/dist/vue.esm-bundler.js'
      },
      extensions: ['.js', '.ts', '.json', '.vue']
    },
  }
})
