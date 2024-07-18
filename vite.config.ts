import reactRefresh from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    root: "./src",
    base: "",
    plugins: [reactRefresh()],
    build: {
      polyfillModulePreload: false,
      target: "esnext",
    },
  });
};
