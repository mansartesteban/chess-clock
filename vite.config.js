import { defineConfig } from "vite";
import path from "path";
import Vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import tailwindcss from "@tailwindcss/vite";
import Component from "unplugin-vue-components/vite";

const root = path.resolve(__dirname);

export default defineConfig({
  plugins: [
    Vue(),
    tailwindcss(),
    AutoImport({
      imports: ["vue"],
    }),
    Component(),
  ],
  resolve: {
    alias: {
      "@": path.join(root, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern",
      },
    },
  },
});
