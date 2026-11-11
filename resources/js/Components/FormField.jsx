import { forwardRef, useImperativeHandle, useRef } from 'react';

/**
 * FormField - Advanced form field component with built-in validation feedback
 * and success/loading states.
 * 
 * Features:
 * - Error state styling
 * - Optional success state when field is valid
 * - Loading state for async validation
 * - Helper text support
 * - Accessibility enhancements (aria-invalid, aria-describedby)
 * - Smooth transitions and visual feedback
 * 
 * Usage:
 *   <FormField
 *     label="Email"
 *     value={email}
 *     onChange={handleChange}
 *     error={errors.email}
 *     helper="We'll never share your email"
 *     required
 *   />
 */
export default forwardRef(function FormField(
    {
        label,
        id,
        name,
        type = 'text',
        value = '',
        onChange,
        error = null,
        helper = null,
        icon: Icon = null,
        trailing = null,
        isLoading = false,
        showSuccess = false,
        isFocused = false,
        required = false,
        disabled = false,
        className = '',
        ...props
    },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
        blur: () => localRef.current?.blur(),
        clear: () => {
            if (localRef.current) localRef.current.value = '';
        },
    }));

    const hasError = !!error;
    const fieldId = id || `field-${name}`;
    const errorId = `${fieldId}-error`;
    const helperId = `${fieldId}-helper`;
    const describedBy = [hasError ? errorId : null, helper ? helperId : null]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label
                    htmlFor={fieldId}
                    className={`block text-sm font-semibold ${
                        hasError ? 'text-rose-700' : 'text-slate-700'
                    }`}
                >
                    {label}
                    {required && <span className="ml-1 text-rose-600">*</span>}
                </label>
            )}

            <div className="relative">
                {Icon && (
                    <span className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 transition-colors ${
                        hasError
                            ? 'text-rose-400'
                            : showSuccess
                            ? 'text-emerald-500'
                            : 'text-slate-400'
                    }`}>
                        <Icon className="h-5 w-5" />
                    </span>
                )}

                <input
                    {...props}
                    ref={localRef}
                    id={fieldId}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    disabled={disabled || isLoading}
                    aria-invalid={hasError}
                    aria-describedby={describedBy}
                    className={
                        'block w-full rounded-2xl border bg-slate-50/70 py-3 text-sm text-slate-900 shadow-sm transition-all duration-200 ' +
                        'placeholder:text-slate-400 hover:border-slate-300 ' +
                        'focus:bg-white focus:outline-none ' +
                        (Icon ? 'pl-11 ' : 'pl-4 ') +
                        (trailing || isLoading ? 'pr-12 ' : 'pr-4 ') +
                        (hasError
                            ? 'border-rose-300 bg-rose-50/40 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/15 '
                            : showSuccess
                            ? 'border-emerald-300 bg-emerald-50/40 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/15 '
                            : 'border-slate-200 focus:border-slate-400 focus:ring-4 focus:ring-slate-500/10 ') +
                        (disabled ? 'cursor-not-allowed opacity-60 ' : '')
                    }
                />

                {isLoading && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3.5">
                        <svg className="h-5 w-5 animate-spin text-slate-400" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    </span>
                )}

                {!isLoading && showSuccess && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-emerald-500">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </span>
                )}

                {!isLoading && trailing && !showSuccess && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-1.5">
                        {trailing}
                    </span>
                )}
            </div>

            {hasError && (
                <p id={errorId} role="alert" className="flex items-center gap-1.5 text-xs font-medium text-rose-600">
                    <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.007v.008H12v-.008Zm9-3.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    {error}
                </p>
            )}

            {helper && !hasError && (
                <p id={helperId} className="text-xs text-slate-500">
                    {helper}
                </p>
            )}
        </div>
    );
});
