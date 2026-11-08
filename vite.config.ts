import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        diy: resolve(__dirname, 'diy.html'),
        project: resolve(__dirname, 'project.html'),
      },
    },
  },
  preview: {
    allowedHosts: ['.trycloudflare.com'],
  },
})
