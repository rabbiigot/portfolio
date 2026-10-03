import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The dev server proxies /api → the NestJS backend so the frontend can call
// same-origin (no CORS in dev). In production, set VITE_API_URL or serve both
// behind one reverse proxy.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
