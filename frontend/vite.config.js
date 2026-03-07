/*
 * Vite configuration
 *
 * LOCAL DEVELOPMENT:
 *   - Dev server on port 5173
 *   - /api/* proxied to http://localhost:5000 (local backend)
 *   - VITE_API_BASE_URL is NOT needed locally
 *
 * PRODUCTION (Vercel):
 *   - Set VITE_API_BASE_URL in Vercel Environment Variables to:
 *     https://your-railway-app.up.railway.app/api
 *   - Vite bakes this value in at build time (import.meta.env.VITE_API_BASE_URL)
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                secure: false
            }
        }
    },
    build: {
        outDir: 'dist',
        sourcemap: false
    }
})
