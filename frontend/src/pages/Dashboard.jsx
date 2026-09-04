import React, { useState, useEffect } from 'react';
import {
    Search, Briefcase, Sparkles, Upload, AlertTriangle,
    ChevronRight, Target, Scissors, ShieldCheck,
    FileText, CheckCircle2, Check, LayoutGrid, History
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

    // Filter jobs by match tier
    const filteredJobs = jobs.filter(job => {
        const score = matchResults[job.id]?.match_percentage || 0;
        if (matchFilter === 'high') return score >= 85;
        if (matchFilter === 'target') return score >= 70 && score < 85;
        return true;
    });

    // Categorize jobs into tiered groups for structured rows
    const highMatchJobs = filteredJobs.filter(j => (matchResults[j.id]?.match_percentage || 0) >= 85);
    const targetMatchJobs = filteredJobs.filter(j => {
        const s = matchResults[j.id]?.match_percentage || 0;
        return s >= 70 && s < 85;
    });
    const standardJobs = filteredJobs.filter(j => (matchResults[j.id]?.match_percentage || 0) < 70);

    return (
        <div className="space-y-6 animate-fade-in relative w-full text-slate-900 font-sans">
            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2.5 animate-fade-in text-xs font-semibold ${
                    toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                    toast.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                    'bg-indigo-50 border-indigo-200 text-indigo-800'
                }`}>
                    <Sparkles size={16} />
                    <span>{toast.text}</span>
                </div>
            )}

            {/* 1. Header & Direct Action Links */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Overview</h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Target role compatibility, candidate pipeline, and ATS readiness.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <a href="/resume-hub">
                        <Button variant="secondary" size="sm" icon={FileText} className="text-xs">
                            Resume Hub
                        </Button>
                    </a>
                    <a href="/tracker">
                        <Button variant="secondary" size="sm" icon={LayoutGrid} className="text-xs">
                            Kanban Tracker
                        </Button>
                    </a>
                </div>
            </div>

            {/* 2. Four Clean, Simple KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
                    <span className="text-xs font-semibold text-slate-500">Average Match Fit</span>
                    <div className="text-2xl font-bold text-indigo-600">
                        {analytics?.average_match_score || 0}%
                    </div>
                    <p className="text-[11px] text-slate-400">Explainable 4-factor scoring</p>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
                    <span className="text-xs font-semibold text-slate-500">Tracked Applications</span>
                    <div className="text-2xl font-bold text-slate-900">
                        {analytics?.total_applications || 0}
                    </div>
                    <p className="text-[11px] text-slate-400">
                        {analytics?.status_counts?.interview || 0} Interviews &bull; {analytics?.status_counts?.applied || 0} Applied
                    </p>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
                    <span className="text-xs font-semibold text-slate-500">ATS Document Health</span>
                    <div className="text-2xl font-bold text-emerald-600">
                        {analytics?.ats_health_score !== null ? `${analytics?.ats_health_score}%` : 'Ready'}
                    </div>
                    <p className="text-[11px] text-slate-400">{analytics?.ats_classification || 'Scan complete'}</p>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
                    <span className="text-xs font-semibold text-slate-500">Tailored Materials</span>
                    <div className="text-2xl font-bold text-slate-900">
                        {(analytics?.tailored_resumes_count || 0) + (analytics?.cover_letters_count || 0)}
                    </div>
                    <p className="text-[11px] text-slate-400">
                        {analytics?.tailored_resumes_count || 0} CVs &bull; {analytics?.cover_letters_count || 0} Letters
                    </p>
                </div>
            </div>

            {/* 3. Filter Controls Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 bg-white border border-slate-200 rounded-xl shadow-xs">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                    <div className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-medium flex items-center gap-2">
                        <Target size={14} className="text-indigo-600" />
                        <span>Scope: {user?.profile?.preferred_role || 'Engineering Roles'}</span>
                    </div>

                    <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                        <button
                            onClick={() => setMatchFilter('all')}
                            className={`px-2.5 py-1 rounded-md transition-all font-medium ${matchFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                            All ({jobs.length})
                        </button>
                        <button
                            onClick={() => setMatchFilter('high')}
                            className={`px-2.5 py-1 rounded-md transition-all font-medium ${matchFilter === 'high' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                            &ge;85% Fit
                        </button>
                        <button
                            onClick={() => setMatchFilter('target')}
                            className={`px-2.5 py-1 rounded-md transition-all font-medium ${matchFilter === 'target' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                            70%&ndash;84% Fit
                        </button>
                    </div>

                    <div className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 font-mono text-[11px]">
                        Tabular View
                    </div>
                </div>

                {/* Search Bar */}
                <form onSubmit={(e) => { e.preventDefault(); fetchJobs(); }} className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search roles, skills, companies..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                        />
                    </div>
                    <Button type="submit" variant="primary" size="sm" className="py-1.5 text-xs">
                        Filter
                    </Button>
                </form>
            </div>

            {/* 4. Main Content Grid (Structured Table + Right Summary) */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                {/* Left Area: Structured Data Table (8 Cols) */}
                <div className="xl:col-span-8 space-y-4">
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-2">
                                <h2 className="text-sm font-bold text-slate-900">Opportunities & Matching</h2>
                                <span className="text-[11px] text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded">
                                    {filteredJobs.length} roles
                                </span>
                            </div>
                            <span className="text-[11px] text-slate-400 hidden sm:inline">
                                Instant AI Match &bull; Factual CV Tailor &bull; Pipeline Track
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
                                    description="Try adjusting keyword filters or reset search parameters."
                                    action={<Button variant="secondary" size="sm" onClick={() => { setSearch(''); setLocation(''); fetchJobs(); }}>Reset Filters</Button>}
                                />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                                            <th className="py-2.5 px-4">Role & Company</th>
                                            <th className="py-2.5 px-3">Workstyle</th>
                                            <th className="py-2.5 px-3">Tech Stack</th>
                                            <th className="py-2.5 px-3 text-center">Fit Score</th>
                                            <th className="py-2.5 px-3">Missing Skills</th>
                                            <th className="py-2.5 px-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 font-sans">
                                        {/* High Match Section */}
                                        {highMatchJobs.length > 0 && (
                                            <>
                                                <tr className="bg-emerald-50/40 border-t border-b border-emerald-100">
                                                    <td colSpan={6} className="py-1.5 px-4 text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                                                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2" />
                                                        High Compatibility (&ge;85%) &bull; {highMatchJobs.length} roles
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
                                                            showToast("Added to Pipeline Tracker", "success");
                                                        }}
                                                    />
                                                ))}
                                            </>
                                        )}

                                        {/* Target Match Section */}
                                        {targetMatchJobs.length > 0 && (
                                            <>
                                                <tr className="bg-indigo-50/40 border-t border-b border-indigo-100">
                                                    <td colSpan={6} className="py-1.5 px-4 text-[11px] font-bold text-indigo-800 uppercase tracking-wider">
                                                        <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 mr-2" />
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
                                                            showToast("Added to Pipeline Tracker", "success");
                                                        }}
                                                    />
                                                ))}
                                            </>
                                        )}

                                        {/* Standard Openings */}
                                        {standardJobs.length > 0 && (
                                            <>
                                                <tr className="bg-slate-50 border-t border-b border-slate-200">
                                                    <td colSpan={6} className="py-1.5 px-4 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                                                        <span className="inline-block w-2 h-2 rounded-full bg-slate-400 mr-2" />
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
                                                            showToast("Added to Pipeline Tracker", "success");
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

                {/* Right Area: Clean Sidebar (4 Cols) */}
                <div className="xl:col-span-4 space-y-4">
                    {/* Pipeline Stage Breakdown */}
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                Pipeline Status
                            </h3>
                            <a href="/tracker" className="text-xs text-indigo-600 hover:underline font-medium">
                                Kanban
                            </a>
                        </div>
                        <div className="space-y-2 text-xs">
                            <StageItem label="Interview Scheduled" count={analytics?.status_counts?.interview || 0} color="bg-cyan-500" />
                            <StageItem label="Applied" count={analytics?.status_counts?.applied || 0} color="bg-indigo-500" />
                            <StageItem label="Offer Received" count={analytics?.status_counts?.offer || 0} color="bg-emerald-500" />
                            <StageItem label="Not Applied" count={analytics?.status_counts?.not_applied || 0} color="bg-slate-400" />
                            <StageItem label="Rejected" count={analytics?.status_counts?.rejected || 0} color="bg-rose-500" />
                        </div>
                    </div>

                    {/* Recent Generated Assets */}
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                <History size={14} className="text-indigo-600" /> Recent Tailored Assets
                            </h3>
                            <a href="/resume-hub" className="text-xs text-indigo-600 hover:underline font-medium">
                                View All
                            </a>
                        </div>

                        <div className="space-y-2 text-xs">
                            {analytics?.recent_tailored_resumes?.slice(0, 3).map(item => (
                                <div key={item.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="badge badge-indigo text-[10px] py-0 px-1.5">v{item.version}</span>
                                            <span className="text-slate-900 font-bold truncate max-w-[140px]">{item.job_title}</span>
                                        </div>
                                        <span className="text-slate-500 text-[11px]">{item.company}</span>
                                    </div>
                                    <a href="/resume-hub" className="text-indigo-600 hover:text-indigo-800 font-semibold text-[11px]">Diff</a>
                                </div>
                            ))}

                            {analytics?.recent_cover_letters?.slice(0, 2).map(letter => (
                                <div key={letter.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="badge badge-cyan text-[10px] py-0 px-1.5">{letter.tone}</span>
                                            <span className="text-slate-900 font-bold truncate max-w-[140px]">{letter.job_title}</span>
                                        </div>
                                        <span className="text-slate-500 text-[11px]">{letter.company}</span>
                                    </div>
                                    <a href="/resume-hub" className="text-indigo-600 hover:text-indigo-800 font-semibold text-[11px]">View</a>
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

function StageItem({ label, count, color }) {
    return (
        <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50">
            <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                <span className="text-slate-700 font-medium">{label}</span>
            </div>
            <span className="font-bold text-slate-900 font-mono">{count}</span>
        </div>
    );
}

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
        <tr className="hover:bg-slate-50 transition-colors group">
            {/* Role Title & Company */}
            <td className="py-3 px-4">
                <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {job.title}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <Briefcase size={12} className="text-slate-400" />
                    <span>{job.company}</span>
                </div>
            </td>

            {/* Location / Remote Status */}
            <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px] text-slate-700">
                    {job.remote_status || 'Hybrid'}
                </span>
            </td>

            {/* Tech Stack Tags */}
            <td className="py-3 px-3">
                <div className="flex flex-wrap gap-1 max-w-xs">
                    {skills.slice(0, 3).map(skill => (
                        <span key={skill} className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700">
                            {skill}
                        </span>
                    ))}
                    {skills.length > 3 && (
                        <span className="text-[10px] text-slate-400 self-center">
                            +{skills.length - 3}
                        </span>
                    )}
                </div>
            </td>

            {/* V2 Match Score */}
            <td className="py-3 px-3 text-center whitespace-nowrap">
                {score > 0 ? (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        score >= 85
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : score >= 70
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                        {score}%
                    </span>
                ) : (
                    <button
                        onClick={onMatch}
                        disabled={isMatching}
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold underline disabled:opacity-50"
                    >
                        {isMatching ? 'Scoring...' : 'Score'}
                    </button>
                )}
            </td>

            {/* Missing Skills */}
            <td className="py-3 px-3">
                {matchResult?.missing_skills?.length > 0 ? (
                    <div className="flex flex-wrap gap-1 max-w-[140px]">
                        {matchResult.missing_skills.slice(0, 2).map(skill => (
                            <span key={skill} className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 text-[10px] border border-rose-200">
                                {skill}
                            </span>
                        ))}
                    </div>
                ) : (
                    <span className="text-[10px] text-slate-400 font-mono">&mdash;</span>
                )}
            </td>

            {/* Inline Row Actions */}
            <td className="py-3 px-4 text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-1.5">
                    {score > 0 && (
                        <button
                            onClick={onTailor}
                            disabled={isTailoring}
                            className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
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
