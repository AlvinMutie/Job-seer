import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, FileText, MoreVertical, Plus, Briefcase, Sparkles, Search, Filter, AlertCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { trackerService, getApiErrorMessage } from '../services/api';

function Tracker() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Filtering & Pagination State (P2-02/P2-03)
    const [statusFilter, setStatusFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const limit = 10;

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
                <h2 className="text-xl font-bold">Your Application Pipeline</h2>
                <button className="btn-primary">
                    <Plus size={18} /> Add Application
                </button>
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
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Not Applied">Not Applied</option>
                    </select>
                </div>
            </div>

            {/* Applications Table */}
            <div className="glass-card overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-800 bg-slate-800/20">
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Job Title</th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Company</th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Match Score</th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Last Active</th>
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
                                    {searchQuery || statusFilter ? 'No applications match your filter parameters.' : 'No applications tracked yet. Start applying from the Dashboard!'}
                                </td>
                            </tr>
                        ) : (
                            applications.map(app => (
                                <tr key={app.id} className="hover:bg-slate-800/30 transition-colors">
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
                                    <td className="px-6 py-4 text-sm text-slate-500">{app.date}</td>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Active Applications" value={applications.length.toString()} delta="Live updates" icon={<Briefcase className="text-indigo-400" />} />
                <StatCard label="Interviews Scheduled" value={applications.filter(a => a.status === 'Interview').length.toString()} delta="Check your email" icon={<Sparkles className="text-amber-400" />} />
                <StatCard label="Average Match Score" value={`${avgScore}%`} delta="Keep tailoring!" icon={<Sparkles className="text-cyan-400" />} />
            </div>
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
