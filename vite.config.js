import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  base: '/',
  build: {
    // Disable source maps in production — prevents exposing source code
    sourcemap: false,
    // Minify with esbuild for smaller, obfuscated output
    minify: 'esbuild',
    // Strip console.log and debugger calls from production builds
    esbuildOptions: {
      drop: ['console', 'debugger'],
    },
    rollupOptions: {
      output: {
        // Randomized chunk names make it harder to map structure
        chunkFileNames: 'assets/[hash].js',
        entryFileNames: 'assets/[hash].js',
        assetFileNames: 'assets/[hash].[ext]'
      },
    },
  },
  // Prevent leaking env vars — only VITE_ prefixed ones are exposed to client
  envPrefix: 'VITE_',
  server: {
    // Dev server: only allow local connections
    host: 'localhost',
    strictPort: false,
  },
})
