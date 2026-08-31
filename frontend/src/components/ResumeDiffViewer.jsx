import React from 'react';
import { X, GitCompare, Plus, Minus, FileText, CheckCircle2 } from 'lucide-react';

function ResumeDiffViewer({ isOpen, onClose, compareData }) {
    if (!isOpen || !compareData) return null;

    const { job_title, company, version, diff_lines, added_count, removed_count, unchanged_count } = compareData;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
            <div className="glass-card w-full max-w-4xl p-6 overflow-hidden flex flex-col max-h-[90vh] space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="badge badge-indigo text-xs">Version {version} Diff Analysis</span>
                            <span className="text-xs text-slate-400 font-mono">ID: #{compareData.id}</span>
                        </div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <GitCompare className="text-indigo-400" size={20} /> {job_title || 'Tailored Resume'}
                        </h2>
                        {company && <p className="text-slate-400 text-sm">{company}</p>}
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Diff Stats Banner */}
                <div className="grid grid-cols-3 gap-4 text-center text-xs">
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 flex items-center justify-center gap-2">
                        <Plus size={16} /> <span className="font-bold">{added_count}</span> Lines Added
                    </div>
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center justify-center gap-2">
                        <Minus size={16} /> <span className="font-bold">{removed_count}</span> Lines Removed
                    </div>
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 flex items-center justify-center gap-2">
                        <FileText size={16} /> <span className="font-bold">{unchanged_count}</span> Lines Unchanged
                    </div>
                </div>

                {/* Line-by-Line Diff Viewer Container */}
                <div className="flex-1 overflow-y-auto font-mono text-xs leading-relaxed space-y-1 p-4 bg-slate-950/80 rounded-xl border border-slate-800/80 max-h-[500px]">
                    {diff_lines && diff_lines.length > 0 ? (
                        diff_lines.map((item, idx) => (
                            <div
                                key={idx}
                                className={`px-3 py-1 rounded flex items-start gap-3 transition-colors ${
                                    item.type === 'added' ? 'bg-emerald-500/15 border-l-4 border-emerald-500 text-emerald-200' :
                                    item.type === 'removed' ? 'bg-red-500/15 border-l-4 border-red-500 text-red-300 line-through opacity-70' :
                                    'text-slate-400 hover:text-slate-200'
                                }`}
                            >
                                <span className="w-6 text-right select-none opacity-40 font-mono">{idx + 1}</span>
                                <span className="w-4 select-none font-bold">
                                    {item.type === 'added' ? '+' : item.type === 'removed' ? '-' : ' '}
                                </span>
                                <span className="flex-1 whitespace-pre-wrap">{item.line}</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-slate-500">No diff lines available.</div>
                    )}
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-slate-800 flex justify-end">
                    <button onClick={onClose} className="btn-primary py-2 px-6 text-sm font-semibold">
                        Close Comparison
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ResumeDiffViewer;
