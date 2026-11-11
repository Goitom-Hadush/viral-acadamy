import { useEffect, useCallback } from 'react';

/**
 * useFormHandler - Enhanced form handling hook for auth forms.
 * 
 * Provides:
 * - Automatic field focus management
 * - Loading state prevention (no double submission)
 * - Success/error visual feedback
 * - Smooth form reset with field clearing
 * - Accessibility improvements
 * 
 * Usage:
 *   const { submitForm, canSubmit, focusFirstError } = useFormHandler(
 *     { data, post, processing, errors, reset },
 *     { onSubmitStart, onSuccess, onError }
 *   );
 */
export function useFormHandler(inertiaForm, callbacks = {}) {
    const { data, post, processing, errors, reset } = inertiaForm;
    const { onSubmitStart, onSuccess, onError } = callbacks;

    // Prevent double submission
    const canSubmit = !processing && Object.keys(errors).length === 0;

    // Focus the first field with an error
    const focusFirstError = useCallback((formRef) => {
        if (!formRef || Object.keys(errors).length === 0) return;

        const firstErrorField = Object.keys(errors)[0];
        const errorElement = formRef.querySelector(`[name="${firstErrorField}"]`);
        
        if (errorElement) {
            errorElement.focus();
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [errors]);

    // Enhanced submit handler
    const submitForm = useCallback((e, route, options = {}) => {
        e.preventDefault();

        if (processing) return; // Prevent double submission

        onSubmitStart?.();

        post(route, {
            onSuccess: () => {
                onSuccess?.();
            },
            onError: () => {
                // Auto-focus first error field
                const form = e.target;
                focusFirstError(form);
                onError?.();
            },
            ...options,
        });
    }, [processing, post, onSubmitStart, onSuccess, onError, focusFirstError]);

    // Reset form helper
    const clearForm = useCallback((...fields) => {
        reset(...fields);
    }, [reset]);

    return {
        submitForm,
        clearForm,
        canSubmit,
        focusFirstError,
        processing,
        hasErrors: Object.keys(errors).length > 0,
        errorCount: Object.keys(errors).length,
    };
}
