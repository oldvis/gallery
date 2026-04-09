import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'
import { configure } from 'vue-gtag'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import App from './App.vue'
import { useStore as useVisualizationStore } from './stores/visualization'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import './styles/scrollbar.css'
import 'uno.css'

configure({
  tagId: import.meta.env.VITE_GA_ID,
})

const app = createApp(App)
const pinia = createPinia().use(piniaPluginPersistedstate)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
app.use(router)
app.use(pinia)
app.mount('#app')

useVisualizationStore(pinia).initialize()
