export default function ApplicationLogo({ className = '', ...props }) {
    return (
        <img
            {...props}
            src="/logo.png?v=admin-logo-2"
            alt="Success Life Coaching Academy logo"
            decoding="async"
            className={`object-contain ${className}`.trim()}
        />
    );
}
