import React from 'react';

export default function Badge({
    children,
    variant = 'indigo', // indigo | emerald | amber | rose | cyan | slate
    size = 'md', // sm | md
    icon: Icon = null,
    className = ''
}) {
    const variantStyles = {
        indigo: "bg-indigo-500/10 text-indigo-300 border-indigo-500/25",
        emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
        amber: "bg-amber-500/10 text-amber-300 border-amber-500/25",
        rose: "bg-rose-500/10 text-rose-300 border-rose-500/25",
        cyan: "bg-cyan-500/10 text-cyan-300 border-cyan-500/25",
        slate: "bg-slate-800 text-slate-300 border-slate-700"
    };

    const sizeStyles = {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-3 py-1 text-xs"
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${variantStyles[variant] || variantStyles.indigo} ${sizeStyles[size] || sizeStyles.md} ${className}`}
        >
            {Icon && <Icon size={size === 'sm' ? 10 : 12} />}
            <span>{children}</span>
        </span>
    );
}
