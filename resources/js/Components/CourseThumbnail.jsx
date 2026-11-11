import { useState } from 'react';

const LOGO_SRC = '/logo.png?v=course-thumb';

export function courseHasThumbnail(thumbnail) {
    if (!thumbnail || typeof thumbnail !== 'string') return false;
    const value = thumbnail.trim();
    if (!value) return false;
    if (value === 'thumbnails/dummy.jpg' || value.endsWith('/dummy.jpg')) return false;
    return true;
}

export function courseThumbnailSrc(thumbnail) {
    if (!courseHasThumbnail(thumbnail)) return null;
    if (thumbnail.startsWith('http://') || thumbnail.startsWith('https://')) {
        return thumbnail.replace('/storage/', '/media/');
    }
    if (thumbnail.startsWith('/media/')) {
        return thumbnail;
    }
    if (thumbnail.startsWith('/storage/')) {
        return thumbnail.replace('/storage/', '/media/');
    }
    if (thumbnail.startsWith('/')) {
        return thumbnail;
    }
    return `/media/${thumbnail}`;
}

/**
 * Course card / hero image. Shows uploaded thumbnail when available;
 * otherwise (or on load error) shows the Success Life Coaching logo.
 */
export default function CourseThumbnail({
    thumbnail,
    alt = '',
    className = 'h-full w-full',
    imgClassName = 'h-full w-full object-cover',
    logoClassName = 'h-16 w-16 object-contain opacity-70 sm:h-20 sm:w-20',
}) {
    const [failed, setFailed] = useState(false);
    const src = courseThumbnailSrc(thumbnail);
    const showImage = Boolean(src) && !failed;

    return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-copper-700 via-copper-500 to-bronze ${className}`.trim()}>
            {showImage ? (
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    className={imgClassName}
                    onError={() => setFailed(true)}
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center">
                    <img src={LOGO_SRC} alt="Success Life Coaching" className={logoClassName} />
                </div>
            )}
        </div>
    );
}
