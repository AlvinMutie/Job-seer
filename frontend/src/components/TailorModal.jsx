import React from 'react';
import { X, Copy, Check, Sparkles, Zap, Award, Target } from 'lucide-react';

function TailorModal({ isOpen, onClose, suggestions, jobTitle, company }) {
    const [copied, setCopied] = React.useState(null);

    if (!isOpen) return null;

    const handleCopy = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopied(index);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/60">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-xl text-indigo-600 dark:text-indigo-400">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">Targeted CV Tailoring</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Optimizing for {jobTitle} at {company}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl flex gap-3">
                        <Zap className="text-amber-600 dark:text-amber-400 shrink-0" size={20} />
                        <p className="text-sm text-amber-800 dark:text-amber-300">
                            The suggestions below are specifically designed to address your detected skill gaps. Copy and paste them into your actual resume or use them as inspiration.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {suggestions.map((item, index) => (
                            <div key={index} className="group relative p-5 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300">
                                        {item.section}
                                    </span>
                                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
                                        <Award size={12} /> {item.impact}
                                    </div>
                                </div>

                                {item.original_context && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 italic">Context: {item.original_context}</p>
                                )}

                                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed pr-8">
                                    {item.suggestion}
                                </p>

                                <button
                                    onClick={() => handleCopy(item.suggestion, index)}
                                    className="absolute bottom-4 right-4 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-all opacity-0 group-hover:opacity-100 shadow-xs"
                                    title="Copy to clipboard"
                                >
                                    {copied === index ? <Check size={16} className="text-emerald-600 dark:text-emerald-400" /> : <Copy size={16} />}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex justify-center">
                    <button
                        onClick={onClose}
                        className="btn-primary py-2.5 px-6 text-sm font-semibold"
                    >
                        Done Reviewing
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TailorModal;
