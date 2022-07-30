import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/assets/scss/global.scss";`,
      },
    },
  },
  resolve: {
    alias: [
      {
        find: "vue-i18n",
        replacement: "vue-i18n/dist/vue-i18n.cjs.js",
      },
    ],
  },
});
