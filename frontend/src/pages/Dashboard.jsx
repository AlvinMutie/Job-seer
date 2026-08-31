import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Sparkles, Upload, AlertTriangle, ChevronRight, TrendingUp, Target, BarChart3, Scissors, ShieldCheck, Mail, History, ArrowRight, LayoutGrid, FileText, CheckCircle2 } from 'lucide-react';
import { jobService, authService, trackerService, dashboardService } from '../services/api';
import TailorModal from '../components/TailorModal';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';

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
            {/* Page Header */}
            <PageHeader
                badgeText={`Targeting: ${user?.profile?.preferred_role || 'General Engineering'}`}
                title={`Welcome back, ${user?.full_name?.split(' ')[0] || 'Candidate'} 👋`}
                subtitle="Real-time intelligence dashboard across your matching scores, application pipeline, and AI assets."
                action={
                    !user?.profile?.has_resume ? (
                        <a href="/resume-hub">
                            <Button variant="outline" size="sm" icon={AlertTriangle} className="text-amber-400 border-amber-500/30 hover:bg-amber-500/10">
                                Upload CV for AI Match Scoring
                            </Button>
                        </a>
                    ) : (
                        <a href="/resume-hub">
                            <Button variant="outline" size="sm" icon={ShieldCheck} className="text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10">
                                ATS Health: {analytics?.ats_health_score ? `${analytics.ats_health_score}% (${analytics.ats_classification})` : 'Active'}
                            </Button>
                        </a>
                    )
                }
            />

            {/* KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card variant="glass" className="p-5 space-y-3 border-indigo-500/20 bg-indigo-500/5">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 bg-indigo-500/20 rounded-xl text-indigo-400">
                            <Target size={20} />
                        </div>
                        <Badge variant="indigo">V2 Score</Badge>
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Average Match</p>
                        <p className="text-2xl font-extrabold text-white mt-1">{analytics?.average_match_score || 0}%</p>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full rounded-full transition-all duration-700" style={{ width: `${analytics?.average_match_score || 0}%` }}></div>
                    </div>
                </Card>

                <Card variant="glass" className="p-5 space-y-3 border-emerald-500/20 bg-emerald-500/5">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 bg-emerald-500/20 rounded-xl text-emerald-400">
                            <TrendingUp size={20} />
                        </div>
                        <Badge variant="emerald">Pipeline</Badge>
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Total Applications</p>
                        <p className="text-2xl font-extrabold text-white mt-1">{analytics?.total_applications || 0}</p>
                    </div>
                    <p className="text-[11px] text-slate-400">
                        {analytics?.status_counts?.interview || 0} Interviews · {analytics?.status_counts?.applied || 0} Applied
                    </p>
                </Card>

                <Card variant="glass" className="p-5 space-y-3 border-cyan-500/20 bg-cyan-500/5">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 bg-cyan-500/20 rounded-xl text-cyan-400">
                            <ShieldCheck size={20} />
                        </div>
                        <Badge variant="cyan">ATS Scan</Badge>
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">ATS Health Score</p>
                        <p className="text-2xl font-extrabold text-white mt-1">
                            {analytics?.ats_health_score !== null ? `${analytics?.ats_health_score}%` : 'N/A'}
                        </p>
                    </div>
                    <p className="text-[11px] text-slate-400">{analytics?.ats_classification || 'Upload resume to check'}</p>
                </Card>

                <Card variant="glass" className="p-5 space-y-3 border-amber-500/20 bg-amber-500/5">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 bg-amber-500/20 rounded-xl text-amber-400">
                            <History size={20} />
                        </div>
                        <Badge variant="amber">Assets Saved</Badge>
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Tailored & Letters</p>
                        <p className="text-2xl font-extrabold text-white mt-1">
                            {(analytics?.tailored_resumes_count || 0) + (analytics?.cover_letters_count || 0)}
                        </p>
                    </div>
                    <p className="text-[11px] text-slate-400">
                        {analytics?.tailored_resumes_count || 0} Tailored CVs · {analytics?.cover_letters_count || 0} Letters
                    </p>
                </Card>
            </div>

            {/* Action Launchpad Bar */}
            <Card variant="glass" className="p-4 flex flex-wrap items-center justify-between gap-3 bg-slate-900/60">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles size={16} className="text-indigo-400" /> Action Launchpad
                </span>
                <div className="flex flex-wrap items-center gap-2">
                    <a href="/resume-hub">
                        <Button variant="ghost" size="sm" icon={Upload}>Resume Hub</Button>
                    </a>
                    <a href="/resume-hub">
                        <Button variant="ghost" size="sm" icon={Scissors}>Tailor CV</Button>
                    </a>
                    <a href="/resume-hub">
                        <Button variant="ghost" size="sm" icon={Mail}>Cover Letters</Button>
                    </a>
                    <a href="/tracker">
                        <Button variant="ghost" size="sm" icon={LayoutGrid}>Kanban Tracker</Button>
                    </a>
                    <a href="/jobs">
                        <Button variant="ghost" size="sm" icon={Briefcase}>Jobs Hub</Button>
                    </a>
                </div>
            </Card>

            {/* Search Bar */}
            <Card variant="flat" className="p-3 bg-slate-900/80">
                <form onSubmit={(e) => { e.preventDefault(); fetchJobs(); }} className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1">
                        <Input
                            placeholder="Search keywords (React, Python, FastAPI, Docker...)"
                            icon={Search}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex-1">
                        <Input
                            placeholder="Location preference (e.g. Remote, NYC)"
                            icon={MapPin}
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                    <Button type="submit" variant="primary" size="md">
                        Find Jobs
                    </Button>
                </form>
            </Card>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Job Discovery & Recommendations Column */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        Top AI Recommendations <Sparkles className="text-amber-400" size={18} />
                    </h2>

                    {loading ? (
                        <LoadingSkeleton variant="card" count={3} />
                    ) : jobs.length === 0 ? (
                        <EmptyState
                            icon={Search}
                            title="No jobs matched your parameters"
                            description="Try clearing keyword or location filters to explore more tech opportunities."
                            action={<Button variant="secondary" onClick={() => { setSearch(''); setLocation(''); fetchJobs(); }}>Reset Filters</Button>}
                        />
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

                {/* Right Column: Pipeline Stage Activity & Assets */}
                <div className="space-y-6">
                    {/* Pipeline Stage Breakdown */}
                    <Card variant="glass" className="p-5 space-y-4">
                        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                            <LayoutGrid size={16} className="text-indigo-400" /> Pipeline Stage Breakdown
                        </h3>
                        <div className="space-y-2 text-xs">
                            <StageRow label="Interview Scheduled" count={analytics?.status_counts?.interview || 0} color="bg-cyan-400" />
                            <StageRow label="Applied" count={analytics?.status_counts?.applied || 0} color="bg-indigo-500" />
                            <StageRow label="Offer Received" count={analytics?.status_counts?.offer || 0} color="bg-emerald-500" />
                            <StageRow label="Not Applied" count={analytics?.status_counts?.not_applied || 0} color="bg-slate-500" />
                            <StageRow label="Rejected" count={analytics?.status_counts?.rejected || 0} color="bg-rose-500" />
                        </div>
                    </Card>

                    {/* Recent AI Generated Assets */}
                    <Card variant="glass" className="p-5 space-y-4">
                        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                            <History size={16} className="text-amber-400" /> Recent AI Generated Assets
                        </h3>
                        <div className="space-y-3 text-xs">
                            {analytics?.recent_tailored_resumes?.map(item => (
                                <div key={item.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between items-center">
                                    <div>
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                            <Badge variant="indigo" size="sm">CV v{item.version}</Badge>
                                            <span className="text-slate-300 font-bold">{item.job_title}</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px]">{item.company}</p>
                                    </div>
                                    <a href="/resume-hub" className="text-indigo-400 hover:underline font-semibold">View</a>
                                </div>
                            ))}

                            {analytics?.recent_cover_letters?.map(letter => (
                                <div key={letter.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between items-center">
                                    <div>
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                            <Badge variant="cyan" size="sm">{letter.tone} v{letter.version}</Badge>
                                            <span className="text-slate-300 font-bold">{letter.job_title}</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px]">{letter.company}</p>
                                    </div>
                                    <a href="/resume-hub" className="text-indigo-400 hover:underline font-semibold">View</a>
                                </div>
                            ))}

                            {(!analytics?.recent_tailored_resumes?.length && !analytics?.recent_cover_letters?.length) && (
                                <p className="text-slate-500 text-center py-4">No tailored assets created yet.</p>
                            )}
                        </div>
                    </Card>
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
        <Card variant="interactive" className="p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden group">
            {matchResult && (
                <div className={`absolute top-0 right-0 px-3.5 py-1 border-b border-l rounded-bl-xl font-bold text-xs ${matchResult.match_percentage > 70 ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-indigo-600/20 border-indigo-500/30 text-indigo-400'}`}>
                    {matchResult.match_percentage}% Match
                </div>
            )}

            <div className="flex-1 space-y-3">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-white transition-colors group-hover:text-indigo-400">{job.title}</h3>
                        <div className="flex items-center gap-2 text-slate-400 font-medium text-sm mt-0.5">
                            <Briefcase size={14} className="text-indigo-400" /> {job.company}
                        </div>
                    </div>
                    <Badge variant="indigo">{job.remote_status}</Badge>
                </div>

                <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">{job.description}</p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                    {(job.skills_required || "").split(',').filter(s => s.trim()).map(skill => (
                        <Badge key={skill} variant="slate" size="sm">{skill.trim()}</Badge>
                    ))}
                </div>

                {matchResult && matchResult.missing_skills.length > 0 && (
                    <div className="mt-3 space-y-2 animate-fade-in">
                        <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl">
                            <p className="text-[11px] font-bold text-rose-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <AlertTriangle size={12} /> Missing Skills
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {matchResult.missing_skills.slice(0, 5).map(skill => (
                                    <span key={skill} className="text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{skill}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col justify-center gap-2.5 min-w-[140px]">
                <Button
                    variant="primary"
                    size="sm"
                    onClick={onMatch}
                    isLoading={isMatching}
                >
                    {matchResult ? 'Re-Analyze' : 'Analyze Match'}
                </Button>

                {matchResult && matchResult.missing_skills.length > 0 && (
                    <Button
                        variant="outline"
                        size="sm"
                        icon={Scissors}
                        onClick={onTailor}
                        isLoading={isTailoring}
                    >
                        Tailor CV
                    </Button>
                )}

                <Button
                    variant={applied ? 'success' : 'secondary'}
                    size="sm"
                    icon={applied ? CheckCircle2 : null}
                    onClick={handleApply}
                    isLoading={applying}
                    disabled={applied}
                >
                    {applied ? 'Tracked' : 'Quick Track'}
                </Button>
            </div>
        </Card>
    );
}

export default Dashboard;
