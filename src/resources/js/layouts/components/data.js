import {
    IconLayoutDashboard,
    IconUserCircle,
    IconBellRinging,
    IconSettings2,
    IconHeadset,
    IconLogout2,
    IconBuildingStore,
    IconUsers,
    IconTruck,
    IconPackage,
    IconArrowsExchange,
    IconShoppingCart,
    IconReportAnalytics,
    IconCategory,
    IconTag,
    IconShoppingBag,
    IconShield,
    IconUserCog,
    IconKey,
    IconAdjustments,
} from '@tabler/icons-react';

export const userDropdownItems = [
    {
        label: 'Welcome back!',
        isHeader: true,
    },
    {
        label: 'Profile',
        icon: IconUserCircle,
        url: '/profile',
    },
    {
        label: 'Notifications',
        icon: IconBellRinging,
        url: '#',
    },
    {
        label: 'Account Settings',
        icon: IconSettings2,
        url: '/profile',
    },
    {
        label: 'Support Center',
        icon: IconHeadset,
        url: '#',
    },
    {
        isDivider: true,
    },
    {
        label: 'nav.settings',
        icon: IconAdjustments,
        url: '/settings',
        superAdminOnly: true,
    },
    {
        isDivider: true,
        superAdminOnly: true,
    },
    {
        label: 'Log Out',
        icon: IconLogout2,
        url: '/logout',
        method: 'post',
        class: 'text-danger fw-semibold',
    },
];

export const menuItems = [
    {
        key: 'menu',
        label: 'Menu',
        isTitle: true,
    },
    {
        key: 'dashboard',
        label: 'nav.dashboard',
        icon: IconLayoutDashboard,
        url: '/dashboard',
    },
    {
        key: 'stores',
        label: 'nav.stores',
        icon: IconBuildingStore,
        url: '/stores',
        permission: 'stores.view',
    },
    {
        key: 'clients',
        label: 'nav.clients',
        icon: IconUsers,
        url: '/clients',
        permission: 'clients.view',
    },
    {
        key: 'providers',
        label: 'nav.providers',
        icon: IconTruck,
        url: '/providers',
        permission: 'providers.view',
    },
    {
        key: 'categories',
        label: 'nav.categories',
        icon: IconCategory,
        url: '/categories',
        permission: 'categories.view',
    },
    {
        key: 'brands',
        label: 'nav.brands',
        icon: IconTag,
        url: '/brands',
        permission: 'brands.view',
    },
    {
        key: 'products',
        label: 'nav.products',
        icon: IconPackage,
        url: '/products',
        permission: 'products.view',
    },
    {
        key: 'purchases',
        label: 'nav.purchases',
        icon: IconShoppingBag,
        url: '/purchases',
        permission: 'purchases.view',
    },
    {
        key: 'transfers',
        label: 'nav.transfers',
        icon: IconArrowsExchange,
        url: '/transfers',
        permission: 'transfers.view',
    },
    {
        key: 'sales',
        label: 'nav.sales',
        icon: IconShoppingCart,
        url: '/sales',
        permission: 'sales.view',
    },
    {
        key: 'reports',
        label: 'nav.reports',
        icon: IconReportAnalytics,
        url: '/reports',
        permission: 'reports.view',
    },
    {
        key: 'security',
        label: 'nav.security',
        isTitle: true,
        superAdminOnly: true,
    },
    {
        key: 'roles',
        label: 'nav.roles',
        icon: IconKey,
        url: '/roles',
        superAdminOnly: true,
    },
    {
        key: 'users',
        label: 'nav.users',
        icon: IconUserCog,
        url: '/users',
        superAdminOnly: true,
    },
];

// Horizontal menu items (for horizontal layout)
export const horizontalMenuItems = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        icon: IconLayoutDashboard,
        url: '/dashboard',
    },
];
