import { createApp } from 'vue'
import App from './app.vue'
import router from './router'
import i18n from './i18n'

createApp(App).use(i18n).use(router).use(router)
  .mount('#app')
