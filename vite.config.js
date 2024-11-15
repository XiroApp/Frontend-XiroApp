import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      injectRegister: "auto",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      // devOptions: {
      //   enabled: true,
      // },
      manifest: {
        name: "CIRO",
        short_name: "CIRO",
        description: "Fotocopias a domicilio",
        theme_color: "#fff",
        background_color: "#fff",
        icons: [
          {
            src: "logo-new.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "logo-new.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
