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
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            animations: ['framer-motion'],
          },
        },
      },
      // Enable source maps for production debugging
      sourcemap: true,
      // Optimize chunk size
      chunkSizeWarningLimit: 1000,
      // Minify CSS
      cssMinify: true,
    },
    // Performance optimizations
    optimizeDeps: {
      include: ['react', 'react-dom', 'framer-motion'],
    },
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
