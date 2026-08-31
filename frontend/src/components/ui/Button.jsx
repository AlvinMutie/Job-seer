import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
    children,
    variant = 'primary', // primary | secondary | ghost | destructive | success | outline
    size = 'md', // sm | md | lg
    isLoading = false,
    disabled = false,
    icon: Icon = null,
    className = '',
    type = 'button',
    onClick,
    ...props
}) {
    const baseStyles = "font-semibold rounded-xl transition-all duration-200 inline-flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";

    const sizeStyles = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-5 py-2.5 text-sm",
        lg: "px-7 py-3.5 text-base"
    };

    const variantStyles = {
        primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 border border-indigo-500/30",
        secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700",
        ghost: "bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white",
        destructive: "bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/20",
        success: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 border border-emerald-500/30",
        outline: "bg-transparent border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/10 hover:text-white"
    };

    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            onClick={onClick}
            className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
            {...props}
        >
            {isLoading ? (
                <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
            ) : Icon ? (
                <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
            ) : null}
            <span>{children}</span>
        </button>
    );
}
