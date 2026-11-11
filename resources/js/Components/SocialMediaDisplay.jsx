import React from 'react';

export default function SocialMediaDisplay({ user, size = 'md', layout = 'horizontal', showLabels = false, rounded = true }) {
    const normalizeSocialMedia = (socialMedia) => {
        if (!socialMedia) {
            return {};
        }

        if (typeof socialMedia === 'string') {
            try {
                return normalizeSocialMedia(JSON.parse(socialMedia));
            } catch {
                return {};
            }
        }

        if (Array.isArray(socialMedia)) {
            return socialMedia.reduce((acc, entry) => {
                if (!entry || typeof entry !== 'object') {
                    return acc;
                }

                const [[platform, value]] = Object.entries(entry);
                if (platform && value != null && String(value).trim()) {
                    acc[platform] = String(value).trim();
                }

                return acc;
            }, {});
        }

        return Object.entries(socialMedia).reduce((acc, [platform, value]) => {
            if (platform && value != null && String(value).trim()) {
                acc[platform] = String(value).trim();
            }
            return acc;
        }, {});
    };

    const normalizedSocialMedia = normalizeSocialMedia(user?.social_media);

    if (Object.keys(normalizedSocialMedia).length === 0) {
        return null;
    }

    const platformConfigs = {
        telegram: {
            icon: 'M23.5 1.5c.8.4 1.2 1.2 1 2l-3 17c-.2 1-.9 1.4-1.9 1l-5.4-2.7-2.7 3.2c-.3.4-.8.5-1.3.2l.5-7.5L21 8c.9-.7-.2-1-2.8-.4L3.5 13 .8 5.3c-.3-1 .2-1.5 1.1-1.9l19.6-7.5z',
            color: 'from-blue-400 to-blue-600',
            hover: 'hover:shadow-lg hover:shadow-blue-500/30',
            label: 'Telegram',
            prefix: 'https://t.me/',
            username: true,
        },
        whatsapp: {
            icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.255.949c-1.238.503-2.335 1.236-3.356 2.306-1.022 1.071-1.854 2.431-2.477 3.868-.637 1.438-.953 2.945-.953 4.314 0 1.369.316 2.876.953 4.314.623 1.437 1.455 2.797 2.477 3.868 1.021 1.07 2.118 1.803 3.356 2.306 1.24.503 2.607.749 4.255.749 1.648 0 3.015-.246 4.255-.749 1.238-.503 2.335-1.236 3.356-2.306 1.022-1.071 1.854-2.431 2.477-3.868.637-1.438.953-2.945.953-4.314 0-1.369-.316-2.876-.953-4.314-.623-1.437-1.455-2.797-2.477-3.868-1.021-1.07-2.118-1.803-3.356-2.306-1.24-.503-2.607-.749-4.255-.749z',
            color: 'from-green-400 to-green-600',
            hover: 'hover:shadow-lg hover:shadow-green-500/30',
            label: 'WhatsApp',
            isPhone: true,
        },
        instagram: {
            icon: 'M12 2.163c3.204 0 3.584.011 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.011 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.011-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.011-3.584.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z',
            color: 'from-pink-400 to-purple-600',
            hover: 'hover:shadow-lg hover:shadow-pink-500/30',
            label: 'Instagram',
            prefix: 'https://instagram.com/',
            username: true,
        },
        facebook: {
            icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
            color: 'from-blue-500 to-blue-700',
            hover: 'hover:shadow-lg hover:shadow-blue-500/30',
            label: 'Facebook',
            prefix: 'https://facebook.com/',
            username: true,
        },
        twitter: {
            icon: 'M23.953 4.57a10 10 0 002.856-9.951c-1.574.155-3.135.754-4.566 1.679-.859-.98-1.9-1.825-3.129-2.403-.503 1.034-1.194 1.963-2.006 2.715C16.745 1.68 15.446 1 14 1c-3.314 0-6 2.686-6 6 0 .471.055.931.16 1.375-5.109-.329-9.566-2.736-12.195-6.514-.542.92-.851 1.995-.851 3.165 0 2.086 1.061 3.919 2.659 4.99-.987-.033-1.92-.402-2.738-1.002.002.034.002.067.002.1 0 2.906 2.068 5.345 4.82 5.897-.504.138-1.035.212-1.582.212-.387 0-.765-.038-1.136-.111.772 2.406 3.024 4.16 5.684 4.209-2.051 1.606-4.637 2.566-7.444 2.566-.484 0-.96-.032-1.426-.094 2.7 1.728 5.9 2.738 9.354 2.738 11.226 0 17.346-9.306 17.346-17.346 0-.264-.006-.528-.018-.79.841-.609 1.57-1.365 2.149-2.234z',
            color: 'from-blue-400 to-blue-600',
            hover: 'hover:shadow-lg hover:shadow-blue-400/30',
            label: 'Twitter / X',
            prefix: 'https://twitter.com/',
            username: true,
        },
        linkedin: {
            icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z',
            color: 'from-blue-600 to-blue-800',
            hover: 'hover:shadow-lg hover:shadow-blue-600/30',
            label: 'LinkedIn',
            prefix: 'https://linkedin.com/in/',
            username: true,
        },
        youtube: {
            icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
            color: 'from-red-500 to-red-700',
            hover: 'hover:shadow-lg hover:shadow-red-500/30',
            label: 'YouTube',
            prefix: 'https://youtube.com/@',
            username: true,
        },
        tiktok: {
            icon: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.92-2.89 2.89 2.89 0 0 1 2.31 1.46V9.4a6.18 6.18 0 1 0 10.86 3.9V8.54a7.73 7.73 0 0 0 3.75 1.07V6.3a4.81 4.81 0 0 1-.88-.61z',
            color: 'from-slate-700 to-slate-900',
            hover: 'hover:shadow-lg hover:shadow-slate-700/30',
            label: 'TikTok',
            prefix: 'https://tiktok.com/@',
            username: true,
        },
    };

    const sizeClasses = {
        sm: { icon: 'w-5 h-5', button: 'p-2', text: 'text-xs' },
        md: { icon: 'w-6 h-6', button: 'p-2.5', text: 'text-sm' },
        lg: { icon: 'w-7 h-7', button: 'p-3', text: 'text-base' },
        xl: { icon: 'w-8 h-8', button: 'p-3.5', text: 'text-lg' },
    };

    const currentSizes = sizeClasses[size] || sizeClasses.md;
    const layoutClass = {
        vertical: 'flex flex-col gap-3 items-start',
        grid: 'grid grid-cols-2 gap-3',
        horizontal: 'flex flex-wrap gap-2 items-center',
    }[layout] || 'flex flex-wrap gap-2 items-center';

    const getUrl = (platform, value) => {
        const config = platformConfigs[platform];
        if (!config) return value;
        
        if (config.isPhone) {
            // WhatsApp phone number
            return `https://wa.me/${value.replace(/\D/g, '')}`;
        }
        
        if (config.username && config.prefix) {
            // Check if value is already a URL
            if (value.startsWith('http://') || value.startsWith('https://')) {
                return value;
            }
            return config.prefix + value;
        }
        
        // Direct URL
        if (value.startsWith('http://') || value.startsWith('https://')) {
            return value;
        }
        return 'https://' + value;
    };

    const activeSocial = Object.entries(normalizedSocialMedia).filter(([_, url]) => url && url.trim());

    if (activeSocial.length === 0) {
        return null;
    }

    return (
        <div className={layoutClass}>
            {activeSocial.map(([platform, value]) => {
                const config = platformConfigs[platform];
                if (!config) return null;

                const url = getUrl(platform, value);

                return (
                    <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={config.label}
                        className={`social-media-link group relative inline-flex items-center justify-center 
                                   transition-all duration-300 ${currentSizes.button} 
                                   ${rounded ? 'rounded-full' : 'rounded-lg'}
                                   bg-gradient-to-br ${config.color} text-white
                                   ${config.hover} backdrop-blur-sm border border-white/20
                                   hover:-translate-y-1 hover:scale-105 active:scale-95`}
                        style={{
                            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.2)',
                        }}
                    >
                        <svg 
                            className={`fill-current ${currentSizes.icon}`}
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d={config.icon} />
                        </svg>

                        {showLabels && (
                            <span className={`absolute -bottom-8 left-1/2 -translate-x-1/2 
                                           whitespace-nowrap ${currentSizes.text} font-semibold 
                                           bg-slate-900 text-white px-3 py-1.5 rounded-lg
                                           opacity-0 group-hover:opacity-100 transition-opacity duration-200
                                           pointer-events-none z-10 border border-slate-700`}>
                                {config.label}
                            </span>
                        )}
                    </a>
                );
            })}
        </div>
    );
}
