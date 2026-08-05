import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

function syncPublicPlugin() {
  function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  return {
    name: 'sync-public-assets',
    buildStart() {
      const root = process.cwd();
      const jsDir = path.join(root, 'js');
      const cssDir = path.join(root, 'css');
      if (fs.existsSync(jsDir)) copyDir(jsDir, path.join(root, 'public', 'js'));
      if (fs.existsSync(cssDir)) copyDir(cssDir, path.join(root, 'public', 'css'));
      console.log('✅ Vite plugin: Synchronized js/ and css/ into public/');
    }
  };
}

export default defineConfig({
  plugins: [syncPublicPlugin()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    watch: process.env.WATCH_MODE ? {
      // https://rolldown.rs/reference/InputOptions.watch
      exclude: 'node_modules/**',
      include: ['js/**', 'css/**', 'index.html']
    } : null,
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html')
      },
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    rolldownOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html')
      }
    }
  }
});
