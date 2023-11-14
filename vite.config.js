import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
import svgLoader from 'vite-svg-loader'
const path = require("path")

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteCommonjs(),
    svgLoader()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})