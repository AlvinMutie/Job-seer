import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Loader2, Sparkles, AlertCircle, Target, CheckCircle } from 'lucide-react';
import { jobService, trackerService, authService, getApiErrorMessage } from '../services/api';

function JobsHub() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);

    // Filters and Pagination state (P3-01)
    const [search, setSearch] = useState('');
    const [location, setLocation] = useState('');
    const [remoteStatus, setRemoteStatus] = useState('');
    const [experienceLevel, setExperienceLevel] = useState('');
    const [sortBy, setSortBy] = useState('posted_at');
    const [order, setOrder] = useState('desc');
    const [page, setPage] = useState(1);
    const limit = 10;

    // Matching state
    const [matchingJobId, setMatchingJobId] = useState(null);
    const [matchResults, setMatchResults] = useState({});

    const fetchJobs = async () => {
        setLoading(true);
        setError('');
        try {
            const params = {
                limit,
                offset: (page - 1) * limit,
                sort_by: sortBy,
                order: order
            };
            if (search.trim()) params.search = search.trim();
            if (location.trim()) params.location = location.trim();
            if (remoteStatus) params.remote_status = remoteStatus;
            if (experienceLevel) params.experience_level = experienceLevel;

            const [jobsData, userData] = await Promise.all([
                jobService.getJobs(params),
                authService.getMe().catch(() => null)
            ]);

            setJobs(jobsData);
            if (userData) setUser(userData);
        } catch (err) {
            console.error("Failed to fetch jobs:", err);
            setError(getApiErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [page, sortBy, order, remoteStatus, experienceLevel]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        fetchJobs();
    };

    const handleSortChange = (value) => {
        // Value formats: "posted_at:desc", "posted_at:asc", "title:asc", "title:desc", "company:asc", "company:desc"
        const [field, dir] = value.split(':');
        setSortBy(field);
        setOrder(dir);
        setPage(1);
    };

    const handleMatch = async (jobId) => {
        const resumeText = user?.profile?.resume_text;
        if (!resumeText) {
            alert("Please upload your resume in the Resume Hub before analyzing matches!");
            return;
        }

        setMatchingJobId(jobId);
        try {
            const formData = new FormData();
            formData.append('resume_text', resumeText);
            formData.append('job_id', jobId);
            const result = await jobService.matchResume(formData);
            setMatchResults(prev => ({ ...prev, [jobId]: result }));
        } catch (err) {
            console.error("Match calculation failed:", err);
        } finally {
            setMatchingJobId(null);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Briefcase className="text-indigo-400" size={32} /> Job Discovery Hub
                </h1>
                <p className="text-slate-400">Explore open tech roles, filter by work mode, and calculate your real-time AI resume fit.</p>
            </div>

            {/* Error Notification */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {/* Search and Filters Bar */}
            <div className="glass-card p-4 space-y-4">
                <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            className="input-field pl-10 py-2.5 text-sm w-full"
                            placeholder="Search by keywords, skills, job title, or company..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="w-full md:w-56 relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            className="input-field pl-10 py-2.5 text-sm w-full"
                            placeholder="Location (e.g. Remote, NYC)"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary py-2.5 px-6 font-semibold flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="animate-spin" size={18} /> : 'Search Jobs'}
                    </button>
                </form>

                {/* Filter Controls Row */}
                <div className="flex flex-wrap gap-4 items-center justify-between border-t border-slate-800/80 pt-4 text-xs">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-2">
                            <Filter size={14} className="text-slate-500" />
                            <span className="text-slate-400 font-medium">Work Mode:</span>
                            <select
                                className="input-field py-1.5 px-3 text-xs bg-slate-900 border-slate-700 text-slate-200"
                                value={remoteStatus}
                                onChange={(e) => { setRemoteStatus(e.target.value); setPage(1); }}
                            >
                                <option value="">All Modes</option>
                                <option value="Remote">Remote</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="On-site">On-site</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-medium">Experience:</span>
                            <select
                                className="input-field py-1.5 px-3 text-xs bg-slate-900 border-slate-700 text-slate-200"
                                value={experienceLevel}
                                onChange={(e) => { setExperienceLevel(e.target.value); setPage(1); }}
                            >
                                <option value="">All Levels</option>
                                <option value="Junior">Junior</option>
                                <option value="Mid-Level">Mid-Level</option>
                                <option value="Senior">Senior</option>
                                <option value="Lead / Architect">Lead / Architect</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <ArrowUpDown size={14} className="text-slate-500" />
                        <span className="text-slate-400 font-medium">Sort By:</span>
                        <select
                            className="input-field py-1.5 px-3 text-xs bg-slate-900 border-slate-700 text-slate-200"
                            value={`${sortBy}:${order}`}
                            onChange={(e) => handleSortChange(e.target.value)}
                        >
                            <option value="posted_at:desc">Newest First</option>
                            <option value="posted_at:asc">Oldest First</option>
                            <option value="title:asc">Job Title A–Z</option>
                            <option value="title:desc">Job Title Z–A</option>
                            <option value="company:asc">Company A–Z</option>
                            <option value="company:desc">Company Z–A</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Job Listings Grid */}
            <div className="space-y-4">
                {loading ? (
                    <div className="glass-card p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
                        <Loader2 className="animate-spin text-indigo-500" size={32} />
                        <span>Searching the job repository...</span>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="glass-card p-12 text-center text-slate-500 space-y-2">
                        <Briefcase className="mx-auto text-slate-600" size={40} />
                        <h3 className="text-lg font-bold text-slate-300">No jobs found</h3>
                        <p className="text-sm text-slate-500">Try adjusting your keyword search, location, or experience filters.</p>
                    </div>
                ) : (
                    jobs.map(job => (
                        <JobCardHub
                            key={job.id}
                            job={job}
                            onMatch={() => handleMatch(job.id)}
                            isMatching={matchingJobId === job.id}
                            matchResult={matchResults[job.id]}
                            hasResume={Boolean(user?.profile?.resume_text)}
                        />
                    ))
                )}
            </div>

            {/* Pagination Controls */}
            {!loading && jobs.length > 0 && (
                <div className="glass-card p-4 flex justify-between items-center bg-slate-900/30">
                    <span className="text-xs text-slate-500">Page {page}</span>
                    <div className="flex gap-2">
                        <button
                            disabled={page <= 1 || loading}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="px-3.5 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                            <ChevronLeft size={14} /> Previous
                        </button>
                        <button
                            disabled={jobs.length < limit || loading}
                            onClick={() => setPage(p => p + 1)}
                            className="px-3.5 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                            Next <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function JobCardHub({ job, onMatch, isMatching, matchResult, hasResume }) {
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
        } catch (err) {
            console.error("Failed to track application:", err);
        } finally {
            setApplying(false);
        }
    };

    return (
        <div className="glass-card p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>

            {matchResult && (
                <div className={`absolute top-0 right-0 px-4 py-1 border-b border-l rounded-bl-xl font-bold text-xs ${
                    matchResult.match_percentage > 70 ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-indigo-600/20 border-indigo-500/30 text-indigo-400'
                }`}>
                    {matchResult.match_percentage}% Match
                </div>
            )}

            <div className="flex-1 space-y-3">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-white transition-colors group-hover:text-indigo-400">{job.title}</h3>
                        <div className="flex items-center gap-3 text-slate-400 text-sm font-medium mt-1">
                            <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-indigo-400" /> {job.company}</span>
                            <span className="text-slate-600">•</span>
                            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-500" /> {job.location}</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <span className="badge badge-indigo">{job.remote_status}</span>
                        <span className="badge badge-cyan">{job.experience_level}</span>
                    </div>
                </div>

                <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">{job.description}</p>

                <div className="flex flex-wrap gap-2 pt-1">
                    {(job.skills_required || "").split(',').filter(s => s.trim()).map(skill => (
                        <span key={skill} className="px-2.5 py-1 bg-slate-800/80 text-slate-300 text-xs rounded-lg border border-slate-700/50">{skill.trim()}</span>
                    ))}
                </div>
            </div>

            <div className="flex flex-col justify-center gap-3 min-w-[150px]">
                <button
                    onClick={onMatch}
                    disabled={isMatching || !hasResume}
                    className={`btn-primary w-full py-2.5 text-xs font-bold ${isMatching ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title={!hasResume ? "Upload a resume first to enable AI matching" : ""}
                >
                    {isMatching ? <><Loader2 className="animate-spin" size={14} /> Analyzing...</> : matchResult ? 'Re-Analyze' : 'Analyze Match'}
                </button>

                <button
                    onClick={handleApply}
                    disabled={applying || applied}
                    className={`px-4 py-2.5 rounded-xl border ${applied ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : 'border-slate-700 hover:border-slate-500 text-slate-300'} text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-inner`}
                >
                    {applying ? 'Applying...' : applied ? (<><CheckCircle size={14} /> Applied</>) : 'Quick Apply'}
                </button>
            </div>
        </div>
    );
}

export default JobsHub;
