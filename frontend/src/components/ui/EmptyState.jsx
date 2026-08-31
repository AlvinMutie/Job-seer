import React from 'react';
import { Layers } from 'lucide-react';

export default function EmptyState({
    icon: Icon = Layers,
    title = 'No items found',
    description = 'There is currently no data available in this section.',
    action = null,
    className = ''
}) {
    return (
        <div className={`flex flex-col items-center justify-center p-10 md:p-14 text-center glass-card border border-dashed border-slate-800 rounded-3xl ${className}`}>
            <div className="w-14 h-14 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/10">
                <Icon size={28} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed mb-6">{description}</p>
            {action && <div>{action}</div>}
        </div>
    );
}
