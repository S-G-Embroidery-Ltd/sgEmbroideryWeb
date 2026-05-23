import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ 
      presets: [reactCompilerPreset()],
      exclude: 'node_modules/**'
    })
  ],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: 'build',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split vendor libraries
          if (id.includes('react') || id.includes('react-dom')) {
            return 'vendor';
          }
          // Split UI components
          if (id.includes('lucide-react')) {
            return 'ui';
          }
          // Split routing
          if (id.includes('react-router-dom')) {
            return 'router';
          }
          // Split API and utilities
          if (id.includes('/src/services/') || id.includes('/src/hooks/')) {
            return 'utils';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase limit to reduce warnings
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react'],
  },
})
