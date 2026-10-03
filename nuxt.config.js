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
      titleTemplate: "%s · Jejak Dana",
      title: "Jejak Dana",
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
            "Aplikasi Manajemen Keuangan Pribadi (Multi-Platform Wallet & Smart Reconciliation) dengan dukungan BSI, Bank Jago, ShopeePay, DANA, dan Cash.",
        },
        {
          name: "keywords",
          content:
            "Jejak Dana, Keuangan Pribadi, Expense Tracker, Multi-Wallet, Rekonsiliasi Saldo, BSI, Jago, ShopeePay, DANA, Cash",
        },
        { name: "author", content: "Jejak Dana" },
        { name: "theme-color", content: "#059669" },
        {
          property: "og:title",
          content: "Jejak Dana - Smart Personal Finance & Multi-Wallet Tracker",
        },
        {
          property: "og:description",
          content:
            "Kelola saldo multi-platform bank & e-wallet, catat pengeluaran berbukti struk, dan rekonsiliasi saldo presisi tanpa selisih.",
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