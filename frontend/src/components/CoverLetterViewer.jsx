import React, { useState } from 'react';
import { X, FileText, Copy, Check, Trash2, Sparkles } from 'lucide-react';

function CoverLetterViewer({ isOpen, onClose, letterData, onDelete }) {
    const [copied, setCopied] = useState(false);

    if (!isOpen || !letterData) return null;

    const { id, job_title, company, tone, version, content, created_at } = letterData;

    const handleCopy = () => {
        if (content) {
            navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
            <div className="glass-card w-full max-w-3xl p-6 overflow-hidden flex flex-col max-h-[90vh] space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="badge badge-indigo text-xs">v{version}</span>
                            <span className="badge border border-indigo-500/30 text-indigo-400 bg-indigo-500/10 text-xs font-semibold">
                                {tone} Tone
                            </span>
                            <span className="text-xs text-slate-500 font-mono">
                                {new Date(created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <FileText className="text-indigo-400" size={20} /> Cover Letter for {job_title || 'Target Job'}
                        </h2>
                        {company && <p className="text-slate-400 text-sm">{company}</p>}
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content Box */}
                <div className="flex-1 overflow-y-auto font-sans text-sm leading-relaxed space-y-4 p-6 bg-slate-950/80 rounded-xl border border-slate-800/80 max-h-[480px] text-slate-200 whitespace-pre-wrap selection:bg-indigo-500 selection:text-white">
                    {content}
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-4">
                    {onDelete && (
                        <button
                            onClick={() => { onDelete(id); onClose(); }}
                            className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold hover:bg-red-500/20 transition-colors flex items-center gap-1.5"
                        >
                            <Trash2 size={16} /> Delete Cover Letter
                        </button>
                    )}
                    <div className="flex items-center gap-3 ml-auto">
                        <button
                            onClick={handleCopy}
                            className="px-4 py-2 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold hover:bg-indigo-600/30 transition-colors flex items-center gap-1.5"
                        >
                            {copied ? <><Check className="text-emerald-400" size={16} /> Copied to Clipboard!</> : <><Copy size={16} /> Copy Text</>}
                        </button>
                        <button onClick={onClose} className="btn-primary py-2 px-6 text-xs font-bold">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CoverLetterViewer;
