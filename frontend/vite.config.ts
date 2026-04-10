import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
  },
  preview: {
    port: 4173,
  },
  build: {
    target: 'es2020',
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Hand-rolled chunking to keep the initial bundle small.
        // Monaco is the single biggest dependency by far, so isolate it.
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('monaco-editor')) return 'monaco'
            if (id.includes('@monaco-editor/react')) return 'monaco'
            if (id.includes('lucide-react')) return 'icons'
            if (id.includes('react-dom')) return 'react-dom'
            if (id.includes('react/')) return 'react'
            return 'vendor'
          }
        },
      },
    },
  },
})
