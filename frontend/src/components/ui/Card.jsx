import React from 'react';

export default function Card({
    children,
    variant = 'glass', // glass | flat | elevated | interactive
    className = '',
    onClick,
    ...props
}) {
    const variantStyles = {
        glass: "bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-xs",
        flat: "bg-white border border-slate-200 rounded-2xl",
        elevated: "bg-white border border-slate-200/80 rounded-2xl shadow-md shadow-slate-200/60",
        interactive: "bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-indigo-300 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.99]"
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
