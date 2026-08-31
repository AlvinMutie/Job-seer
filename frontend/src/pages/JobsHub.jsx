import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Loader2, Sparkles, AlertCircle, Target, CheckCircle, Scissors } from 'lucide-react';
import { jobService, trackerService, authService, getApiErrorMessage } from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
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

    return (
        <div className="space-y-6 animate-fade-in">
            <PageHeader
                badgeText="JOB DISCOVERY WORKSPACE"
                title="Find Your Next Opportunity"
                subtitle="Explore verified tech roles, filter by work mode and experience level, and calculate your real-time AI resume fit."
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
                <div className="flex flex-wrap gap-4 items-center justify-between border-t border-slate-800/80 pt-4 text-xs">
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
                        description="Try adjusting your keyword search, location, or experience filters to find matching open roles."
                        action={<Button variant="secondary" onClick={() => { setSearch(''); setLocation(''); setRemoteStatus(''); setExperienceLevel(''); fetchJobs(); }}>Reset All Filters</Button>}
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
                <Card variant="flat" className="p-4 flex justify-between items-center bg-slate-900/40">
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
                            disabled={jobs.length < limit || loading}
                            onClick={() => setPage(p => p + 1)}
                        >
                            Next <ChevronRight size={14} />
                        </Button>
                    </div>
                </Card>
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
        <Card variant="interactive" className="p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden group">
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
                        <Badge variant="indigo">{job.remote_status}</Badge>
                        <Badge variant="cyan">{job.experience_level}</Badge>
                    </div>
                </div>

                <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">{job.description}</p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                    {(job.skills_required || "").split(',').filter(s => s.trim()).map(skill => (
                        <Badge key={skill} variant="slate" size="sm">{skill.trim()}</Badge>
                    ))}
                </div>
            </div>

            <div className="flex flex-col justify-center gap-2.5 min-w-[150px]">
                <Button
                    variant="primary"
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
                    variant={applied ? 'success' : 'secondary'}
                    size="sm"
                    icon={applied ? CheckCircle : null}
                    onClick={handleApply}
                    isLoading={applying}
                    disabled={applied}
                >
                    {applied ? 'Applied' : 'Quick Apply'}
                </Button>
            </div>
        </Card>
    );
}

export default JobsHub;
