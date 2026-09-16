import '../css/app.css';
import './bootstrap';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

if (typeof window !== 'undefined') {
    // 1. Intercept all Inertia visits to ensure /index.php is preserved when running in index.php mode
    router.on('before', (event) => {
        const isIndexPhpMode = window.location.pathname.includes('/index.php');
        if (!isIndexPhpMode) return;

        const visit = event.detail.visit;
        if (!visit) return;

        if (visit.url instanceof URL) {
            if (visit.url.pathname && !visit.url.pathname.startsWith('/index.php')) {
                visit.url.pathname = '/index.php' + visit.url.pathname;
            }
        } else if (typeof visit.url === 'string') {
            try {
                const parsed = new URL(visit.url, window.location.origin);
                if (parsed.pathname && !parsed.pathname.startsWith('/index.php')) {
                    parsed.pathname = '/index.php' + parsed.pathname;
                }
                visit.url = parsed;
            } catch (e) {
                if (!visit.url.startsWith('/index.php') && visit.url.startsWith('/')) {
                    visit.url = '/index.php' + visit.url;
                }
            }
        }
    });

    // 2. Prevent Inertia error dialog popup if a 404 or HttpException occurs
    router.on('httpException', (event) => {
        const response = event.detail?.response;
        if (response && (response.status === 404 || response.status === 403)) {
            // Cancel default Inertia error dialog popup
            event.preventDefault();

            // If we somehow hit 404 and current URL doesn't have /index.php, do a clean redirect
            const path = window.location.pathname;
            if (!path.startsWith('/index.php')) {
                window.location.replace('/index.php' + path + window.location.search + window.location.hash);
            }
        }
    });
}

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'SchoolQuest';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#06b6d4',
    },
});

