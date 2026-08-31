import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Sparkles, Upload, AlertTriangle, ChevronRight, TrendingUp, Target, BarChart3, Scissors, ShieldCheck, Mail, History, ArrowRight, LayoutGrid, FileText, CheckCircle2 } from 'lucide-react';
import { jobService, authService, trackerService, dashboardService } from '../services/api';
import TailorModal from '../components/TailorModal';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [location, setLocation] = useState('');
    const [resumeText, setResumeText] = useState('');
    const [matchingJobId, setMatchingJobId] = useState(null);
    const [matchResults, setMatchResults] = useState({});

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
            console.error("Dashboard command center init failed:", error);
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
            alert("Please upload your resume text in the Resume Hub first!");
            return;
        }
        setMatchingJobId(jobId);
        try {
            const formData = new FormData();
            formData.append('resume_text', resumeText);
            formData.append('job_id', jobId);
            const result = await jobService.matchResume(formData);
            setMatchResults(prev => ({ ...prev, [jobId]: result }));
        } catch (error) {
            console.error("Match failed:", error);
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
        } catch (error) {
            console.error("Tailoring failed:", error);
        } finally {
            setIsTailoring(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Command Center Hero Greeting */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border-indigo-500/20">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="badge badge-indigo">Command Center</span>
                        <span className="text-xs text-slate-400 font-mono">Targeting: {user?.profile?.preferred_role || 'General Engineering'}</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-white">Welcome back, {user?.full_name?.split(' ')[0] || 'Hunter'} 👋</h1>
                    <p className="text-xs text-slate-400 mt-1">Real-time intelligence dashboard across your matching scores, application pipeline, and AI assets.</p>
                </div>

                {!user?.profile?.has_resume ? (
                    <a href="/resume-hub" className="px-4 py-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-2 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-colors">
                        <AlertTriangle size={16} /> Upload CV for AI Match Scoring
                    </a>
                ) : (
                    <a href="/resume-hub" className="px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-colors">
                        <ShieldCheck size={16} /> ATS Health: {analytics?.ats_health_score ? `${analytics.ats_health_score}% (${analytics.ats_classification})` : 'Active'}
                    </a>
                )}
            </div>

            {/* Command Intelligence KPI Analytics Grid (P3-07) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card p-5 space-y-3 border-indigo-500/20 bg-indigo-500/5">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 bg-indigo-500/20 rounded-xl text-indigo-400">
                            <Target size={20} />
                        </div>
                        <span className="text-xs text-indigo-400 font-bold">AI V2 Score</span>
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Average Match</p>
                        <p className="text-2xl font-bold text-white mt-1">{analytics?.average_match_score || 0}%</p>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${analytics?.average_match_score || 0}%` }}></div>
                    </div>
                </div>

                <div className="glass-card p-5 space-y-3 border-emerald-500/20 bg-emerald-500/5">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 bg-emerald-500/20 rounded-xl text-emerald-400">
                            <TrendingUp size={20} />
                        </div>
                        <span className="text-xs text-emerald-400 font-bold">Pipeline</span>
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Total Applications</p>
                        <p className="text-2xl font-bold text-white mt-1">{analytics?.total_applications || 0}</p>
                    </div>
                    <p className="text-[11px] text-slate-400">
                        {analytics?.status_counts?.interview || 0} Interviews · {analytics?.status_counts?.applied || 0} Applied
                    </p>
                </div>

                <div className="glass-card p-5 space-y-3 border-cyan-500/20 bg-cyan-500/5">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 bg-cyan-500/20 rounded-xl text-cyan-400">
                            <ShieldCheck size={20} />
                        </div>
                        <span className="text-xs text-cyan-400 font-bold">P3-03 Check</span>
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">ATS Health Score</p>
                        <p className="text-2xl font-bold text-white mt-1">
                            {analytics?.ats_health_score !== null ? `${analytics?.ats_health_score}%` : 'N/A'}
                        </p>
                    </div>
                    <p className="text-[11px] text-slate-400">{analytics?.ats_classification || 'Upload resume to check'}</p>
                </div>

                <div className="glass-card p-5 space-y-3 border-amber-500/20 bg-amber-500/5">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 bg-amber-500/20 rounded-xl text-amber-400">
                            <History size={20} />
                        </div>
                        <span className="text-xs text-amber-400 font-bold">Assets Saved</span>
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Tailored & Letters</p>
                        <p className="text-2xl font-bold text-white mt-1">
                            {(analytics?.tailored_resumes_count || 0) + (analytics?.cover_letters_count || 0)}
                        </p>
                    </div>
                    <p className="text-[11px] text-slate-400">
                        {analytics?.tailored_resumes_count || 0} Tailored CVs · {analytics?.cover_letters_count || 0} Letters
                    </p>
                </div>
            </div>

            {/* Quick Action Launch Bar */}
            <div className="glass-card p-4 flex flex-wrap items-center justify-between gap-3 bg-slate-900/60">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles size={16} className="text-indigo-400" /> Action Launchpad
                </span>
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <a href="/resume-hub" className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30 transition-colors flex items-center gap-1.5">
                        <Upload size={14} /> Resume Hub
                    </a>
                    <a href="/resume-hub" className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 transition-colors flex items-center gap-1.5">
                        <Scissors size={14} /> Tailor CV
                    </a>
                    <a href="/resume-hub" className="px-3 py-1.5 rounded-lg bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-600/30 transition-colors flex items-center gap-1.5">
                        <Mail size={14} /> Cover Letters
                    </a>
                    <a href="/tracker" className="px-3 py-1.5 rounded-lg bg-amber-600/20 text-amber-300 border border-amber-500/30 hover:bg-amber-600/30 transition-colors flex items-center gap-1.5">
                        <LayoutGrid size={14} /> Kanban Tracker
                    </a>
                    <a href="/jobs-hub" className="px-3 py-1.5 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 transition-colors flex items-center gap-1.5">
                        <Briefcase size={14} /> Jobs Hub
                    </a>
                </div>
            </div>

            {/* Search Bar */}
            <div className="glass-card p-2 flex gap-2">
                <div className="flex-1 flex items-center px-4 gap-3">
                    <Search className="text-slate-500" size={20} />
                    <input
                        className="bg-transparent border-none outline-none w-full text-white text-sm placeholder-slate-500"
                        placeholder="Search keywords (React, Python, FastAPI, Docker...)"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="w-px h-8 bg-slate-700/50 my-auto"></div>
                <div className="flex-1 flex items-center px-4 gap-3">
                    <MapPin className="text-slate-500" size={20} />
                    <input
                        className="bg-transparent border-none outline-none w-full text-white text-sm placeholder-slate-500"
                        placeholder="Location preference"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>
                <button onClick={fetchJobs} className="btn-primary py-2.5 px-6 text-sm font-bold">
                    Find Jobs
                </button>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Job Discovery & Recommendations Column */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        Top AI Recommendations <Sparkles className="text-amber-400" size={18} />
                    </h2>

                    {loading ? (
                        <div className="text-center py-20 text-slate-500">Loading recommendations...</div>
                    ) : jobs.length === 0 ? (
                        <div className="text-center py-20 text-slate-500">No jobs found matching parameters.</div>
                    ) : (
                        jobs.map(job => (
                            <JobCard
                                key={job.id}
                                job={job}
                                onMatch={() => handleMatch(job.id)}
                                onTailor={() => handleTailor(job.id)}
                                isMatching={matchingJobId === job.id}
                                isTailoring={isTailoring}
                                matchResult={matchResults[job.id]}
                                onApplySuccess={initDashboard}
                            />
                        ))
                    )}
                </div>

                {/* Right Sidepanel: Pipeline Stage Activity & Asset History */}
                <div className="space-y-6">
                    {/* Pipeline Stage Breakdown */}
                    <div className="glass-card p-5 space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <LayoutGrid size={16} className="text-indigo-400" /> Pipeline Stage Breakdown
                        </h3>
                        <div className="space-y-2 text-xs">
                            <StageRow label="Interview Scheduled" count={analytics?.status_counts?.interview || 0} color="bg-cyan-400" />
                            <StageRow label="Applied" count={analytics?.status_counts?.applied || 0} color="bg-indigo-500" />
                            <StageRow label="Offer Received" count={analytics?.status_counts?.offer || 0} color="bg-emerald-500" />
                            <StageRow label="Not Applied" count={analytics?.status_counts?.not_applied || 0} color="bg-slate-500" />
                            <StageRow label="Rejected" count={analytics?.status_counts?.rejected || 0} color="bg-red-500" />
                        </div>
                    </div>

                    {/* Recent Tailored Resumes & Cover Letters Quick Preview */}
                    <div className="glass-card p-5 space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <History size={16} className="text-amber-400" /> Recent AI Generated Assets
                        </h3>
                        <div className="space-y-3 text-xs">
                            {analytics?.recent_tailored_resumes?.map(item => (
                                <div key={item.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between items-center">
                                    <div>
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                            <span className="badge badge-indigo text-[10px]">CV v{item.version}</span>
                                            <span className="text-slate-400 font-bold">{item.job_title}</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px]">{item.company}</p>
                                    </div>
                                    <a href="/resume-hub" className="text-indigo-400 hover:underline">View</a>
                                </div>
                            ))}

                            {analytics?.recent_cover_letters?.map(letter => (
                                <div key={letter.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between items-center">
                                    <div>
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                            <span className="badge border border-indigo-500/30 text-indigo-400 bg-indigo-500/10 text-[10px]">{letter.tone} v{letter.version}</span>
                                            <span className="text-slate-400 font-bold">{letter.job_title}</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px]">{letter.company}</p>
                                    </div>
                                    <a href="/resume-hub" className="text-indigo-400 hover:underline">View</a>
                                </div>
                            ))}

                            {(!analytics?.recent_tailored_resumes?.length && !analytics?.recent_cover_letters?.length) && (
                                <p className="text-slate-500 text-center py-4">No tailored assets created yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

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

function StageRow({ label, count, color }) {
    return (
        <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900/40">
            <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${color}`}></span>
                <span className="text-slate-300 font-medium">{label}</span>
            </div>
            <span className="font-bold text-white font-mono">{count}</span>
        </div>
    );
}

function JobCard({ job, onMatch, onTailor, isMatching, isTailoring, matchResult, onApplySuccess }) {
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);

    const handleApply = async () => {
        setApplying(true);
        try {
            await trackerService.addApplication({
                job_id: job.id,
                status: 'Applied',
                match_score: matchResult?.match_percentage || 0
            });
            setApplied(true);
            if (onApplySuccess) onApplySuccess();
        } catch (error) {
            console.error("Apply failed:", error);
        }
        setApplying(false);
    };

    return (
        <div className="glass-card p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>

            {matchResult && (
                <div className={`absolute top-0 right-0 px-4 py-1 border-b border-l rounded-bl-xl font-bold text-sm ${matchResult.match_percentage > 70 ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-indigo-600/20 border-indigo-500/30 text-indigo-400'}`}>
                    {matchResult.match_percentage}% Match
                </div>
            )}

            <div className="flex-1 space-y-3">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-white transition-colors group-hover:text-indigo-400">{job.title}</h3>
                        <div className="flex items-center gap-2 text-slate-400 font-medium text-sm">
                            <Briefcase size={14} className="text-indigo-400" /> {job.company}
                        </div>
                    </div>
                    <span className="badge badge-indigo">{job.remote_status}</span>
                </div>

                <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">{job.description}</p>

                <div className="flex flex-wrap gap-2 pt-2">
                    {(job.skills_required || "").split(',').filter(s => s.trim()).map(skill => (
                        <span key={skill} className="badge badge-cyan">{skill.trim()}</span>
                    ))}
                </div>

                {matchResult && matchResult.missing_skills.length > 0 && (
                    <div className="mt-4 space-y-3 animate-fade-in">
                        <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                            <p className="text-xs font-semibold text-red-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                <AlertTriangle size={12} /> Missing Skills
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {matchResult.missing_skills.slice(0, 5).map(skill => (
                                    <span key={skill} className="text-xs text-slate-400 bg-slate-800/50 px-2 py-0.5 rounded">{skill}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col justify-center gap-3 min-w-[140px]">
                <button
                    onClick={onMatch}
                    disabled={isMatching}
                    className={`btn-primary w-full py-2.5 text-xs font-bold ${isMatching ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isMatching ? 'Analyzing...' : matchResult ? 'Re-Analyze' : 'Analyze Match'}
                </button>

                {matchResult && matchResult.missing_skills.length > 0 && (
                    <button
                        onClick={onTailor}
                        disabled={isTailoring}
                        className="w-full px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400 text-xs font-bold hover:bg-indigo-500/20 transition-all flex items-center justify-center gap-2"
                    >
                        <Scissors size={14} /> {isTailoring ? 'Tailoring...' : 'Tailor CV'}
                    </button>
                )}

                <button
                    onClick={handleApply}
                    disabled={applying || applied}
                    className={`px-4 py-2 rounded-xl border ${applied ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : 'border-slate-700 hover:border-slate-500 text-slate-300'} text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-inner`}
                >
                    {applying ? 'Applying...' : applied ? (<><CheckCircle2 size={14} /> Tracked</>) : 'Quick Track'}
                </button>
            </div>
        </div>
    );
}

export default Dashboard;
