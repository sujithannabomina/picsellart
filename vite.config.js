import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',           // prevents downleveling that breaks dynamic imports
    modulePreload: { polyfill: false },
    sourcemap: false,
    outDir: 'dist',
    assetsDir: 'assets'
  },
  esbuild: {
    supported: { 'top-level-await': true }
  }
})
