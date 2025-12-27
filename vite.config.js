// vite.config.js - CORREGIDO
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      // Configuración CORRECTA del proxy
      '/api-proxy': {
        target: 'https://erp.axarinternational.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-proxy/, '/api/index.php'),
        secure: false
      }
    }
  }
})