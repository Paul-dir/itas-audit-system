import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3003,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // SSE endpoints need long-lived connections — disable proxy timeout
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            // Remove Accept-Encoding so Spring sends uncompressed SSE
            proxyReq.setHeader('Accept-Encoding', 'identity');
          });
        },
      },
      '/dms-storage': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
