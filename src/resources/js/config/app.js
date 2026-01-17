/**
 * Application Configuration
 * Centralized configuration for app-wide settings
 *
 * Note: For UI text/labels, use @/config/labels.js instead.
 * This file is for configuration values (URLs, paths, contact info, etc.)
 */

import { company as companyLabels } from './labels';

export const appConfig = {
    // Company Information (text from labels, config values here)
    company: {
        name: companyLabels.name,
        fullName: companyLabels.fullName,
        tagline: companyLabels.tagline,
        description: companyLabels.description,
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
        text: companyLabels.copyright,
    },
};

export default appConfig;
