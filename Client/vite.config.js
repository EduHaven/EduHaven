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
            // React core
            vendor: ["react", "react-dom"],

            // UI Libraries
            ui: [
              "@mantine/core",
              "@headlessui/react",
              "@radix-ui/react-dropdown-menu",
              "@radix-ui/react-slot",
              "framer-motion",
              "lucide-react",
              "react-icons"
            ],

            // Routing and state management
            router: ["react-router-dom", "@tanstack/react-query", "zustand"],

            // Rich text editor (TipTap)
            editor: [
              "@tiptap/react",
              "@tiptap/starter-kit",
              "@tiptap/extension-file-handler",
              "@tiptap/extension-highlight",
              "@tiptap/extension-image",
              "@tiptap/extension-placeholder",
              "@tiptap/extension-table",
              "@tiptap/extension-table-cell",
              "@tiptap/extension-table-header",
              "@tiptap/extension-table-row",
              "@tiptap/extension-task-item",
              "@tiptap/extension-task-list",
              "@tiptap/extension-typography"
            ],

            // Charts and data visualization
            charts: ["recharts"],

            // 3D Graphics (Three.js)
            three: ["three", "three-orbitcontrols", "three-stdlib"],

            // Utilities and helpers
            utils: [
              "axios",
              "jwt-decode",
              "date-fns",
              "socket.io-client",
              "react-toastify",
              "react-hook-form",
              "react-calendar",
              "react-easy-crop",
              "react-markdown",
              "react-infinite-scroll-component",
              "react-beautiful-dnd",
              "react-resizable",
              "react-resizable-panels",
              "use-sound",
              "sudoku"
            ],

            // Styling
            styles: [
              "tailwindcss",
              "tailwind-merge",
              "class-variance-authority",
              "clsx",
              "animate.css"
            ]
          },
        },
        // Suppress Node.js module warnings for build tools
        onwarn(warning, warn) {
          // Suppress warnings about Node.js modules being externalized
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE' ||
              warning.message.includes('has been externalized for browser compatibility')) {
            return;
          }
          warn(warning);
        },
      },
      // Enable source maps for production debugging
      sourcemap: true,
      // Optimize chunk size - increased limit since we have proper code splitting
      chunkSizeWarningLimit: 1500,
      // Minify CSS
      cssMinify: true,
    },
    // Performance optimizations
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "framer-motion",
        "@tanstack/react-query",
        "react-router-dom",
        "zustand"
      ],
      exclude: ["@vite/client", "@vite/env"],
    },
    // Suppress build warnings
    logLevel: "info",
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
