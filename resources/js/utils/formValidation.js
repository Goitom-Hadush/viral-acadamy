/**
 * Form Validation Utilities
 * Provides common validation patterns and helpers
 */

export const ValidationRules = {
    // Email validation
    email: (value) => {
        if (!value) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? null : 'Invalid email format';
    },

    // Phone number validation (Ethiopian format: 09xxxxxxxx or +251xxxxxxxxx)
    phone: (value) => {
        if (!value) return 'Phone number is required';
        const phoneRegex = /^(\+251|0)[9]\d{8}$/;
        return phoneRegex.test(value) ? null : 'Invalid phone number format';
    },

    // Phone or email (for login)
    emailOrPhone: (value) => {
        if (!value) return 'Email or phone is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^(\+251|0)[9]\d{8}$/;
        return emailRegex.test(value) || phoneRegex.test(value)
            ? null
            : 'Invalid email or phone format';
    },

    // Password validation
    password: (value) => {
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        return null;
    },

    // Strong password (uppercase, lowercase, number, special char)
    strongPassword: (value) => {
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';

        const hasLower = /[a-z]/.test(value);
        const hasUpper = /[A-Z]/.test(value);
        const hasNumber = /\d/.test(value);
        const hasSpecial = /[^A-Za-z0-9]/.test(value);

        if (!hasLower) return 'Password must contain lowercase letters';
        if (!hasUpper) return 'Password must contain uppercase letters';
        if (!hasNumber) return 'Password must contain numbers';
        if (!hasSpecial) return 'Password must contain special characters';

        return null;
    },

    // Name validation
    name: (value) => {
        if (!value) return 'Name is required';
        if (value.length < 2) return 'Name must be at least 2 characters';
        if (value.length > 100) return 'Name must be less than 100 characters';
        return null;
    },

    // URL validation
    url: (value) => {
        if (!value) return null; // Optional
        try {
            new URL(value);
            return null;
        } catch {
            return 'Invalid URL';
        }
    },

    // Required field
    required: (value) => {
        return value && value.trim() ? null : 'This field is required';
    },

    // Min length
    minLength: (minLen) => (value) => {
        if (!value) return null;
        return value.length >= minLen ? null : `Must be at least ${minLen} characters`;
    },

    // Max length
    maxLength: (maxLen) => (value) => {
        if (!value) return null;
        return value.length <= maxLen ? null : `Must be no more than ${maxLen} characters`;
    },

    // Confirm match (for password confirmation)
    confirm: (matchValue, fieldName = 'Password') => (value) => {
        if (!value) return `${fieldName} confirmation is required`;
        return value === matchValue ? null : `${fieldName}s do not match`;
    },
};

/**
 * Validates a single field using provided rules
 * Rules can be an array of validator functions or a single function
 */
export function validateField(value, rules) {
    if (!rules) return null;

    const ruleArray = Array.isArray(rules) ? rules : [rules];

    for (const rule of ruleArray) {
        const error = rule(value);
        if (error) return error;
    }

    return null;
}

/**
 * Validates multiple fields at once
 * Returns object with field errors
 */
export function validateFields(values, schema) {
    const errors = {};

    Object.keys(schema).forEach((fieldName) => {
        const rules = schema[fieldName];
        const error = validateField(values[fieldName], rules);
        if (error) {
            errors[fieldName] = error;
        }
    });

    return errors;
}

/**
 * Debounced field validation for real-time feedback
 */
export function createFieldValidator(rule, delayMs = 300) {
    let timeoutId = null;

    return {
        validate: (value) => {
            return new Promise((resolve) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    const error = validateField(value, rule);
                    resolve(error);
                }, delayMs);
            });
        },
        cancel: () => {
            clearTimeout(timeoutId);
        },
    };
}

/**
 * Check if password matches confirmation
 */
export function passwordsMatch(password, confirmation) {
    return password === confirmation;
}

/**
 * Get password strength score (0-4)
 */
export function getPasswordStrength(password) {
    if (!password) return 0;

    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    return Math.min(score, 4);
}

/**
 * Sanitize form data before submission
 */
export function sanitizeFormData(data) {
    const sanitized = {};

    Object.keys(data).forEach((key) => {
        const value = data[key];

        if (typeof value === 'string') {
            // Trim whitespace, remove extra spaces
            sanitized[key] = value.trim().replace(/\s+/g, ' ');
        } else if (typeof value === 'number' || typeof value === 'boolean') {
            sanitized[key] = value;
        } else {
            sanitized[key] = value;
        }
    });

    return sanitized;
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone) {
    if (!phone) return '';

    // Remove non-digits
    const digits = phone.replace(/\D/g, '');

    // If starts with 251 (country code), convert to 0
    const normalized = digits.startsWith('251')
        ? '0' + digits.slice(3)
        : digits.startsWith('9')
        ? '0' + digits
        : digits;

    // Format as 09-xxxx-xxxx
    if (normalized.length === 10) {
        return `${normalized.slice(0, 2)}-${normalized.slice(2, 6)}-${normalized.slice(6)}`;
    }

    return normalized;
}

/**
 * Detect form changes
 */
export function formHasChanges(initialData, currentData) {
    return JSON.stringify(initialData) !== JSON.stringify(currentData);
}
