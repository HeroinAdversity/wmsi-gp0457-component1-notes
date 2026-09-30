import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    // Installable phone app (PWA): home-screen icon, full-screen launch, offline cache.
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png', 'watermark.png', 'notes-export.css', 'notes-export.js'],
      manifest: {
        id: '/',
        name: 'WMSI Global Perspectives 0457',
        short_name: 'GP 0457',
        description: 'Interactive IGCSE Global Perspectives 0457 notes, practice and games for WMSI Ipoh.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'any',
        background_color: '#FCFBF6',
        theme_color: '#F5F1E8',
        categories: ['education'],
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,mjs,css,html,svg,png,woff2}'],
        // /legacy is ~50 MB of old pages; cache those only as they're opened.
        globIgnores: ['legacy/**'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/legacy\//],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ url }) => url.origin === 'https://cdn.jsdelivr.net',
            handler: 'CacheFirst',
            options: {
              cacheName: 'cdn-libs',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 90 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/legacy/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'legacy-pages',
              networkTimeoutSeconds: 4,
              expiration: { maxEntries: 200 },
            },
          },
        ],
      },
    }),
  ],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'es2020',
  },
  server: {
    port: 5173,
    open: false,
  },
});
