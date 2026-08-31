import React from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

export default function Select({
    label,
    options = [],
    error,
    helperText,
    icon: Icon = null,
    className = '',
    id,
    required = false,
    disabled = false,
    ...props
}) {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
        <div className="space-y-1.5 w-full">
            {label && (
                <label htmlFor={selectId} className="block text-xs font-semibold text-slate-300 ml-0.5">
                    {label} {required && <span className="text-rose-400">*</span>}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <Icon size={16} />
                    </div>
                )}
                <select
                    id={selectId}
                    disabled={disabled}
                    required={required}
                    className={`w-full bg-slate-900/80 border text-white rounded-xl py-2.5 text-sm appearance-none transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed ${Icon ? 'pl-10 pr-10' : 'pl-4 pr-10'
                        } ${error
                            ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/50'
                            : 'border-slate-700/80 focus:border-indigo-500 focus:ring-indigo-500/50'
                        } ${className}`}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <ChevronDown size={16} />
                </div>
            </div>
            {error && (
                <p className="text-xs text-rose-400 flex items-center gap-1 mt-1 ml-0.5">
                    <AlertCircle size={12} /> {error}
                </p>
            )}
            {helperText && !error && (
                <p className="text-[11px] text-slate-400 ml-0.5">{helperText}</p>
            )}
        </div>
    );
}
