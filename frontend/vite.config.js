import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Em desenvolvimento, chamadas para /api vão para o Django (porta 8000).
    // Assim o React usa sempre o mesmo endereço e não precisa configurar CORS.
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
})
