import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/RSIChecklist/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/**/*.png', 'guidelines/**/*.pdf', 'pdf.worker.min.mjs'],
      manifest: {
        name: 'Emergency Airway Portal',
        short_name: 'Airway Portal',
        description: 'NHS Emergency Airway Guidelines - Offline Access',
        theme_color: '#005EB8',
        background_color: '#F0F4F5',
        display: 'standalone',
        orientation: 'landscape',
        start_url: '/RSIChecklist/',
        scope: '/RSIChecklist/',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,mjs,css,html,ico,png,svg,pdf}'],
        globIgnores: ['**/trauma-reference-document.pdf'],
        globDirectory: 'dist',
        navigateFallback: null,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: ({ url }) => url.pathname.endsWith('.pdf'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'pdf-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [200]
              },
              plugins: []
            }
          }
        ],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        cleanupOutdatedCaches: true
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
  build: {
    target: 'esnext',
    sourcemap: true
  },
  server: {
    port: 3000
  }
})
