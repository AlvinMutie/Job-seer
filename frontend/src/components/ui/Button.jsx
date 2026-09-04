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
    const baseStyles = "font-semibold rounded-xl transition-all duration-200 inline-flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";

    const sizeStyles = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base"
    };

    const variantStyles = {
        primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20",
        secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs",
        ghost: "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900",
        destructive: "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200",
        success: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20",
        outline: "bg-white border border-indigo-300 text-indigo-700 hover:bg-indigo-50"
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
