import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  // amazon-cognito-identity-js pulls in Node's `buffer` package, which assumes
  // Node's `global` exists. Vite doesn't polyfill Node globals like Webpack
  // did, so without this the module throws on load in the browser.
  define: {
    global: 'globalThis',
  },
})
