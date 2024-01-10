import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'



// https://vitejs.dev/config/
export default defineConfig({
  base:'https://claydegruchy.github.io/wfrp-map-osm/',
  plugins: [react()],
  publicDir: 'src/public'
})
