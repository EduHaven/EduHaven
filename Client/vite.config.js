import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const isExtension = mode === "extension";

  return {
    base: isExtension ? "./" : "/",
    plugins: [react()],
    resolve: {
      alias: { "@/": path.resolve(__dirname, "src") + "/" },
    },
    build: {
      outDir: isExtension ? "dist-extension" : "dist",
      emptyOutDir: true,
      rollupOptions: {
        input: path.resolve(__dirname, "index.html"),
      },
    },
    server: {
    allowedHosts: [
      "5173-shrishtimangla-eduhaven-i83bkzh3i87.ws-us120.gitpod.io"
    ]
  }
    // dev server only—no need for historyApiFallback here
  };
});



// vite.config.js old
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import path from "path";

// export default defineConfig({
//   base: "./",
//   plugins: [react()],
//   resolve: {
//     alias: { "@/": path.resolve(__dirname, "src") + "/" },
//   },
//   build: {
//     outDir: "dist",
//     emptyOutDir: true,
//     rollupOptions: {
//       input: path.resolve(__dirname, "index.html"),
//     },
//   },
//   server: {
//     historyApiFallback: true,
//   },
// });
