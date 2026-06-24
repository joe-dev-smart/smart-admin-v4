import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import esCommon from './locales/es/common.json';
import esStores from './locales/es/stores.json';
import esClients from './locales/es/clients.json';
import esProviders from './locales/es/providers.json';
import esCategories from './locales/es/categories.json';
import esBrands from './locales/es/brands.json';
import esProducts from './locales/es/products.json';
import esPurchases from './locales/es/purchases.json';
import esTransfers from './locales/es/transfers.json';
import esSales from './locales/es/sales.json';
import esReports from './locales/es/reports.json';
import esRoles from './locales/es/roles.json';
import esUsers from './locales/es/users.json';
import esProfile from './locales/es/profile.json';
import esAuth from './locales/es/auth.json';
import enCommon from './locales/en/common.json';
import enStores from './locales/en/stores.json';
import enClients from './locales/en/clients.json';
import enProviders from './locales/en/providers.json';
import enCategories from './locales/en/categories.json';
import enBrands from './locales/en/brands.json';
import enProducts from './locales/en/products.json';
import enPurchases from './locales/en/purchases.json';
import enTransfers from './locales/en/transfers.json';
import enSales from './locales/en/sales.json';
import enReports from './locales/en/reports.json';
import enRoles from './locales/en/roles.json';
import enUsers from './locales/en/users.json';
import enProfile from './locales/en/profile.json';
import enAuth from './locales/en/auth.json';

const resources = {
    es: {
        common: esCommon,
        stores: esStores,
        clients: esClients,
        providers: esProviders,
        categories: esCategories,
        brands: esBrands,
        products: esProducts,
        purchases: esPurchases,
        transfers: esTransfers,
        sales: esSales,
        reports: esReports,
        roles: esRoles,
        users: esUsers,
        profile: esProfile,
        auth: esAuth,
    },
    en: {
        common: enCommon,
        stores: enStores,
        clients: enClients,
        providers: enProviders,
        categories: enCategories,
        brands: enBrands,
        products: enProducts,
        purchases: enPurchases,
        transfers: enTransfers,
        sales: enSales,
        reports: enReports,
        roles: enRoles,
        users: enUsers,
        profile: enProfile,
        auth: enAuth,
    },
};

// Resolve the initial locale with this priority:
// 1. User's stored preference (localStorage)
// 2. Server-configured default (from Inertia's initial page props)
// 3. Spanish as the hard fallback
const getInitialLocale = () => {
    const stored = localStorage.getItem('i18nextLng');
    if (stored && ['es', 'en'].includes(stored)) return stored;

    try {
        const pageData = JSON.parse(
            document.getElementById('app')?.dataset?.page ?? '{}'
        );
        const serverLocale = pageData?.props?.defaultLocale;
        if (serverLocale && ['es', 'en'].includes(serverLocale)) return serverLocale;
    } catch {
        // ignore parse errors
    }

    return 'es';
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: getInitialLocale(),
        fallbackLng: 'es',
        defaultNS: 'common',
        ns: ['common', 'stores', 'clients', 'providers', 'categories', 'brands', 'products', 'purchases', 'transfers', 'sales', 'roles', 'users', 'profile', 'auth', 'reports'],
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
