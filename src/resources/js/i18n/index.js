import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import esCommon from './locales/es/common.json';
import esStores from './locales/es/stores.json';
import esClients from './locales/es/clients.json';
import esAuth from './locales/es/auth.json';
import enCommon from './locales/en/common.json';
import enStores from './locales/en/stores.json';
import enClients from './locales/en/clients.json';
import enAuth from './locales/en/auth.json';

const resources = {
    es: {
        common: esCommon,
        stores: esStores,
        clients: esClients,
        auth: esAuth,
    },
    en: {
        common: enCommon,
        stores: enStores,
        clients: enClients,
        auth: enAuth,
    },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'es', // Default to Spanish
        defaultNS: 'common',
        ns: ['common', 'stores', 'clients', 'auth'],
        interpolation: {
            escapeValue: false, // React already handles XSS
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    });

export default i18n;
