import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false,
        }),
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    cssCodeSplit: false, // Merge all CSS into one file (reduces requests)
    minify: 'esbuild', // or 'terser'
    sourcemap: false, // disable in prod
    rollupOptions: {
      output: {
        manualChunks: {
          // Group heavy deps
          vendor: ['vue', 'vue-router', 'axios' /* add others */],
        },
      },
    },
  },
});
