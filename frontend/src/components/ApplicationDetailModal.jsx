import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Calendar, FileText, Trash2, Check, AlertCircle, Loader2, Save } from 'lucide-react';
import { trackerService, getApiErrorMessage } from '../services/api';

function ApplicationDetailModal({ isOpen, onClose, appData, onSaved, onDelete }) {
    const [status, setStatus] = useState('');
    const [appliedDate, setAppliedDate] = useState('');
    const [interviewDate, setInterviewDate] = useState('');
    const [followUpDate, setFollowUpDate] = useState('');
    const [applicationUrl, setApplicationUrl] = useState('');
    const [notes, setNotes] = useState('');

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (appData) {
            setStatus(appData.status || 'Applied');
            setAppliedDate(appData.applied_date || '');
            setInterviewDate(appData.interview_date || '');
            setFollowUpDate(appData.follow_up_date || '');
            setApplicationUrl(appData.application_url || '');
            setNotes(appData.notes || '');
            setError('');
        }
    }, [appData]);

    if (!isOpen || !appData) return null;

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            await trackerService.updateApplication(appData.id, {
                status,
                applied_date: appliedDate || null,
                interview_date: interviewDate || null,
                follow_up_date: followUpDate || null,
                application_url: applicationUrl || null,
                notes: notes || null
            });
            if (onSaved) onSaved();
            onClose();
        } catch (err) {
            console.error("Failed to save application updates:", err);
            setError(getApiErrorMessage(err));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this tracked application?")) return;
        setDeleting(true);
        try {
            await trackerService.deleteApplication(appData.id);
            if (onDelete) onDelete(appData.id);
            onClose();
        } catch (err) {
            console.error("Failed to delete application:", err);
            setError(getApiErrorMessage(err));
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
            <div className="glass-card w-full max-w-2xl p-6 overflow-hidden flex flex-col max-h-[90vh] space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="badge badge-indigo">{status}</span>
                            {appData.score && (
                                <span className="text-xs font-bold text-indigo-400">
                                    {appData.score}% Match
                                </span>
                            )}
                        </div>
                        <h2 className="text-xl font-bold text-white">{appData.title}</h2>
                        <p className="text-slate-400 text-sm">{appData.company}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-xs">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                {/* Edit Form */}
                <form onSubmit={handleSave} className="space-y-4 flex-1 overflow-y-auto pr-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Application Status</label>
                            <select
                                className="input-field py-2 px-3 text-xs bg-slate-900 border-slate-700 text-slate-200 w-full"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="Not Applied">Not Applied</option>
                                <option value="Applied">Applied</option>
                                <option value="Interview">Interview</option>
                                <option value="Offer">Offer</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Applied Date</label>
                            <input
                                type="date"
                                className="input-field py-2 px-3 text-xs bg-slate-900 border-slate-700 text-slate-200 w-full"
                                value={appliedDate}
                                onChange={(e) => setAppliedDate(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Interview Date</label>
                            <input
                                type="date"
                                className="input-field py-2 px-3 text-xs bg-slate-900 border-slate-700 text-slate-200 w-full"
                                value={interviewDate}
                                onChange={(e) => setInterviewDate(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Follow-up Date</label>
                            <input
                                type="date"
                                className="input-field py-2 px-3 text-xs bg-slate-900 border-slate-700 text-slate-200 w-full"
                                value={followUpDate}
                                onChange={(e) => setFollowUpDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Application URL</label>
                            {applicationUrl && (
                                <a
                                    href={applicationUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
                                >
                                    Open Link <ExternalLink size={12} />
                                </a>
                            )}
                        </div>
                        <input
                            type="url"
                            placeholder="https://company.com/careers/job-123"
                            className="input-field py-2 px-3 text-xs bg-slate-900 border-slate-700 text-slate-200 w-full"
                            value={applicationUrl}
                            onChange={(e) => setApplicationUrl(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Application Notes</label>
                        <textarea
                            rows={4}
                            placeholder="Add recruiter contact, interview notes, or preparation reminders..."
                            className="input-field p-3 text-xs bg-slate-900 border-slate-700 text-slate-200 w-full resize-none"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-4">
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleting}
                            className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold hover:bg-red-500/20 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                        >
                            {deleting ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />} Delete Application
                        </button>
                        <div className="flex items-center gap-3">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-xs text-slate-400 hover:text-white">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="btn-primary py-2 px-6 text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Changes
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ApplicationDetailModal;
