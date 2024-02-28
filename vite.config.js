import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'



export default defineConfig({
  // Base configuration
  plugins: [react()],
  base: '',
  build: {
    outDir: 'dist',
    emptyOutDir: true, // Clears the directory on build
    rollupOptions: {
      input: {
        main: 'index.html',
        popup: 'popup.html',
      },
    },
  },
});

