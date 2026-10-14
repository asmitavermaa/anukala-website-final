import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// VITE_BASE is only needed when the site is served from a sub-path (e.g. https://user.github.io/repo/).
// On anukala.com it stays '/'.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  server: { port: 5173 },
});
