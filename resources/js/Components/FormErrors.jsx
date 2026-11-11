/**
 * FormErrors — shows a summary banner listing all validation errors.
 * Use inside any form: <FormErrors errors={errors} />
 * Automatically hidden when there are no errors.
 */
import { useT } from '@/hooks/useT';

export default function FormErrors({ errors = {} }) {
    const t = useT();
    const messages = Object.values(errors).filter(Boolean);
    if (messages.length === 0) return null;

    return (
        <div className="mb-5 overflow-hidden rounded-2xl border border-rose-200 bg-rose-50">
            {/* header strip */}
            <div className="flex items-center gap-2 border-b border-rose-200 bg-rose-100/60 px-4 py-2.5">
                <svg className="h-4 w-4 shrink-0 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-sm font-bold text-rose-700">
                    {messages.length === 1 ? t('form.fix_error', 'Please fix the error below:') : t('form.fix_errors', 'Please fix {count} errors below:').replace('{count}', messages.length)}
                </p>
            </div>
            {/* error list */}
            <ul className="space-y-1 px-4 py-3">
                {messages.map((msg, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-rose-700">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                        {msg}
                    </li>
                ))}
            </ul>
        </div>
    );
}
