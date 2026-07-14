export default function ApplicationLogo({ className = '', ...props }) {
    return (
        <img
            {...props}
            src="/logo.png?v=admin-logo-2"
            alt="Viral Acadamy logo"
            className={`object-contain ${className}`.trim()}
        />
    );
}
