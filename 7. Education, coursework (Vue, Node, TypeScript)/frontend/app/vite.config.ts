import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import svgLoader from 'vite-svg-loader';
import AutoImport from 'unplugin-auto-import/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svgLoader(),
    // 1) Авто-импорт Vue, Vue Router, VueUse и т.п.
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        // '@vueuse/core'
      ],
      dts: 'src/auto-imports.d.ts'
    }),

    // 2) Авто-импорт компонентов из папки `components/`
    Components({
      dirs: ['src/components'],
      extensions: ['vue'],
      deep: true,
      dts: 'src/components.d.ts',
      resolvers: [
        ElementPlusResolver(),
      ]
    }),
    vueDevTools()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
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
})
