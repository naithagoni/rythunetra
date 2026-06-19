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
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (
                            id.includes('/react/') ||
                            id.includes('/react-dom/') ||
                            id.includes('/react-router-dom/') ||
                            id.includes('/react-i18next/')
                        ) {
                            return 'vendor-react'
                        }
                        if (id.includes('/@tanstack/react-query/')) {
                            return 'vendor-query'
                        }
                        if (id.includes('/@supabase/supabase-js/')) {
                            return 'vendor-supabase'
                        }
                        if (id.includes('/motion/')) {
                            return 'vendor-motion'
                        }
                        if (
                            id.includes('/i18next/') ||
                            id.includes('/i18next-browser-languagedetector/')
                        ) {
                            return 'vendor-i18n'
                        }
                        if (
                            id.includes('/lucide-react/') ||
                            id.includes('/react-markdown/')
                        ) {
                            return 'vendor-ui'
                        }
                    }

                    if (id.includes('/src/components/ui/')) {
                        return 'vendor-ui-primitives'
                    }
                    if (id.includes('/src/pages/admin/')) {
                        return 'app-admin-pages'
                    }
                    if (id.includes('/src/config/')) {
                        return 'app-config'
                    }
                },
            },
        },
    },
})
