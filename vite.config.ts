import reactRefresh from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  root: "./src",
  base: "",
  plugins: [
    reactRefresh(),
    {
      name: "override-config",
      config: () => ({
        build: {
          polyfillModulePreload: false,
          target: "esnext",
        },
      }),
    },
  ],
});
