import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { vercelApiPlugin } from './vite-api-plugin'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss(), vercelApiPlugin()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor-react': ['react', 'react-dom', 'react-router-dom'],
                    'vendor-query': ['@tanstack/react-query'],
                    'vendor-supabase': ['@supabase/supabase-js'],
                    'vendor-motion': ['motion'],
                    'vendor-i18n': [
                        'i18next',
                        'react-i18next',
                        'i18next-browser-languagedetector',
                    ],
                    'vendor-ui': ['lucide-react', 'react-markdown'],
                },
            },
        },
    },
})
