import React from 'react';

export default function Card({
    children,
    variant = 'glass', // glass | flat | elevated | interactive
    className = '',
    onClick,
    ...props
}) {
    const variantStyles = {
        glass: "bg-slate-900/75 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl",
        flat: "bg-slate-900 border border-slate-800 rounded-2xl",
        elevated: "bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl shadow-slate-950/50",
        interactive: "bg-slate-900/75 hover:bg-slate-900/90 border border-white/10 hover:border-indigo-500/30 rounded-2xl shadow-xl transition-all duration-200 cursor-pointer active:scale-[0.99]"
    };

    return (
        <div
            onClick={onClick}
            className={`${variantStyles[variant] || variantStyles.glass} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
