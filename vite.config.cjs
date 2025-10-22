// vite.config.cjs (CommonJS so it works even with "type":"module")
const { defineConfig } = require("vite");
const react = require("@vitejs/plugin-react");

// IMPORTANT: keep target modern to avoid top-level-await transpile issues
module.exports = defineConfig({
  plugins: [react()],
  build: {
    target: "es2020",
    chunkSizeWarningLimit: 900
  },
  server: {
    port: 5173,
    open: true
  }
});
