import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'MONOPECA — Monopoli Pecahan',
        short_name: 'MONOPECA',
        description: 'Media Game Edukatif Monopoli Berbasis TGT Materi Pecahan Kelas V SD',
        theme_color: '#FF6B35',
        background_color: '#FFF8EC',
        display: 'standalone',
        orientation: 'landscape-primary',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    watch: {
      usePolling: true,
      interval: 1000
    }
  },
  // @ts-expect-error vitest config
  test: {
    globals: true,
    environment: 'node'
  }
});
