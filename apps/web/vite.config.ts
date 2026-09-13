import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config for 999x — React SPA with Neo-Cyber design
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 4321,
    proxy: {
      // يربط الفرونت بالـ API تلقائياً في الـ dev
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
    },
  },
  preview: { host: true, port: 4321 },
});
