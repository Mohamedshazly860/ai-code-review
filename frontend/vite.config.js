import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',   // Required for Docker
    port: 3000,
    watch: {
      usePolling: true  // Required for Docker volume file watching
    }
  }
})

