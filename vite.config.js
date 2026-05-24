import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/', // remplacer par '/' si DNS
  root: 'src',
  publicDir: '../assets',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html')
      },
    },
  },
  server: {
    open: true,
    port: 3000,
  },
});
