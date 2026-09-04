import React from 'react';

export default function PageHeader({
    title,
    subtitle,
    badgeText,
    action = null,
    className = ''
}) {
    return (
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 md:p-7 border border-slate-200 dark:border-slate-800 shadow-xs rounded-2xl ${className}`}>
            <div>
                {badgeText && (
                    <div className="flex items-center gap-2 mb-2">
                        <span className="badge badge-indigo">{badgeText}</span>
                    </div>
                )}
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h1>
                {subtitle && <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{subtitle}</p>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}
