export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-2xl border border-transparent bg-gradient-to-r from-copper-700 via-accent to-bronze px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-copper-glow transition duration-150 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-20px_rgba(184,115,51,0.9)] focus:outline-none focus:ring-2 focus:ring-copper-500 focus:ring-offset-2 active:scale-[0.99] ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
