import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './en.json'
import de from './de.json'
import fr from './fr.json'
import es from './es.json'
import tr from './tr.json'

export const resources = {
  en: { translation: en },
  de: { translation: de },
  fr: { translation: fr },
  es: { translation: es },
  tr: { translation: tr }
} as const

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,

    //lng: "en",  /* we use LanguageDetector instead */
    fallbackLng: "en",

    interpolation: {
      escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    }
  })
