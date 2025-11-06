import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import routes from 'virtual:generated-pages'
import { createApp } from 'vue'
import { configure } from 'vue-gtag'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import './styles/scrollbar.css'
import 'uno.css'

configure({
  tagId: import.meta.env.VITE_GA_ID,
})

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
app.use(router)
app.use(createPinia().use(piniaPluginPersistedstate))
app.mount('#app')
