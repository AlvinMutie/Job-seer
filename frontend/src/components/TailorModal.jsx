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
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-600">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 leading-tight">AI CV Tailoring</h2>
                            <p className="text-sm text-slate-500">Optimizing for {jobTitle} at {company}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3">
                        <Zap className="text-amber-600 shrink-0" size={20} />
                        <p className="text-sm text-amber-800">
                            The suggestions below are specifically designed to address your detected skill gaps. Copy and paste them into your actual resume or use them as inspiration.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {suggestions.map((item, index) => (
                            <div key={index} className="group relative p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                                        {item.section}
                                    </span>
                                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-700">
                                        <Award size={12} /> {item.impact}
                                    </div>
                                </div>

                                {item.original_context && (
                                    <p className="text-xs text-slate-500 mb-2 italic">Context: {item.original_context}</p>
                                )}

                                <p className="text-sm text-slate-800 leading-relaxed pr-8">
                                    {item.suggestion}
                                </p>

                                <button
                                    onClick={() => handleCopy(item.suggestion, index)}
                                    className="absolute bottom-4 right-4 p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all opacity-0 group-hover:opacity-100 shadow-xs"
                                    title="Copy to clipboard"
                                >
                                    {copied === index ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-center">
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
