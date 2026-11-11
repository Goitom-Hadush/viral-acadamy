/**
 * Build a display-ready instructor contact object from social_media + phone + email.
 */
export function buildInstructorContact(instructor) {
    if (!instructor) {
        return { social_media: {}, email: null, phone: null, hasAny: false };
    }

    const normalize = (socialMedia) => {
        if (!socialMedia) return {};
        if (typeof socialMedia === 'string') {
            try {
                return normalize(JSON.parse(socialMedia));
            } catch {
                return {};
            }
        }
        if (Array.isArray(socialMedia)) {
            return socialMedia.reduce((acc, entry) => {
                if (!entry || typeof entry !== 'object') return acc;
                Object.entries(entry).forEach(([platform, value]) => {
                    if (platform && value != null && String(value).trim()) {
                        acc[platform] = String(value).trim();
                    }
                });
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

    const social = normalize(instructor.social_media);
    const phone = instructor.phone ? String(instructor.phone).trim() : '';
    const email = instructor.email ? String(instructor.email).trim() : '';

    if (phone && !social.whatsapp) {
        social.whatsapp = phone.replace(/\D/g, '');
    }

    return {
        ...instructor,
        social_media: social,
        email: email || null,
        phone: phone || null,
        hasAny: Object.keys(social).length > 0 || !!email || !!phone,
    };
}
