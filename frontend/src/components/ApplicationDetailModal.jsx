import React, { useState, useEffect } from 'react';
import { ExternalLink, Calendar, FileText, Trash2, Check, AlertCircle, Save } from 'lucide-react';
import { trackerService, getApiErrorMessage } from '../services/api';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import Badge from './ui/Badge';

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

    const getBadgeVariant = (st) => {
        switch (st) {
            case 'Applied': return 'indigo';
            case 'Interview': return 'cyan';
            case 'Offer': return 'emerald';
            case 'Rejected': return 'rose';
            default: return 'slate';
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={appData.title}
            subtitle={appData.company}
        >
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <Badge variant={getBadgeVariant(status)}>{status}</Badge>
                    {appData.score && (
                        <Badge variant="indigo" size="sm">
                            {appData.score}% V2 Match Score
                        </Badge>
                    )}
                </div>

                {error && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSave} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Select
                            label="Application Status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            options={[
                                { value: 'Not Applied', label: 'Not Applied' },
                                { value: 'Applied', label: 'Applied' },
                                { value: 'Interview', label: 'Interview' },
                                { value: 'Offer', label: 'Offer' },
                                { value: 'Rejected', label: 'Rejected' }
                            ]}
                        />

                        <Input
                            label="Applied Date"
                            type="date"
                            value={appliedDate}
                            onChange={(e) => setAppliedDate(e.target.value)}
                        />

                        <Input
                            label="Interview Date"
                            type="date"
                            value={interviewDate}
                            onChange={(e) => setInterviewDate(e.target.value)}
                        />

                        <Input
                            label="Follow-up Date"
                            type="date"
                            value={followUpDate}
                            onChange={(e) => setFollowUpDate(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center ml-0.5">
                            <label className="block text-xs font-semibold text-slate-700">Application URL</label>
                            {applicationUrl && (
                                <a
                                    href={applicationUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
                                >
                                    Open Link <ExternalLink size={12} />
                                </a>
                            )}
                        </div>
                        <Input
                            type="url"
                            placeholder="https://company.com/careers/job-123"
                            value={applicationUrl}
                            onChange={(e) => setApplicationUrl(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-700 ml-0.5">Application Notes</label>
                        <textarea
                            rows={4}
                            placeholder="Add recruiter contact, interview notes, or preparation reminders..."
                            className="w-full bg-white border border-slate-300 text-slate-900 placeholder-slate-400 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            icon={Trash2}
                            isLoading={deleting}
                            onClick={handleDelete}
                        >
                            Delete Application
                        </Button>
                        <div className="flex items-center gap-2">
                            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                size="sm"
                                icon={Save}
                                isLoading={saving}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

export default ApplicationDetailModal;
