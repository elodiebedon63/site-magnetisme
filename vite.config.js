import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/site-magnetisme/', // remplacer par '/' si DNS
  root: 'src',
  publicDir: '../assets',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        visualisation: resolve(__dirname, 'src/visualisation-arbre.html'),
      },
    },
  },
  server: {
    open: true,
    port: 3000,
  },
});
