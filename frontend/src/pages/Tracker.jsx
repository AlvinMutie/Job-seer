import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, FileText, MoreVertical, Plus, Briefcase, Sparkles, Search, Filter, AlertCircle, ChevronLeft, ChevronRight, Loader2, LayoutGrid, List as ListIcon, Calendar, ExternalLink } from 'lucide-react';
import { trackerService, getApiErrorMessage } from '../services/api';
import ApplicationDetailModal from '../components/ApplicationDetailModal';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';

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
    const limit = 50;

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

    // Drag and Drop Handlers for Kanban Board
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
            setApplications(prev => prev.map(app => app.id === appId ? { ...app, status: previousStatus } : app));
            setError(`Failed to update status: ${getApiErrorMessage(err)}`);
        }
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'Applied': return 'indigo';
            case 'Interview': return 'cyan';
            case 'Rejected': return 'rose';
            case 'Not Applied': return 'slate';
            case 'Offer': return 'emerald';
            default: return 'indigo';
        }
    };

    const avgScore = applications.length > 0
        ? Math.round(applications.reduce((acc, app) => acc + (app.score || 0), 0) / applications.length)
        : 0;

    return (
        <div className="space-y-6 animate-fade-in">
            <PageHeader
                badgeText="APPLICATION PIPELINE"
                title="Application Tracker & Kanban Workspace"
                subtitle="Track application stages, log interview screens, record critical dates, and organize your job search pipeline."
                action={
                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
                        <Button
                            variant={viewMode === 'board' ? 'primary' : 'ghost'}
                            size="sm"
                            icon={LayoutGrid}
                            onClick={() => setViewMode('board')}
                        >
                            Board
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'primary' : 'ghost'}
                            size="sm"
                            icon={ListIcon}
                            onClick={() => setViewMode('list')}
                        >
                            List
                        </Button>
                    </div>
                }
            />

            {/* Error Notification */}
            {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 text-sm">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {/* Search and Filters */}
            <Card variant="glass" className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2 w-full">
                    <div className="flex-1">
                        <Input
                            icon={Search}
                            placeholder="Search by job title, company, or notes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button type="submit" variant="primary" isLoading={loading}>
                        Search
                    </Button>
                </form>

                <div className="w-full md:w-56">
                    <Select
                        icon={Filter}
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                        }}
                        options={[
                            { value: '', label: 'All Statuses' },
                            ...STATUS_COLUMNS.map(col => ({ value: col, label: col }))
                        ]}
                    />
                </div>
            </Card>

            {/* KANBAN BOARD VIEW */}
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
                                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${
                                            columnStatus === 'Applied' ? 'bg-indigo-500' :
                                            columnStatus === 'Interview' ? 'bg-cyan-400' :
                                            columnStatus === 'Offer' ? 'bg-emerald-500' :
                                            columnStatus === 'Rejected' ? 'bg-rose-500' : 'bg-slate-500'
                                        }`}></span>
                                        {columnStatus}
                                    </h4>
                                    <Badge variant="slate" size="sm">{columnApps.length}</Badge>
                                </div>

                                <div className="flex-1 space-y-3 overflow-y-auto max-h-[600px] pr-0.5">
                                    {columnApps.length === 0 ? (
                                        <div className="h-32 flex items-center justify-center text-center text-xs text-slate-600 border-2 border-dashed border-slate-800/60 rounded-xl">
                                            Drop card here
                                        </div>
                                    ) : (
                                        columnApps.map(app => (
                                            <Card
                                                key={app.id}
                                                variant="interactive"
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, app)}
                                                onClick={() => { setSelectedApp(app); setIsDetailModalOpen(true); }}
                                                className="p-4 space-y-3 cursor-grab active:cursor-grabbing group"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h5 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{app.title}</h5>
                                                        <p className="text-xs text-slate-400 font-medium">{app.company}</p>
                                                    </div>
                                                    {app.score && (
                                                        <Badge variant="indigo" size="sm">{app.score}%</Badge>
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
                                            </Card>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* TABLE LIST VIEW */}
            {viewMode === 'list' && (
                <Card variant="glass" className="overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-900/60">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Job Title</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Company</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Match Score</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Applied Date</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8">
                                        <LoadingSkeleton variant="table-row" count={3} />
                                    </td>
                                </tr>
                            ) : applications.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                        {searchQuery || statusFilter ? 'No applications match your search parameters.' : 'No applications tracked yet. Use Quick Track on the Dashboard or Jobs Hub to start!'}
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
                                            <div className="font-bold text-white">{app.title}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">{app.company}</td>
                                        <td className="px-6 py-4">
                                            <Badge variant={getStatusBadgeVariant(app.status)}>
                                                {app.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${app.score > 80 ? 'bg-emerald-500' : app.score > 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                                        style={{ width: `${app.score}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-bold text-slate-300 font-mono">{app.score}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-mono text-slate-400">{app.applied_date || app.date}</td>
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
                    <div className="p-4 border-t border-slate-800 flex justify-between items-center bg-slate-900/40">
                        <span className="text-xs text-slate-400 font-mono">Page {page}</span>
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                icon={ChevronLeft}
                                disabled={page <= 1 || loading}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                disabled={applications.length < limit || loading}
                                onClick={() => setPage(p => p + 1)}
                            >
                                Next <ChevronRight size={14} />
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Stat Summary Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card variant="glass" className="p-6">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-slate-800/80 rounded-xl text-indigo-400"><Briefcase size={20} /></div>
                        <Badge variant="emerald" size="sm">Live pipeline</Badge>
                    </div>
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Applications</p>
                    <div className="text-2xl font-extrabold text-white mt-1">{applications.length}</div>
                </Card>

                <Card variant="glass" className="p-6">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-slate-800/80 rounded-xl text-cyan-400"><Sparkles size={20} /></div>
                        <Badge variant="cyan" size="sm">Schedule</Badge>
                    </div>
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Interviews Scheduled</p>
                    <div className="text-2xl font-extrabold text-white mt-1">
                        {applications.filter(a => a.status === 'Interview').length}
                    </div>
                </Card>

                <Card variant="glass" className="p-6">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-slate-800/80 rounded-xl text-amber-400"><Sparkles size={20} /></div>
                        <Badge variant="amber" size="sm">Keep tailoring</Badge>
                    </div>
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Average Match Score</p>
                    <div className="text-2xl font-extrabold text-white mt-1">{avgScore}%</div>
                </Card>
            </div>

            {/* Detail & Edit Modal */}
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

export default Tracker;
