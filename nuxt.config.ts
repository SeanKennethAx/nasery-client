export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: {
    enabled: true,
  },

  modules: [
    '@nuxtjs/tailwindcss',
  ],

  runtimeConfig: {
    public: {
      supabaseUrl: '',
      supabaseKey: '',
      appName: process.env.APP_NAME,
      apiBaseURL: process.env.API_BASE_URL,
      appBaseURL: process.env.APP_BASE_URL,
    },

  },
})