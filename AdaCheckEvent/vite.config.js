import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Tailwind is handled via PostCSS (postcss.config.js). No separate Vite plugin required.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
