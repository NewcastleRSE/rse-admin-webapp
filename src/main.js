import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import SimpleTypeahead from 'vue3-simple-typeahead'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '@/assets/styles/index.css'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App)
  .use(pinia)
  .use(SimpleTypeahead)
  .use(router)
  .mount('#app')