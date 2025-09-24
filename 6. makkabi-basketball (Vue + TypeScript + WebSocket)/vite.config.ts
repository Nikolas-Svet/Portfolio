import {defineConfig, loadEnv} from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [vue()],
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false
        }
      }
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "sass:map";
            @use "@/assets/styles/components/_variables.scss" as *;
          `
        }
      }
    },
  };
});
