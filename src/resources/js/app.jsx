import '../scss/app.scss';
import './bootstrap';
import './i18n'; // Initialize i18n

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { LayoutProvider } from '@/context/useLayoutContext';
import { NotificationProvider } from '@/context/useNotificationContext';

const appName = import.meta.env.VITE_APP_NAME || 'Smart Admin';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <LayoutProvider>
                <NotificationProvider>
                    <App {...props} />
                </NotificationProvider>
            </LayoutProvider>
        );
    },
    progress: {
        color: '#465dff',
    },
});
