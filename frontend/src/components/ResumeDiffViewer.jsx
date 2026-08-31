import React from 'react';
import { GitCompare, Plus, Minus, FileText } from 'lucide-react';
import Modal from './ui/Modal';
import Badge from './ui/Badge';
import Button from './ui/Button';

function ResumeDiffViewer({ isOpen, onClose, compareData }) {
    if (!isOpen || !compareData) return null;

    const { job_title, company, version, diff_lines, added_count, removed_count, unchanged_count } = compareData;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={job_title || 'Tailored Resume Comparison'}
            subtitle={company || `Version ${version} Diff Analysis`}
            maxWidth="max-w-4xl"
        >
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <Badge variant="indigo">Version {version} Diff</Badge>
                    <span className="text-xs text-slate-400 font-mono">ID: #{compareData.id}</span>
                </div>

                {/* Diff Stats Banner */}
                <div className="grid grid-cols-3 gap-4 text-center text-xs">
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 flex items-center justify-center gap-2 font-semibold">
                        <Plus size={16} /> <span className="font-bold">{added_count}</span> Lines Added
                    </div>
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 flex items-center justify-center gap-2 font-semibold">
                        <Minus size={16} /> <span className="font-bold">{removed_count}</span> Lines Removed
                    </div>
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 flex items-center justify-center gap-2 font-semibold">
                        <FileText size={16} /> <span className="font-bold">{unchanged_count}</span> Lines Unchanged
                    </div>
                </div>

                {/* Line-by-Line Diff Viewer Container */}
                <div className="overflow-y-auto font-mono text-xs leading-relaxed space-y-1 p-4 bg-slate-950/90 rounded-2xl border border-slate-800/80 max-h-[500px]">
                    {diff_lines && diff_lines.length > 0 ? (
                        diff_lines.map((item, idx) => (
                            <div
                                key={idx}
                                className={`px-3 py-1.5 rounded-lg flex items-start gap-3 transition-colors ${
                                    item.type === 'added' ? 'bg-emerald-500/15 border-l-4 border-emerald-500 text-emerald-200 font-semibold' :
                                    item.type === 'removed' ? 'bg-rose-500/15 border-l-4 border-rose-500 text-rose-300 line-through opacity-70' :
                                    'text-slate-400 hover:text-slate-200'
                                }`}
                            >
                                <span className="w-6 text-right select-none opacity-40 font-mono text-[11px]">{idx + 1}</span>
                                <span className="w-4 select-none font-bold text-sm">
                                    {item.type === 'added' ? '+' : item.type === 'removed' ? '-' : ' '}
                                </span>
                                <span className="flex-1 whitespace-pre-wrap">{item.line}</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-slate-500">No diff lines available.</div>
                    )}
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end">
                    <Button variant="primary" size="sm" onClick={onClose}>
                        Close Comparison
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export default ResumeDiffViewer;
