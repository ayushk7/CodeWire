import { defineConfig } from 'vite';
import { cpSync } from 'node:fs';

export default defineConfig({
  root: 'src',
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  plugins: [{
    name: 'copy-vendor',
    closeBundle() {
      cpSync('src/vendor', 'dist/vendor', { recursive: true });
    },
  }],
});
