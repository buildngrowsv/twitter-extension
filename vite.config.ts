import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { copyFileSync } from 'fs';
import dotenv from 'dotenv';

// Load env file
dotenv.config();

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-files',
      writeBundle() {
        // Copy all necessary files to dist
        const filesToCopy = ['manifest.json', 'background.js', 'content.js'];
        
        filesToCopy.forEach(file => {
          copyFileSync(
            path.resolve(__dirname, file),
            path.resolve(__dirname, `dist/${file}`)
          );
        });
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      }
    }
  },
  define: {
    'process.env': process.env
  }
});