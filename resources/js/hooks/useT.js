import { usePage } from '@inertiajs/react';

export function useT() {
    const { translations = {} } = usePage().props;

    return (key, fallback = '') => {
        if (!translations) return fallback ?? key;

        // 1. Direct exact key match (flat JSON support, e.g. "nav.home")
        if (translations[key] !== undefined && translations[key] !== null) {
            return translations[key];
        }

        // 2. Nested key traversal support (e.g. translations.nav.home)
        try {
            const nestedValue = String(key)
                .split('.')
                .reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), translations);

            if (nestedValue !== undefined && nestedValue !== null) {
                return nestedValue;
            }
        } catch (e) {}

        return fallback ?? key;
    };
}
