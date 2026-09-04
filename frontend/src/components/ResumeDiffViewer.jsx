import React from 'react';
import { GitCompare, Plus, Minus, FileText, ExternalLink } from 'lucide-react';
import Modal from './ui/Modal';
import Badge from './ui/Badge';
import Button from './ui/Button';

function ResumeDiffViewer({ isOpen, onClose, compareData }) {
    if (!isOpen || !compareData) return null;

    const { job_title, company, version, diff_lines, added_count, removed_count, unchanged_count, application_url } = compareData;

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
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-2 font-semibold">
                        <Plus size={16} /> <span className="font-bold">{added_count}</span> Lines Added
                    </div>
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 flex items-center justify-center gap-2 font-semibold">
                        <Minus size={16} /> <span className="font-bold">{removed_count}</span> Lines Removed
                    </div>
                    <div className="p-3 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 font-semibold">
                        <FileText size={16} /> <span className="font-bold">{unchanged_count}</span> Lines Unchanged
                    </div>
                </div>

                {/* Line-by-Line Diff Viewer Container */}
                <div className="overflow-y-auto font-mono text-xs leading-relaxed space-y-1 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 max-h-[500px]">
                    {diff_lines && diff_lines.length > 0 ? (
                        diff_lines.map((item, idx) => (
                            <div
                                key={idx}
                                className={`px-3 py-1.5 rounded-lg flex items-start gap-3 transition-colors ${
                                    item.type === 'added' ? 'bg-emerald-100/70 dark:bg-emerald-900/30 border-l-4 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold' :
                                    item.type === 'removed' ? 'bg-rose-100/70 dark:bg-rose-900/30 border-l-4 border-rose-500 text-rose-800 dark:text-rose-300 line-through opacity-80' :
                                    'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    {application_url ? (
                        <a
                            href={application_url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button variant="primary" size="sm" icon={ExternalLink} className="shadow-xs">
                                Apply to Job Posting
                            </Button>
                        </a>
                    ) : <div></div>}
                    <Button variant="secondary" size="sm" onClick={onClose}>
                        Close Comparison
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export default ResumeDiffViewer;
