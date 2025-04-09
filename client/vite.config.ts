import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['buffer', 'process'],
      globals: {
        Buffer: true,
        process: true,
        global: true
      },
    })
  ],
  server: {
    headers: {
      'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval';
        style-src 'self' 'unsafe-inline';
        connect-src 'self' https://* wss://*;
        img-src 'self' data: https:;
        font-src 'self';
        frame-src 'self' https://*.walletconnect.com https://*.walletconnect.org;
        worker-src 'self' blob:;
      `.replace(/\s+/g, ' ').trim()
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    }
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    },
    rollupOptions: {
      external: ['fsevents'],
      output: {
        manualChunks: undefined
      }
    }
  },
  define: {
    'process.env': {},
    global: 'globalThis'
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  }
})
