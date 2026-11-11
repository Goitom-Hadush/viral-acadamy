import { router } from '@inertiajs/react';
import { useState } from 'react';
import { useT } from '@/hooks/useT';

export function useUploadProgress() {
    const [progress, setProgress] = useState(0);

    const start = () => setProgress(0);
    const finish = () => setProgress(0);
    const onProgress = (event) => {
        const pct = Number(event?.percentage);
        setProgress(Number.isFinite(pct) ? Math.max(0, Math.min(100, Math.round(pct))) : 0);
    };

    const cancel = () => {
        router.cancel();
        setProgress(0);
    };

    return { progress, start, finish, onProgress, cancel };
}

export function uploadingLabel(processing, progress, idleLabel = 'Upload', t = (_key, fallback) => fallback) {
    if (!processing) return idleLabel;
    const pct = Math.max(0, Math.min(100, Math.round(Number(progress) || 0)));
    if (pct <= 0) return t('common.uploading', 'Uploading…');
    if (pct < 100) return t('common.uploading_pct', 'Uploading {percent}%').replace('{percent}', pct);
    return t('common.processing', 'Processing…');
}

/** Abort the active Inertia upload visit and reset local progress. */
export function cancelActiveUpload(finish) {
    router.cancel();
    if (typeof finish === 'function') finish();
}

export default function UploadProgress({
    show = false,
    progress = 0,
    label,
    doneLabel,
    onCancel = null,
}) {
    const t = useT();
    label = label ?? t('common.uploading', 'Uploading…');
    doneLabel = doneLabel ?? t('common.processing', 'Processing…');

    if (!show) return null;

    const pct = Math.max(0, Math.min(100, Math.round(Number(progress) || 0)));
    const complete = pct >= 100;

    return (
        <div className="rounded-2xl border border-copper-200 bg-copper-50 p-4" role="status" aria-live="polite">
            <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin text-copper-700" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span className="text-sm font-semibold text-copper-800">
                        {complete ? doneLabel : label}
                    </span>
                </div>
                <span className="text-sm font-black text-copper-800">
                    {complete ? '✓' : `${pct}%`}
                </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-copper-200">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-copper-500 via-accent to-bronze transition-all duration-300 ease-out"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-copper-700">
                    {complete
                        ? t('common.upload_complete', 'Upload complete — saving to server…')
                        : t('common.keep_window_open', 'Please keep this window open until the upload finishes.')}
                </p>
                {typeof onCancel === 'function' ? (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-xl border border-rose-200 bg-white px-3 py-1.5 text-xs font-bold text-rose-700 transition hover:bg-rose-50"
                    >
                        {t('common.cancel_upload', 'Cancel upload')}
                    </button>
                ) : null}
            </div>
        </div>
    );
}
