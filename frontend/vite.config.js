import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
    },
  },
  build: {
    // Lazy routes already keep these out of the initial load; splitting the
    // vendors into stable chunks also improves long-term browser caching.
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          // Order matters: match the most specific package names first.
          if (/[\\/]node_modules[\\/](jspdf|jspdf-autotable|html2canvas|canvg|dompurify|raphael|fflate)[\\/]/.test(id)) return 'vendor-pdf';
          if (/[\\/]node_modules[\\/](recharts|d3-|victory-|internmap|robust-predicates)[\\/]/.test(id)) return 'vendor-charts';
          if (/[\\/]node_modules[\\/](react-router|react-router-dom|@remix-run)[\\/]/.test(id)) return 'vendor-router';
          if (/[\\/]node_modules[\\/](lucide-react)[\\/]/.test(id)) return 'vendor-icons';
          if (/[\\/]node_modules[\\/](@reduxjs|react-redux|redux|redux-thunk|reselect|immer)[\\/]/.test(id)) return 'vendor-redux';
          if (/[\\/]node_modules[\\/](react-hook-form|@hookform|zod)[\\/]/.test(id)) return 'vendor-forms';
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'vendor-react';
          return 'vendor';
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
