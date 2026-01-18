import {
    IconLayoutDashboard,
    IconUserCircle,
    IconBellRinging,
    IconCreditCard,
    IconSettings2,
    IconHeadset,
    IconLock,
    IconLogout2,
    IconBuildingStore,
    IconUsers,
    IconTruck,
    IconPackage,
    IconArrowsExchange,
    IconShoppingCart,
    IconReportAnalytics,
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
    },
    {
        key: 'clients',
        label: 'nav.clients',
        icon: IconUsers,
        url: '/clients',
    },
    {
        key: 'providers',
        label: 'nav.providers',
        icon: IconTruck,
        url: '/providers',
    },
    {
        key: 'products',
        label: 'nav.products',
        icon: IconPackage,
        url: '/products',
        disabled: true, // Coming soon
    },
    {
        key: 'movements',
        label: 'nav.movements',
        icon: IconArrowsExchange,
        url: '/movements',
        disabled: true, // Coming soon
    },
    {
        key: 'sales',
        label: 'nav.sales',
        icon: IconShoppingCart,
        url: '/sales',
        disabled: true, // Coming soon
    },
    {
        key: 'reports',
        label: 'nav.reports',
        icon: IconReportAnalytics,
        url: '/reports',
        disabled: true, // Coming soon
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
