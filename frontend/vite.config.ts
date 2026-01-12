import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Écoute sur toutes les interfaces
  },
  preview: {
    host: true, // Pour le mode preview (Railway)
    port: 4173,
    strictPort: false,
  }
})