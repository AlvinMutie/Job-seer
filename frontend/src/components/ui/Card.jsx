import React from 'react';

export default function Card({
    children,
    variant = 'glass', // glass | flat | elevated | interactive
    className = '',
    onClick,
    ...props
}) {
    const variantStyles = {
        glass: "bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs",
        flat: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl",
        elevated: "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-md shadow-slate-200/60 dark:shadow-none",
        interactive: "bg-white dark:bg-slate-900 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.99]"
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
