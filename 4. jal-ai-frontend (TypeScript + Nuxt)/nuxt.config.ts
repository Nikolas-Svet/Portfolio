import svgLoader from 'vite-svg-loader'
import logoUrl from './assets/images/logo.svg'

const { VITE_API_URL } = import.meta.env

import { URL as NodeURL } from 'node:url'
  ;(globalThis as any).URL = NodeURL

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@pinia/nuxt'],
  css: ['~/assets/styles/main.scss'],
  components: true,
  app: {
    head: {
      titleTemplate: '%s — JAL Consulting',
      link: [
        // { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg'},
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ]
    }
  },
  vite: {
    server: {
      proxy: {
        '/questionnaire': {
          target: VITE_API_URL,
          changeOrigin: true,
          secure: false,
        },
        '/media/answers': {
          target: VITE_API_URL,
          changeOrigin: true,
          secure: false,
        },
      }
    },
    plugins: [
      svgLoader({
      })
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "sass:map";
            @use "@/assets/styles/_variables.scss" as *;
          `
        }
      }
    }
  }
})