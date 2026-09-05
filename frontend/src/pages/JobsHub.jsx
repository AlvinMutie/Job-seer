import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Loader2, Sparkles, AlertCircle, Target, CheckCircle, Scissors, Globe, RefreshCw, Check, ExternalLink } from 'lucide-react';
import { jobService, trackerService, authService, getApiErrorMessage } from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';

function JobsHub() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);

    // Filters and Pagination state
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

    // Live Adzuna External Sync state
    const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
    const [syncKeywords, setSyncKeywords] = useState('');
    const [syncLocation, setSyncLocation] = useState('');
    const [syncCountry, setSyncCountry] = useState('us');
    const [syncMaxResults, setSyncMaxResults] = useState(15);
    const [syncing, setSyncing] = useState(false);
    const [syncResult, setSyncResult] = useState(null);
    const [syncError, setSyncError] = useState('');

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

    const handleSyncSubmit = async (e) => {
        e.preventDefault();
        setSyncing(true);
        setSyncError('');
        setSyncResult(null);
        try {
            const res = await jobService.syncExternalJobs({
                keywords: syncKeywords.trim() || undefined,
                location: syncLocation.trim() || undefined,
                country: syncCountry,
                max_results: syncMaxResults
            });
            setSyncResult(res);
            setPage(1);
            await fetchJobs();
        } catch (err) {
            console.error("External job board sync failed:", err);
            setSyncError(getApiErrorMessage(err));
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <PageHeader
                badgeText="JOB DISCOVERY WORKSPACE"
                title="Find Your Next Opportunity"
                subtitle="Explore verified tech roles, filter by work mode and experience level, and calculate your real-time resume fit."
                action={
                    <Button
                        variant="primary"
                        icon={Globe}
                        onClick={() => {
                            setSyncError('');
                            setSyncResult(null);
                            if (user?.profile) {
                                setSyncKeywords(user.profile.preferred_role || user.profile.skills?.split(',')[0]?.trim() || 'Software Engineer');
                                setSyncLocation(user.profile.location_preference || '');
                            }
                            setIsSyncModalOpen(true);
                        }}
                        className="font-bold shrink-0 shadow-md shadow-indigo-600/20"
                    >
                        Sync Live Jobs
                    </Button>
                }
            />

            {/* Error Notification */}
            {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 text-sm">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {/* Search and Filters Bar */}
            <Card variant="glass" className="p-5 space-y-4">
                <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1">
                        <Input
                            icon={Search}
                            placeholder="Search by keywords, skills, job title, or company..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-64">
                        <Input
                            icon={MapPin}
                            placeholder="Location (e.g. Remote, NYC)"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                    <Button type="submit" variant="primary" isLoading={loading}>
                        Search Jobs
                    </Button>
                </form>

                {/* Filter Controls Row */}
                <div className="flex flex-wrap gap-4 items-center justify-between border-t border-slate-200 pt-4 text-xs">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="w-44">
                            <Select
                                icon={Filter}
                                value={remoteStatus}
                                onChange={(e) => { setRemoteStatus(e.target.value); setPage(1); }}
                                options={[
                                    { value: '', label: 'All Modes' },
                                    { value: 'Remote', label: 'Remote' },
                                    { value: 'Hybrid', label: 'Hybrid' },
                                    { value: 'On-site', label: 'On-site' }
                                ]}
                            />
                        </div>

                        <div className="w-48">
                            <Select
                                value={experienceLevel}
                                onChange={(e) => { setExperienceLevel(e.target.value); setPage(1); }}
                                options={[
                                    { value: '', label: 'All Levels' },
                                    { value: 'Junior', label: 'Junior' },
                                    { value: 'Mid-Level', label: 'Mid-Level' },
                                    { value: 'Senior', label: 'Senior' },
                                    { value: 'Lead / Architect', label: 'Lead / Architect' }
                                ]}
                            />
                        </div>
                    </div>

                    <div className="w-48">
                        <Select
                            icon={ArrowUpDown}
                            value={`${sortBy}:${order}`}
                            onChange={(e) => handleSortChange(e.target.value)}
                            options={[
                                { value: 'posted_at:desc', label: 'Newest First' },
                                { value: 'posted_at:asc', label: 'Oldest First' },
                                { value: 'title:asc', label: 'Job Title A–Z' },
                                { value: 'title:desc', label: 'Job Title Z–A' },
                                { value: 'company:asc', label: 'Company A–Z' },
                                { value: 'company:desc', label: 'Company Z–A' }
                            ]}
                        />
                    </div>
                </div>
            </Card>

            {/* Job Listings Grid */}
            <div className="space-y-4">
                {loading ? (
                    <LoadingSkeleton variant="card" count={3} />
                ) : jobs.length === 0 ? (
                    <EmptyState
                        icon={Briefcase}
                        title="No opportunities found"
                        description="Query the Adzuna global job exchange to sync live opportunities tailored to your target role and resume."
                        action={
                            <div className="flex gap-2.5">
                                <Button variant="primary" icon={Globe} onClick={() => setIsSyncModalOpen(true)}>
                                    Sync Live Jobs
                                </Button>
                                <Button variant="secondary" onClick={() => { setSearch(''); setLocation(''); setRemoteStatus(''); setExperienceLevel(''); fetchJobs(); }}>
                                    Reset Filters
                                </Button>
                            </div>
                        }
                    />
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
                <Card variant="flat" className="p-4 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Page {page}</span>
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
                            disabled={jobs.length < limit || loading}
                            onClick={() => setPage(p => p + 1)}
                        >
                            Next <ChevronRight size={14} />
                        </Button>
                    </div>
                </Card>
            )}

            {/* Sync Live Jobs Modal */}
            <Modal
                isOpen={isSyncModalOpen}
                onClose={() => {
                    if (!syncing) {
                        setIsSyncModalOpen(false);
                    }
                }}
                title="Sync Live Opportunities"
                subtitle="Connect directly to the Adzuna global job exchange to ingest real-time openings tailored to your target role and skills."
                maxWidth="max-w-xl"
            >
                <form onSubmit={handleSyncSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                            Target Role / Keywords
                        </label>
                        <Input
                            value={syncKeywords}
                            onChange={(e) => setSyncKeywords(e.target.value)}
                            placeholder="e.g. Full Stack Developer, Python, React"
                            required
                        />
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                            Defaults to your CV profile's extracted target role or core skills.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                                Location
                            </label>
                            <Input
                                value={syncLocation}
                                onChange={(e) => setSyncLocation(e.target.value)}
                                placeholder="e.g. Remote, San Francisco, London"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                                Country Market
                            </label>
                            <Select
                                value={syncCountry}
                                onChange={(e) => setSyncCountry(e.target.value)}
                                options={[
                                    { value: 'us', label: 'United States (US)' },
                                    { value: 'gb', label: 'United Kingdom (UK)' },
                                    { value: 'ca', label: 'Canada (CA)' },
                                    { value: 'de', label: 'Germany (DE)' },
                                    { value: 'au', label: 'Australia (AU)' },
                                    { value: 'in', label: 'India (IN)' }
                                ]}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                            Max Ingestion Batch
                        </label>
                        <Select
                            value={syncMaxResults}
                            onChange={(e) => setSyncMaxResults(Number(e.target.value))}
                            options={[
                                { value: 10, label: '10 Job Postings' },
                                { value: 15, label: '15 Job Postings (Recommended)' },
                                { value: 25, label: '25 Job Postings' },
                                { value: 50, label: '50 Job Postings' }
                            ]}
                        />
                    </div>

                    {syncError && (
                        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-500 dark:text-rose-400 text-xs font-medium">
                            <AlertCircle size={16} className="shrink-0" />
                            <span>{syncError}</span>
                        </div>
                    )}

                    {syncResult && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                            <Check size={16} className="shrink-0" />
                            <span>
                                Successfully ingested <strong>{syncResult.ingested}</strong> new jobs ({syncResult.total_fetched} scanned from Adzuna).
                            </span>
                        </div>
                    )}

                    <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsSyncModalOpen(false)}
                            disabled={syncing}
                        >
                            Close
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={syncing}
                            icon={RefreshCw}
                        >
                            {syncing ? 'Fetching from Adzuna...' : 'Sync Now'}
                        </Button>
                    </div>
                </form>
            </Modal>
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
        <Card variant="flat" className="p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden group hover:border-slate-300 dark:hover:border-slate-700 transition-all">
            {matchResult && (
                <div className={`absolute top-0 right-0 px-4 py-1 border-b border-l rounded-bl-xl font-bold text-xs ${
                    matchResult.match_percentage > 70 
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400' 
                        : 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400'
                }`}>
                    {matchResult.match_percentage}% Match
                </div>
            )}

            <div className="flex-1 space-y-3">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{job.title}</h3>
                        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
                            <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-indigo-600 dark:text-indigo-400" /> {job.company}</span>
                            <span className="text-slate-300 dark:text-slate-600">•</span>
                            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-400 dark:text-slate-500" /> {job.location}</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Badge variant="indigo">{job.remote_status}</Badge>
                        <Badge variant="cyan">{job.experience_level}</Badge>
                    </div>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2 leading-relaxed">{job.description}</p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                    {(job.skills_required || "").split(',').filter(s => s.trim()).map(skill => (
                        <Badge key={skill} variant="slate" size="sm">{skill.trim()}</Badge>
                    ))}
                </div>
            </div>

            <div className="flex flex-col justify-center gap-2.5 min-w-[155px]">
                {job.application_url && (
                    <a href={job.application_url} target="_blank" rel="noopener noreferrer">
                        <Button
                            variant="primary"
                            size="sm"
                            icon={ExternalLink}
                            className="w-full font-bold shadow-xs"
                        >
                            Apply on Site
                        </Button>
                    </a>
                )}

                <Button
                    variant={job.application_url ? "secondary" : "primary"}
                    size="sm"
                    onClick={onMatch}
                    isLoading={isMatching}
                    disabled={!hasResume}
                >
                    {matchResult ? 'Re-Analyze' : 'Analyze Match'}
                </Button>

                <a href={`/resume-hub?jobId=${job.id}`}>
                    <Button
                        variant="outline"
                        size="sm"
                        icon={Scissors}
                        className="w-full"
                    >
                        Tailor CV
                    </Button>
                </a>

                <Button
                    variant={applied ? 'success' : 'ghost'}
                    size="sm"
                    icon={applied ? CheckCircle : null}
                    onClick={handleApply}
                    isLoading={applying}
                    disabled={applied}
                >
                    {applied ? 'Applied' : 'Quick Track'}
                </Button>
            </div>
        </Card>
    );
}

export default JobsHub;
