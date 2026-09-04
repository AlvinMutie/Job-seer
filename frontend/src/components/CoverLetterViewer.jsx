import React, { useState } from 'react';
import { FileText, Copy, Check, Trash2, ExternalLink } from 'lucide-react';
import Modal from './ui/Modal';
import Badge from './ui/Badge';
import Button from './ui/Button';

function CoverLetterViewer({ isOpen, onClose, letterData, onDelete }) {
    const [copied, setCopied] = useState(false);

    if (!isOpen || !letterData) return null;

    const { id, job_title, company, tone, version, content, created_at, application_url } = letterData;

    const handleCopy = () => {
        if (content) {
            navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Cover Letter for ${job_title || 'Target Job'}`}
            subtitle={company || 'Generated Application Material'}
            maxWidth="max-w-3xl"
        >
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <Badge variant="indigo">v{version}</Badge>
                    <Badge variant="cyan">{tone} Tone</Badge>
                    <span className="text-xs text-slate-400 font-mono ml-auto">
                        {new Date(created_at).toLocaleDateString()}
                    </span>
                </div>

                {/* Content Box */}
                <div className="overflow-y-auto font-sans text-sm leading-relaxed p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 whitespace-pre-wrap max-h-[480px]">
                    {content}
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                    {onDelete ? (
                        <Button
                            variant="destructive"
                            size="sm"
                            icon={Trash2}
                            onClick={() => { onDelete(id); onClose(); }}
                        >
                            Delete
                        </Button>
                    ) : <div></div>}

                    <div className="flex flex-wrap items-center gap-2 ml-auto">
                        <Button
                            variant="outline"
                            size="sm"
                            icon={copied ? Check : Copy}
                            onClick={handleCopy}
                        >
                            {copied ? 'Copied to Clipboard!' : 'Copy Letter'}
                        </Button>

                        {application_url && (
                            <a
                                href={application_url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button variant="primary" size="sm" icon={ExternalLink} className="shadow-xs">
                                    Apply on Official Site
                                </Button>
                            </a>
                        )}

                        <Button variant="secondary" size="sm" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default CoverLetterViewer;
