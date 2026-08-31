import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, FileText, MoreVertical, Plus, Briefcase, Sparkles, Search, Filter, AlertCircle, ChevronLeft, ChevronRight, Loader2, LayoutGrid, List as ListIcon, Calendar, ExternalLink } from 'lucide-react';
import { trackerService, getApiErrorMessage } from '../services/api';
import ApplicationDetailModal from '../components/ApplicationDetailModal';

const STATUS_COLUMNS = ['Not Applied', 'Applied', 'Interview', 'Offer', 'Rejected'];

function Tracker() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // View mode: 'board' (Kanban) | 'list'
    const [viewMode, setViewMode] = useState('board');
    
    // Filtering & Pagination State
    const [statusFilter, setStatusFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const limit = 50; // Larger limit for Kanban board view

    // Modal State
    const [selectedApp, setSelectedApp] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const fetchApps = async () => {
        setLoading(true);
        setError('');
        try {
            const params = {
                limit,
                offset: (page - 1) * limit
            };
            if (statusFilter) params.status = statusFilter;
            if (searchQuery.trim()) params.search = searchQuery.trim();

            const data = await trackerService.getApplications(params);
            setApplications(data);
        } catch (err) {
            console.error("Failed to fetch applications:", err);
            setError(getApiErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApps();
    }, [statusFilter, page]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        fetchApps();
    };

    // Native Drag and Drop Handlers for Kanban
    const handleDragStart = (e, app) => {
        e.dataTransfer.setData('applicationId', app.id);
        e.dataTransfer.setData('previousStatus', app.status);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = async (e, targetStatus) => {
        e.preventDefault();
        const appIdStr = e.dataTransfer.getData('applicationId');
        const previousStatus = e.dataTransfer.getData('previousStatus');
        
        if (!appIdStr) return;
        const appId = parseInt(appIdStr);

        if (previousStatus === targetStatus) return;

        // Optimistic UI Update
        setApplications(prev => prev.map(app => app.id === appId ? { ...app, status: targetStatus } : app));

        try {
            await trackerService.updateApplication(appId, { status: targetStatus });
        } catch (err) {
            console.error("Failed to persist dragged status change:", err);
            // Rollback optimistic update on error
            setApplications(prev => prev.map(app => app.id === appId ? { ...app, status: previousStatus } : app));
            setError(`Failed to update status: ${getApiErrorMessage(err)}`);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Applied': return 'badge-indigo';
            case 'Interview': return 'badge-cyan';
            case 'Rejected': return 'badge-red';
            case 'Not Applied': return 'badge-slate';
            case 'Offer': return 'badge-emerald';
            default: return 'badge-indigo';
        }
    };

    const avgScore = applications.length > 0
        ? Math.round(applications.reduce((acc, app) => acc + (app.score || 0), 0) / applications.length)
        : 0;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Application Pipeline & Kanban Workspace</h2>
                    <p className="text-slate-400 text-xs mt-1">Track application stages, schedule interviews, record dates, and manage your job pipeline.</p>
                </div>
                
                {/* View Switcher Toggle */}
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
                    <button
                        onClick={() => setViewMode('board')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${viewMode === 'board' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <LayoutGrid size={15} /> Board
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <ListIcon size={15} /> List
                    </button>
                </div>
            </div>

            {/* Error Notification Banner */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {/* Filter and Search Controls */}
            <div className="glass-card p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2 w-full">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            className="input-field pl-10 py-2 text-sm w-full"
                            placeholder="Search by job title, company, or notes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary py-2 px-4 text-sm">
                        {loading ? <Loader2 className="animate-spin" size={16} /> : 'Search'}
                    </button>
                </form>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Filter className="text-slate-500" size={18} />
                    <select
                        className="input-field py-2 text-sm bg-slate-900 border-slate-700 text-slate-200"
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                        }}
                    >
                        <option value="">All Statuses</option>
                        {STATUS_COLUMNS.map(col => (
                            <option key={col} value={col}>{col}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* VIEW MODE 1: KANBAN BOARD */}
            {viewMode === 'board' && (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
                    {STATUS_COLUMNS.map(columnStatus => {
                        const columnApps = applications.filter(a => a.status === columnStatus);
                        return (
                            <div
                                key={columnStatus}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, columnStatus)}
                                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 min-h-[500px] flex flex-col gap-3 transition-colors hover:border-slate-700/80"
                            >
                                {/* Column Header */}
                                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${
                                            columnStatus === 'Applied' ? 'bg-indigo-500' :
                                            columnStatus === 'Interview' ? 'bg-cyan-400' :
                                            columnStatus === 'Offer' ? 'bg-emerald-500' :
                                            columnStatus === 'Rejected' ? 'bg-red-500' : 'bg-slate-500'
                                        }`}></span>
                                        {columnStatus}
                                    </h4>
                                    <span className="badge badge-slate text-[10px] font-bold">{columnApps.length}</span>
                                </div>

                                {/* Cards List */}
                                <div className="flex-1 space-y-3 overflow-y-auto max-h-[600px] pr-0.5">
                                    {columnApps.length === 0 ? (
                                        <div className="h-32 flex items-center justify-center text-center text-xs text-slate-600 border-2 border-dashed border-slate-800/60 rounded-xl">
                                            Drop card here
                                        </div>
                                    ) : (
                                        columnApps.map(app => (
                                            <div
                                                key={app.id}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, app)}
                                                onClick={() => { setSelectedApp(app); setIsDetailModalOpen(true); }}
                                                className="glass-card p-4 space-y-3 cursor-grab active:cursor-grabbing hover:border-indigo-500/40 hover:shadow-lg transition-all group"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h5 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{app.title}</h5>
                                                        <p className="text-xs text-slate-400 font-medium">{app.company}</p>
                                                    </div>
                                                    {app.score && (
                                                        <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                                                            {app.score}%
                                                        </span>
                                                    )}
                                                </div>

                                                {(app.applied_date || app.interview_date || app.follow_up_date) && (
                                                    <div className="space-y-1 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 font-mono">
                                                        {app.applied_date && <div>Applied: {app.applied_date}</div>}
                                                        {app.interview_date && <div className="text-cyan-400 font-bold">Interview: {app.interview_date}</div>}
                                                        {app.follow_up_date && <div className="text-amber-400">Follow-up: {app.follow_up_date}</div>}
                                                    </div>
                                                )}

                                                {app.application_url && (
                                                    <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                                                        <ExternalLink size={10} /> {app.application_url}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* VIEW MODE 2: TABLE LIST */}
            {viewMode === 'list' && (
                <div className="glass-card overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-800/20">
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Job Title</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Company</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Match Score</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Applied Date</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="animate-spin text-indigo-500" size={20} />
                                            <span>Loading your pipeline...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : applications.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                        {searchQuery || statusFilter ? 'No applications match your filter parameters.' : 'No applications tracked yet.'}
                                    </td>
                                </tr>
                            ) : (
                                applications.map(app => (
                                    <tr
                                        key={app.id}
                                        onClick={() => { setSelectedApp(app); setIsDetailModalOpen(true); }}
                                        className="hover:bg-slate-800/30 transition-colors cursor-pointer"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white">{app.title}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">{app.company}</td>
                                        <td className="px-6 py-4">
                                            <span className={`badge ${getStatusColor(app.status)} flex items-center gap-1.5 w-fit`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${app.score > 80 ? 'bg-emerald-500' : app.score > 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                        style={{ width: `${app.score}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-bold text-slate-300">{app.score}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{app.applied_date || app.date}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 text-slate-500 hover:text-white transition-colors">
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div className="p-4 border-t border-slate-800 flex justify-between items-center bg-slate-900/30">
                        <span className="text-xs text-slate-500">Showing page {page}</span>
                        <div className="flex gap-2">
                            <button
                                disabled={page <= 1 || loading}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                className="px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                                <ChevronLeft size={14} /> Previous
                            </button>
                            <button
                                disabled={applications.length < limit || loading}
                                onClick={() => setPage(p => p + 1)}
                                className="px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                                Next <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Active Applications" value={applications.length.toString()} delta="Live pipeline" icon={<Briefcase className="text-indigo-400" />} />
                <StatCard label="Interviews Scheduled" value={applications.filter(a => a.status === 'Interview').length.toString()} delta="Check your calendar" icon={<Sparkles className="text-amber-400" />} />
                <StatCard label="Average Match Score" value={`${avgScore}%`} delta="Keep tailoring!" icon={<Sparkles className="text-cyan-400" />} />
            </div>

            {/* Application Detail & Edit Modal */}
            <ApplicationDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                appData={selectedApp}
                onSaved={fetchApps}
                onDelete={() => {
                    setApplications(prev => prev.filter(a => a.id !== selectedApp.id));
                }}
            />
        </div>
    );
}

function StatCard({ label, value, delta, icon }) {
    return (
        <div className="glass-card p-6">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-800/50 rounded-lg">{icon}</div>
                <span className="text-xs text-emerald-400 font-medium">{delta}</span>
            </div>
            <h4 className="text-slate-400 text-sm font-medium">{label}</h4>
            <div className="text-2xl font-bold text-white mt-1">{value}</div>
        </div>
    );
}

export default Tracker;
