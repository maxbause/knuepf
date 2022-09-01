import { createI18n } from 'vue-i18n'
import en from './locales/en.json'

type MessageSchema = typeof en
export default createI18n<[MessageSchema], 'en'>({
  legacy: false,
  globalInjection: true,
  locale: process.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: {
    en,
  },
})
