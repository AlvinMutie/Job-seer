import React from 'react';

export default function PageHeader({
    title,
    subtitle,
    badgeText,
    action = null,
    className = ''
}) {
    return (
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 md:p-8 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border-indigo-500/20 rounded-3xl ${className}`}>
            <div>
                {badgeText && (
                    <div className="flex items-center gap-2 mb-2">
                        <span className="badge badge-indigo">{badgeText}</span>
                    </div>
                )}
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{title}</h1>
                {subtitle && <p className="text-xs md:text-sm text-slate-400 mt-1.5 leading-relaxed">{subtitle}</p>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}
