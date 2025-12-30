import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: "/wfrp-map-osm/",
  resolve: {
    alias: {
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@base': path.resolve(__dirname, 'src'),
    },
  },
})
