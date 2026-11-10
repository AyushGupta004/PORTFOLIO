import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  envDir: path.resolve(__dirname, '..'),
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion'],
          geo: ['d3-geo', 'world-atlas/countries-110m.json'],
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api/leetcode': {
        target: 'https://leetcode.com',
        changeOrigin: true,
        rewrite: () => '/graphql',
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('origin', 'https://leetcode.com');
            proxyReq.setHeader('referer', 'https://leetcode.com/');
          });
        },
      },
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
});
