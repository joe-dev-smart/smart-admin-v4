import {
    IconLayoutDashboard,
    IconUserCircle,
    IconBellRinging,
    IconCreditCard,
    IconSettings2,
    IconHeadset,
    IconLock,
    IconLogout2,
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
        label: 'Dashboard',
        icon: IconLayoutDashboard,
        url: '/dashboard',
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
