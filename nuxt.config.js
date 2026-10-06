// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  devServer: {
    port: 3001,
    host: '0.0.0.0',
  },
  runtimeConfig: {
    public: {
      authMode: process.env.NUXT_PUBLIC_AUTH_MODE || "sso",
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://127.0.0.1:8453",
      ssoLoginUrl: process.env.NUXT_PUBLIC_SSO_LOGIN_URL || "http://localhost:3000",
      appUrl: process.env.NUXT_PUBLIC_APP_URL || "http://localhost:3001",
    },
  },
  app: {
    head: {
      titleTemplate: "%s · Template Nuxt",
      title: "Template Nuxt",
      htmlAttrs: {
        lang: "id",
        "data-theme": "light",
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Starter kit dan template aplikasi web modern berbasis Nuxt 4, Vue 3, DaisyUI v5, dan Tailwind CSS v4.",
        },
        {
          name: "keywords",
          content:
            "Template Nuxt, Nuxt 4, Vue 3, DaisyUI, Tailwind CSS, Starter Kit, Dashboard, Admin",
        },
        { name: "author", content: "Template Nuxt" },
        { name: "theme-color", content: "#059669" },
        {
          property: "og:title",
          content: "Template Nuxt - Modern Dashboard & Web App Starter Kit",
        },
        {
          property: "og:description",
          content:
            "Starter kit dan template aplikasi web modern berbasis Nuxt 4, Vue 3, DaisyUI v5, dan Tailwind CSS v4.",
        },
        { property: "og:type", content: "website" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      ],
    },
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  vite: {
    plugins: [tailwindcss()],
  },
  css: ["~/assets/css/main.css"],
});