import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl'; // Import the GLSL plugin

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    glsl() // Add the GLSL plugin here
  ],
});
