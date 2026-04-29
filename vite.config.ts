import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
  plugins: [react(), mkcert()],
  base: '/ModernReader/',
  server: {
    https: true,
    proxy: {
      '/api': {
        target: 'https://localhost:8787',
        changeOrigin: true,
        rejectUnauthorized: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
