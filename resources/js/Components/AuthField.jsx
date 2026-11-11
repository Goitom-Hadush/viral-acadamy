import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

/**
 * AuthField — a branded, green-themed form field for the auth pages.
 *
 * Features:
 *  - Optional leading icon (passed via the `icon` prop)
 *  - Optional trailing element (e.g. a password show/hide toggle)
 *  - Inline validation error rendering
 *  - Smooth focus ring in the brand `copper` palette
 *
 * Usage:
 *   <AuthField id="login" label="Email" icon={UserIcon} value={...} onChange={...} error={errors.login} />
 */
export default forwardRef(function AuthField(
    {
        label,
        id,
        name,
        icon: Icon,
        trailing,
        type = 'text',
        isFocused = false,
        error,
        className = '',
        ...props
    },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <div>
            {label && (
                <label
                    htmlFor={id}
                    className="mb-2 block text-sm sm:text-xs font-semibold tracking-wide text-slate-700"
                >
                    {label}
                </label>
            )}

            <div className="relative">
                {Icon && (
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 sm:pl-3.5 text-copper-500 transition-colors">
                        <Icon className="h-5 w-5" />
                    </span>
                )}

                <input
                    {...props}
                    id={id}
                    name={name}
                    type={type}
                    ref={localRef}
                    className={
                        'block w-full rounded-2xl border bg-slate-50/70 py-4 sm:py-3.5 px-4 text-base sm:text-sm text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 hover:border-copper-300 focus:bg-white focus:outline-none ' +
                        (Icon ? 'pl-13 sm:pl-11 ' : 'pl-4 ') +
                        (trailing ? 'pr-13 sm:pr-12 ' : 'pr-4 ') +
                        (error
                            ? 'border-rose-300 bg-rose-50/40 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/15 '
                            : 'border-slate-200 focus:border-copper-500 focus:ring-4 focus:ring-copper-500/15 ') +
                        className
                    }
                />

                {trailing && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-1.5">
                        {trailing}
                    </span>
                )}
            </div>

            {error && (
                <p
                    role="alert"
                    className="mt-2 flex items-center gap-1.5 text-sm sm:text-xs font-medium text-rose-600"
                >
                    <svg
                        className="h-4 w-4 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.2}
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m0 3.75h.007v.008H12v-.008Zm9-3.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
});
