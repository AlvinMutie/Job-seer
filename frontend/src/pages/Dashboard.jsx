import React, { useState, useEffect } from 'react';
import {
    Search, MapPin, Briefcase, Sparkles, Upload, AlertTriangle,
    ChevronRight, TrendingUp, Target, BarChart3, Scissors, ShieldCheck,
    Mail, History, ArrowRight, LayoutGrid, FileText, CheckCircle2,
    Check, Filter, ChevronDown, RefreshCw, ArrowUpRight
} from 'lucide-react';
import { jobService, authService, trackerService, dashboardService } from '../services/api';
import TailorModal from '../components/TailorModal';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [location, setLocation] = useState('');
    const [matchFilter, setMatchFilter] = useState('all'); // 'all' | 'high' (>=85) | 'target' (70-84)
    const [resumeText, setResumeText] = useState('');
    const [matchingJobId, setMatchingJobId] = useState(null);
    const [matchResults, setMatchResults] = useState({});

    // Toast feedback notification
    const [toast, setToast] = useState({ show: false, text: '', type: 'info' });

    const showToast = (text, type = 'info') => {
        setToast({ show: true, text, type });
        setTimeout(() => setToast({ show: false, text: '', type: 'info' }), 3000);
    };

    // Tailoring State
    const [isTailorModalOpen, setIsTailorModalOpen] = useState(false);
    const [tailorData, setTailorData] = useState({ suggestions: [], jobTitle: '', company: '' });
    const [isTailoring, setIsTailoring] = useState(false);

    const initDashboard = async () => {
        setLoading(true);
        try {
            const [userData, analyticsData, jobsData] = await Promise.all([
                authService.getMe(),
                dashboardService.getAnalytics().catch(() => null),
                jobService.getJobs({ keywords: search, location })
            ]);
            setUser(userData);
            setAnalytics(analyticsData);
            setJobs(jobsData);

            if (userData.profile?.resume_text) {
                setResumeText(userData.profile.resume_text);
            }
        } catch (error) {
            console.error("Dashboard init error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        initDashboard();
    }, []);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const data = await jobService.getJobs({ keywords: search, location });
            setJobs(data);
            setMatchResults({});
        } catch (error) {
            console.error("Failed to fetch jobs:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (jobs.length > 0 && resumeText && Object.keys(matchResults).length === 0) {
            const topJobs = jobs.slice(0, 5);
            topJobs.forEach(job => {
                if (!matchResults[job.id]) {
                    handleMatch(job.id);
                }
            });
        }
    }, [jobs, resumeText]);

    const handleMatch = async (jobId) => {
        if (!resumeText) {
            showToast("Please upload your resume in the Resume Hub first", "warning");
            return;
        }
        setMatchingJobId(jobId);
        try {
            const formData = new FormData();
            formData.append('resume_text', resumeText);
            formData.append('job_id', jobId);
            const result = await jobService.matchResume(formData);
            setMatchResults(prev => ({ ...prev, [jobId]: result }));
            showToast("Match score calculated", "success");
        } catch (error) {
            console.error("Match calculation failed:", error);
        }
        setMatchingJobId(null);
    };

    const handleTailor = async (jobId) => {
        if (!resumeText) return;
        setIsTailoring(true);
        try {
            const formData = new FormData();
            formData.append('resume_text', resumeText);
            formData.append('job_id', jobId);
            const result = await jobService.tailorResume(formData);
            setTailorData({
                suggestions: result.suggestions,
                jobTitle: result.job_title,
                company: result.company
            });
            setIsTailorModalOpen(true);
            showToast("CV tailored for " + result.company, "success");
        } catch (error) {
            console.error("Tailoring failed:", error);
        } finally {
            setIsTailoring(false);
        }
    };

    // Filter jobs by match tier if selected
    const filteredJobs = jobs.filter(job => {
        const score = matchResults[job.id]?.match_percentage || 0;
        if (matchFilter === 'high') return score >= 85;
        if (matchFilter === 'target') return score >= 70 && score < 85;
        return true;
    });

    // Categorize jobs into tiered groups for Pipesale-style sections
    const highMatchJobs = filteredJobs.filter(j => (matchResults[j.id]?.match_percentage || 0) >= 85);
    const targetMatchJobs = filteredJobs.filter(j => {
        const s = matchResults[j.id]?.match_percentage || 0;
        return s >= 70 && s < 85;
    });
    const standardJobs = filteredJobs.filter(j => (matchResults[j.id]?.match_percentage || 0) < 70);

    const totalApplications = analytics?.total_applications || 0;
    const interviewCount = analytics?.status_counts?.interview || 0;
    const appliedCount = analytics?.status_counts?.applied || 0;
    const offerCount = analytics?.status_counts?.offer || 0;

    return (
        <div className="space-y-6 animate-fade-in relative w-full text-slate-100 font-sans">
            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-2.5 animate-fade-in text-xs font-semibold ${
                    toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300' :
                    toast.type === 'warning' ? 'bg-amber-950/90 border-amber-500/30 text-amber-300' :
                    'bg-indigo-950/90 border-indigo-500/30 text-indigo-300'
                }`}>
                    <Sparkles size={16} />
                    <span>{toast.text}</span>
                </div>
            )}

            {/* 1. Pipesale Top Header & Breadcrumb Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Career Intelligence</h1>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Real-time compatibility matching, application pipeline, and ATS readiness.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <a href="/resume-hub">
                        <Button variant="ghost" size="sm" icon={FileText} className="border border-slate-800 bg-slate-900/60 text-xs">
                            Resume Hub
                        </Button>
                    </a>
                    <a href="/tracker">
                        <Button variant="ghost" size="sm" icon={LayoutGrid} className="border border-slate-800 bg-slate-900/60 text-xs">
                            Kanban Pipeline
                        </Button>
                    </a>
                </div>
            </div>

            {/* Pipesale Filter Pills Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                    <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white font-medium flex items-center gap-2">
                        <Target size={14} className="text-indigo-400" />
                        <span>Scope: {user?.profile?.preferred_role || 'Engineering Roles'}</span>
                    </div>

                    <div className="flex items-center bg-slate-900/80 p-0.5 rounded-lg border border-slate-800">
                        <button
                            onClick={() => setMatchFilter('all')}
                            className={`px-2.5 py-1 rounded-md transition-all font-medium ${matchFilter === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            All ({jobs.length})
                        </button>
                        <button
                            onClick={() => setMatchFilter('high')}
                            className={`px-2.5 py-1 rounded-md transition-all font-medium ${matchFilter === 'high' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            &gt;85% Fit
                        </button>
                        <button
                            onClick={() => setMatchFilter('target')}
                            className={`px-2.5 py-1 rounded-md transition-all font-medium ${matchFilter === 'target' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            70%-84% Fit
                        </button>
                    </div>

                    <div className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 font-medium flex items-center gap-1.5">
                        <ShieldCheck size={14} className="text-emerald-400" />
                        <span>ATS: {analytics?.ats_health_score !== null ? `${analytics?.ats_health_score}%` : 'Ready'}</span>
                    </div>

                    <div className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 font-mono text-[11px] flex items-center gap-1.5">
                        <span>View: Tabular Grid</span>
                    </div>
                </div>

                {/* Table Quick Search Input */}
                <form onSubmit={(e) => { e.preventDefault(); fetchJobs(); }} className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Filter roles, skills, companies..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                    <Button type="submit" variant="primary" size="sm" className="py-1.5 text-xs">
                        Filter
                    </Button>
                </form>
            </div>

            {/* 2. Main Layout Grid (Left 65% Table / Right 35% Analytics) */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                {/* Center / Left Section: High-Density Structured Table (~65%) */}
                <div className="xl:col-span-8 space-y-4">
                    <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl overflow-hidden shadow-xl">
                        {/* Table Header Bar */}
                        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
                            <div className="flex items-center gap-2.5">
                                <h2 className="text-sm font-bold text-white">Target Opportunities & Discovery</h2>
                                <span className="text-[11px] text-slate-400 font-mono bg-slate-800/80 px-2 py-0.5 rounded">
                                    {filteredJobs.length} roles listed
                                </span>
                            </div>
                            <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                                Click row actions to Tailor or Quick Track
                            </span>
                        </div>

                        {loading ? (
                            <div className="p-6">
                                <LoadingSkeleton variant="card" count={4} />
                            </div>
                        ) : filteredJobs.length === 0 ? (
                            <div className="p-8">
                                <EmptyState
                                    icon={Search}
                                    title="No opportunities found"
                                    description="Try clearing search filters or modifying role parameters to discover opportunities."
                                    action={<Button variant="secondary" size="sm" onClick={() => { setSearch(''); setLocation(''); fetchJobs(); }}>Reset Filters</Button>}
                                />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="border-b border-slate-800/80 bg-slate-900/60 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                                            <th className="py-3 px-4">Role & Company</th>
                                            <th className="py-3 px-3">Location / Type</th>
                                            <th className="py-3 px-3">Required Tech Stack</th>
                                            <th className="py-3 px-3 text-center">V2 Match</th>
                                            <th className="py-3 px-3">Missing Skills</th>
                                            <th className="py-3 px-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/60 font-sans">
                                        {/* Tier 1: High Match Section */}
                                        {highMatchJobs.length > 0 && (
                                            <>
                                                <tr className="bg-slate-900/40 border-t border-b border-slate-800">
                                                    <td colSpan={6} className="py-2 px-4 text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                                                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-2" />
                                                        High Compatibility Matches (&ge;85%) &bull; {highMatchJobs.length} roles
                                                    </td>
                                                </tr>
                                                {highMatchJobs.map(job => (
                                                    <JobTableRow
                                                        key={job.id}
                                                        job={job}
                                                        matchResult={matchResults[job.id]}
                                                        isMatching={matchingJobId === job.id}
                                                        isTailoring={isTailoring}
                                                        onMatch={() => handleMatch(job.id)}
                                                        onTailor={() => handleTailor(job.id)}
                                                        onTracked={() => {
                                                            initDashboard();
                                                            showToast("Application added to Pipeline Tracker", "success");
                                                        }}
                                                    />
                                                ))}
                                            </>
                                        )}

                                        {/* Tier 2: Strong Target Matches */}
                                        {targetMatchJobs.length > 0 && (
                                            <>
                                                <tr className="bg-slate-900/40 border-t border-b border-slate-800">
                                                    <td colSpan={6} className="py-2 px-4 text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                                                        <span className="inline-block w-2 h-2 rounded-full bg-indigo-400 mr-2" />
                                                        Target Matches (70% &ndash; 84%) &bull; {targetMatchJobs.length} roles
                                                    </td>
                                                </tr>
                                                {targetMatchJobs.map(job => (
                                                    <JobTableRow
                                                        key={job.id}
                                                        job={job}
                                                        matchResult={matchResults[job.id]}
                                                        isMatching={matchingJobId === job.id}
                                                        isTailoring={isTailoring}
                                                        onMatch={() => handleMatch(job.id)}
                                                        onTailor={() => handleTailor(job.id)}
                                                        onTracked={() => {
                                                            initDashboard();
                                                            showToast("Application added to Pipeline Tracker", "success");
                                                        }}
                                                    />
                                                ))}
                                            </>
                                        )}

                                        {/* Tier 3: Other Active Roles */}
                                        {standardJobs.length > 0 && (
                                            <>
                                                <tr className="bg-slate-900/40 border-t border-b border-slate-800">
                                                    <td colSpan={6} className="py-2 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                        <span className="inline-block w-2 h-2 rounded-full bg-slate-500 mr-2" />
                                                        Active Openings &bull; {standardJobs.length} roles
                                                    </td>
                                                </tr>
                                                {standardJobs.map(job => (
                                                    <JobTableRow
                                                        key={job.id}
                                                        job={job}
                                                        matchResult={matchResults[job.id]}
                                                        isMatching={matchingJobId === job.id}
                                                        isTailoring={isTailoring}
                                                        onMatch={() => handleMatch(job.id)}
                                                        onTailor={() => handleTailor(job.id)}
                                                        onTracked={() => {
                                                            initDashboard();
                                                            showToast("Application added to Pipeline Tracker", "success");
                                                        }}
                                                    />
                                                ))}
                                            </>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Section: Executive Analytics & Funnel Stack (~35%) */}
                <div className="xl:col-span-4 space-y-5">
                    {/* Widget 1: Two Compact KPI Cards with Sparklines */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Metric 1: Average Fit Score */}
                        <div className="p-4 bg-slate-950/80 border border-slate-800/90 rounded-2xl space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 text-xs font-semibold">Average Match</span>
                                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                    +4.92%
                                </span>
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="text-2xl font-bold text-white tracking-tight">
                                    {analytics?.average_match_score || 88}%
                                </span>
                                {/* Mini Green Sparkline */}
                                <svg className="w-16 h-6 stroke-emerald-400 fill-none" strokeWidth="2">
                                    <polyline points="0,20 8,17 16,19 24,12 32,15 40,8 48,11 56,4 64,2" />
                                </svg>
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium">Explainable 4-factor average</p>
                        </div>

                        {/* Metric 2: ATS Health Rate */}
                        <div className="p-4 bg-slate-950/80 border border-slate-800/90 rounded-2xl space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 text-xs font-semibold">ATS Health</span>
                                <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                                    Verified
                                </span>
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="text-2xl font-bold text-white tracking-tight">
                                    {analytics?.ats_health_score !== null ? `${analytics?.ats_health_score}%` : '96%'}
                                </span>
                                {/* Mini Cyan Sparkline */}
                                <svg className="w-16 h-6 stroke-cyan-400 fill-none" strokeWidth="2">
                                    <polyline points="0,18 8,15 16,16 24,10 32,12 40,6 48,8 56,3 64,1" />
                                </svg>
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium">{analytics?.ats_classification || 'Passed parsing scan'}</p>
                        </div>
                    </div>

                    {/* Widget 2: Application Velocity & Growth (Bar Chart Card) */}
                    <div className="p-5 bg-slate-950/80 border border-slate-800/90 rounded-2xl space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Pipeline Velocity</h3>
                                <p className="text-[11px] text-slate-400 mt-0.5">Application output vs. recruiter response</p>
                            </div>
                            <div className="flex items-center gap-3 text-[10px]">
                                <span className="flex items-center gap-1 text-slate-400">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500" /> Submitted
                                </span>
                                <span className="flex items-center gap-1 text-slate-400">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> Responses
                                </span>
                            </div>
                        </div>

                        {/* Stacked CSS Bar Chart */}
                        <div className="h-32 flex items-end justify-between gap-3 pt-4 px-2 border-b border-slate-800/80">
                            {[
                                { month: 'Jan', applied: 35, response: 18 },
                                { month: 'Feb', applied: 48, response: 24 },
                                { month: 'Mar', applied: 62, response: 32 },
                                { month: 'Apr', applied: 75, response: 46 },
                                { month: 'May', applied: 92, response: 58 }
                            ].map((bar) => (
                                <div key={bar.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                                    <div className="w-full flex flex-col items-center gap-1 h-full justify-end">
                                        <div
                                            className="w-full max-w-[28px] bg-emerald-400/90 rounded-t-sm transition-all group-hover:brightness-110"
                                            style={{ height: `${bar.response}%` }}
                                            title={`Responses: ${bar.response}`}
                                        />
                                        <div
                                            className="w-full max-w-[28px] bg-indigo-600/90 rounded-sm transition-all group-hover:brightness-110"
                                            style={{ height: `${bar.applied - bar.response}%` }}
                                            title={`Submitted: ${bar.applied}`}
                                        />
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-mono">{bar.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Widget 3: Funnel Conversion Card (Matching Pipesale Reference) */}
                    <div className="p-5 bg-slate-950/80 border border-slate-800/90 rounded-2xl space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Funnel Conversion</h3>
                            <span className="text-[10px] text-slate-400 font-mono">5-Stage Pipeline</span>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-300 font-medium">Discovered to Analyzed</span>
                                    <span className="font-bold text-white font-mono">100%</span>
                                </div>
                                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                                    <div className="bg-indigo-500 h-full rounded-full w-full" />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-300 font-medium">Tailored to Applied</span>
                                    <span className="font-bold text-indigo-300 font-mono">
                                        {totalApplications > 0 ? `${Math.min(100, Math.round((appliedCount / Math.max(1, totalApplications)) * 100))}%` : '42%'}
                                    </span>
                                </div>
                                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                                    <div className="bg-cyan-500 h-full rounded-full" style={{ width: '42%' }} />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-300 font-medium">Applied to Interview</span>
                                    <span className="font-bold text-cyan-300 font-mono">
                                        {totalApplications > 0 ? `${Math.min(100, Math.round((interviewCount / Math.max(1, totalApplications)) * 100))}%` : '28%'}
                                    </span>
                                </div>
                                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                                    <div className="bg-purple-500 h-full rounded-full" style={{ width: '28%' }} />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-300 font-medium">Interview to Offer</span>
                                    <span className="font-bold text-emerald-300 font-mono">
                                        {totalApplications > 0 ? `${Math.min(100, Math.round((offerCount / Math.max(1, totalApplications)) * 100))}%` : '15%'}
                                    </span>
                                </div>
                                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: '15%' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Widget 4: Recent AI Materials Drawer */}
                    <div className="p-5 bg-slate-950/80 border border-slate-800/90 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                                <History size={14} className="text-indigo-400" /> Recent Tailored Assets
                            </h3>
                            <a href="/resume-hub" className="text-xs text-indigo-400 hover:underline">View All</a>
                        </div>

                        <div className="space-y-2 text-xs">
                            {analytics?.recent_tailored_resumes?.slice(0, 2).map(item => (
                                <div key={item.id} className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between items-center">
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <Badge variant="indigo" size="sm">CV v{item.version}</Badge>
                                            <span className="text-slate-300 font-bold truncate max-w-[150px]">{item.job_title}</span>
                                        </div>
                                        <span className="text-slate-500 text-[10px]">{item.company}</span>
                                    </div>
                                    <a href="/resume-hub" className="text-indigo-400 hover:text-indigo-300 font-semibold text-[11px]">Diff</a>
                                </div>
                            ))}

                            {analytics?.recent_cover_letters?.slice(0, 2).map(letter => (
                                <div key={letter.id} className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between items-center">
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <Badge variant="cyan" size="sm">{letter.tone}</Badge>
                                            <span className="text-slate-300 font-bold truncate max-w-[150px]">{letter.job_title}</span>
                                        </div>
                                        <span className="text-slate-500 text-[10px]">{letter.company}</span>
                                    </div>
                                    <a href="/resume-hub" className="text-indigo-400 hover:text-indigo-300 font-semibold text-[11px]">View</a>
                                </div>
                            ))}

                            {(!analytics?.recent_tailored_resumes?.length && !analytics?.recent_cover_letters?.length) && (
                                <p className="text-slate-500 text-xs py-2">No tailored materials generated yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Resume Tailor Modal */}
            <TailorModal
                isOpen={isTailorModalOpen}
                onClose={() => setIsTailorModalOpen(false)}
                suggestions={tailorData.suggestions}
                jobTitle={tailorData.jobTitle}
                company={tailorData.company}
            />
        </div>
    );
}

// Subcomponent: JobTableRow (Pipesale Structured Row)
function JobTableRow({ job, matchResult, isMatching, isTailoring, onMatch, onTailor, onTracked }) {
    const [tracking, setTracking] = useState(false);
    const [tracked, setTracked] = useState(false);

    const score = matchResult?.match_percentage || 0;

    const handleQuickTrack = async () => {
        setTracking(true);
        try {
            await trackerService.addApplication({
                job_id: job.id,
                status: 'Applied',
                match_score: score
            });
            setTracked(true);
            if (onTracked) onTracked();
        } catch (err) {
            console.error("Quick track failed:", err);
        } finally {
            setTracking(false);
        }
    };

    const skills = (job.skills_required || "")
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

    return (
        <tr className="hover:bg-slate-900/50 transition-colors group">
            {/* 1. Role Title & Company */}
            <td className="py-3 px-4">
                <div className="font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {job.title}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <Briefcase size={12} className="text-slate-500" />
                    <span>{job.company}</span>
                </div>
            </td>

            {/* 2. Location / Remote Status */}
            <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                    {job.remote_status || 'Hybrid'}
                </span>
            </td>

            {/* 3. Tech Stack Tags */}
            <td className="py-3 px-3">
                <div className="flex flex-wrap gap-1 max-w-xs">
                    {skills.slice(0, 3).map(skill => (
                        <span key={skill} className="px-1.5 py-0.5 rounded bg-slate-900/80 border border-slate-800 text-[10px] text-slate-400">
                            {skill}
                        </span>
                    ))}
                    {skills.length > 3 && (
                        <span className="text-[10px] text-slate-500 self-center">
                            +{skills.length - 3}
                        </span>
                    )}
                </div>
            </td>

            {/* 4. V2 Match Score */}
            <td className="py-3 px-3 text-center whitespace-nowrap">
                {score > 0 ? (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        score >= 85
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : score >= 70
                            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                        {score}%
                    </span>
                ) : (
                    <button
                        onClick={onMatch}
                        disabled={isMatching}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold underline disabled:opacity-50"
                    >
                        {isMatching ? 'Scoring...' : 'Score Match'}
                    </button>
                )}
            </td>

            {/* 5. Missing Skills */}
            <td className="py-3 px-3">
                {matchResult?.missing_skills?.length > 0 ? (
                    <div className="flex flex-wrap gap-1 max-w-[140px]">
                        {matchResult.missing_skills.slice(0, 2).map(skill => (
                            <span key={skill} className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300 text-[10px] border border-rose-500/20">
                                {skill}
                            </span>
                        ))}
                    </div>
                ) : (
                    <span className="text-[10px] text-slate-500 font-mono">&mdash;</span>
                )}
            </td>

            {/* 6. Inline Row Actions */}
            <td className="py-3 px-4 text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-1.5">
                    {score > 0 && (
                        <button
                            onClick={onTailor}
                            disabled={isTailoring}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                            title="Tailor Resume CV"
                        >
                            <Scissors size={13} />
                        </button>
                    )}

                    <Button
                        variant={tracked ? 'success' : 'secondary'}
                        size="sm"
                        onClick={handleQuickTrack}
                        isLoading={tracking}
                        disabled={tracked}
                        className="py-1 px-2.5 text-[11px] h-7"
                    >
                        {tracked ? (
                            <span className="flex items-center gap-1">
                                <Check size={12} /> Tracked
                            </span>
                        ) : (
                            'Track'
                        )}
                    </Button>
                </div>
            </td>
        </tr>
    );
}

export default Dashboard;
