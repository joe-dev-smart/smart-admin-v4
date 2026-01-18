/**
 * Application Configuration
 * Centralized configuration for app-wide settings
 *
 * Note: For UI text/labels that need translation, use i18n (useTranslation hook).
 * This file is for static configuration values (URLs, paths, contact info, etc.)
 */

export const appConfig = {
    // Company Information
    company: {
        name: 'Smart Ideas',
        fullName: 'Smart Ideas Bolivia',
        website: 'https://www.smartideasbo.com',
        phone: '+591 77455677',
        emails: {
            info: 'info@smartideasbo.com',
            sales: 'ventas@smartideasbo.com',
        },
    },

    // Assets paths
    assets: {
        logo: '/images/smart-ideas-logo.png',
        logoWhite: '/images/smart-ideas-logo.png',
        favicon: '/favicon.png',
    },

    // Theme colors (matching the screenshot)
    colors: {
        primary: '#00b8b8',
        primaryDark: '#009999',
        secondary: '#2d3e50',
        dark: '#1e2a38',
        background: '#263544',
    },

    // Copyright
    copyright: {
        year: new Date().getFullYear(),
    },
};

export default appConfig;
