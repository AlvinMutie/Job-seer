import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function Input({
    label,
    error,
    helperText,
    icon: Icon = null,
    className = '',
    id,
    type = 'text',
    required = false,
    disabled = false,
    ...props
}) {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
        <div className="space-y-1.5 w-full text-left">
            {label && (
                <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 ml-0.5">
                    {label} {required && <span className="text-rose-500">*</span>}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <Icon size={16} />
                    </div>
                )}
                <input
                    id={inputId}
                    type={type}
                    disabled={disabled}
                    required={required}
                    className={`w-full bg-white border text-slate-900 placeholder-slate-400 rounded-xl py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed ${Icon ? 'pl-10 pr-4' : 'px-4'
                        } ${error
                            ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                            : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-600/20'
                        } ${className}`}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 ml-0.5">
                    <AlertCircle size={12} /> {error}
                </p>
            )}
            {helperText && !error && (
                <p className="text-[11px] text-slate-500 ml-0.5">{helperText}</p>
            )}
        </div>
    );
}
