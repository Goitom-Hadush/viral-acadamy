export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-sm font-semibold tracking-wide text-slate-700 ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
