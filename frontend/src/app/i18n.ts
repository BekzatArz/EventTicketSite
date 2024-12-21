"use client"
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import en from '../../public/locales/en/translation.json';
import ru from '../../public/locales/ru/translation.json';

i18n
    .use(I18nextBrowserLanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'ru',
        resources: {
            en: {translation: en},
            ru: {translation: ru}
        },
        detection: {
            order: ['querystring', 'cookie'],
            caches: ['cookie']
        },
        interpolation: {
            escapeValue: false 
        }
    })

export default i18n