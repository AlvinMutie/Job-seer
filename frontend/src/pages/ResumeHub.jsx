import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Check, AlertCircle, Loader2, Sparkles, Activity, ShieldCheck, CheckCircle2, AlertTriangle, Layers, Mail, Cpu, GitCompare, History, Trash2, Plus, ArrowRight, PenTool, Target, ExternalLink, Copy, CheckCircle, Link2, Edit3 } from 'lucide-react';
import { authService, jobService, trackerService, tailoredResumeService, coverLetterService, templateService, getApiErrorMessage } from '../services/api';
import ResumeDiffViewer from '../components/ResumeDiffViewer';
import CoverLetterViewer from '../components/CoverLetterViewer';
import AtsRecommendationBanner from '../components/AtsRecommendationBanner';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';

function ResumeHub() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [healthReport, setHealthReport] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [tailoredResumes, setTailoredResumes] = useState([]);
    const [coverLetters, setCoverLetters] = useState([]);
    const [savedTemplates, setSavedTemplates] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [healthLoading, setHealthLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [tailoring, setTailoring] = useState(false);
    const [generatingLetter, setGeneratingLetter] = useState(false);
    
    const [selectedJobId, setSelectedJobId] = useState('');
    const [selectedTone, setSelectedTone] = useState('Professional');
    const [selectedTailoredId, setSelectedTailoredId] = useState('');
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [activeTab, setActiveTab] = useState('intelligence');

    // Directional action states after tailoring/generating
    const [latestTailoredRecord, setLatestTailoredRecord] = useState(null);
    const [copiedResumeId, setCopiedResumeId] = useState(null);
    const [trackingJobId, setTrackingJobId] = useState(null);
    const [trackedJobs, setTrackedJobs] = useState({});

    // Modal States
    const [compareData, setCompareData] = useState(null);
    const [isDiffModalOpen, setIsDiffModalOpen] = useState(false);
    
    const [activeCoverLetter, setActiveCoverLetter] = useState(null);
    const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);

    const fetchAllData = async () => {
        try {
            const [userData, jobsData, tailoredData, letterData, templatesData] = await Promise.all([
                authService.getMe(),
                jobService.getJobs({ limit: 50 }),
                tailoredResumeService.list().catch(() => []),
                coverLetterService.list().catch(() => []),
                templateService.list().catch(() => [])
            ]);
            setUser(userData);
            setJobs(jobsData);
            setTailoredResumes(tailoredData);
            setCoverLetters(letterData);
            setSavedTemplates(templatesData || []);

            // Read URL query parameter for pre-selected job ID
            const urlParams = new URLSearchParams(window.location.search);
            const queryJobId = urlParams.get('jobId');
            if (queryJobId) {
                setSelectedJobId(queryJobId);
            }

            if (userData.profile?.resume_text) {
                setHealthLoading(true);
                try {
                    const report = await authService.getResumeHealth();
                    setHealthReport(report);
                } catch (hErr) {
                    console.error("Failed to fetch resume health:", hErr);
                } finally {
                    setHealthLoading(false);
                }
            } else {
                setHealthReport(null);
            }
        } catch (error) {
            console.error("Failed to fetch profile data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const refreshTemplates = async () => {
        try {
            const data = await templateService.list();
            setSavedTemplates(data || []);
        } catch (err) {
            console.error('Failed to reload templates:', err);
        }
    };

    const handleOpenStudio = (template = null) => {
        if (template?.id) {
            navigate(`/ats-portal?template_id=${template.id}`);
        } else {
            navigate('/ats-portal');
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setMessage({ type: '', text: '' });
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        setMessage({ type: '', text: '' });
        try {
            const formData = new FormData();
            formData.append('file', file);
            await authService.uploadResume(formData);
            setMessage({ type: 'success', text: 'Resume uploaded and analyzed successfully!' });
            setFile(null);
            await fetchAllData();
        } catch (error) {
            console.error("Upload failed:", error);
            setMessage({ type: 'error', text: getApiErrorMessage(error) });
        } finally {
            setUploading(false);
        }
    };

    const handleTrackApplication = async (job, matchScore = 0) => {
        if (!job) return;
        setTrackingJobId(job.id);
        try {
            await trackerService.addApplication({
                job_id: job.id,
                status: 'Applied',
                match_score: matchScore || 0,
                application_url: job.application_url || undefined
            });
            setTrackedJobs(prev => ({ ...prev, [job.id]: true }));
            setMessage({ type: 'success', text: `Tracked application for ${job.title} at ${job.company} in your Kanban Pipeline!` });
        } catch (err) {
            console.error("Failed to track application:", err);
            setMessage({ type: 'error', text: getApiErrorMessage(err) });
        } finally {
            setTrackingJobId(null);
        }
    };

    const handleCopyResumeText = (text, id) => {
        if (text) {
            navigator.clipboard.writeText(text);
            setCopiedResumeId(id);
            setTimeout(() => setCopiedResumeId(null), 2500);
        }
    };

    const handleGenerateTailored = async (e) => {
        e.preventDefault();
        if (!selectedJobId) return;

        setTailoring(true);
        setMessage({ type: '', text: '' });
        try {
            const record = await tailoredResumeService.generate(selectedJobId);
            setLatestTailoredRecord(record);
            setMessage({ 
                type: 'success', 
                text: `Tailored version v${record.version} for ${record.job_title} generated! You can now copy the text and apply directly on the job portal.` 
            });
            const list = await tailoredResumeService.list();
            setTailoredResumes(list);
            setActiveTab('tailored_history');
        } catch (error) {
            console.error("Tailoring generation failed:", error);
            setMessage({ type: 'error', text: getApiErrorMessage(error) });
        } finally {
            setTailoring(false);
        }
    };

    const handleGenerateCoverLetter = async (e) => {
        e.preventDefault();
        if (!selectedJobId) return;

        setGeneratingLetter(true);
        setMessage({ type: '', text: '' });
        try {
            const record = await coverLetterService.generate(
                selectedJobId, 
                selectedTone, 
                selectedTailoredId ? parseInt(selectedTailoredId) : null
            );
            const matchingJob = jobs.find(j => String(j.id) === String(selectedJobId));
            const letterWithUrl = { ...record, application_url: record.application_url || matchingJob?.application_url };
            setMessage({ 
                type: 'success', 
                text: `${record.tone} Cover Letter v${record.version} created! Click 'Apply on Official Site' to submit your materials.` 
            });
            const list = await coverLetterService.list();
            setCoverLetters(list);
            setActiveCoverLetter(letterWithUrl);
            setIsLetterModalOpen(true);
            setActiveTab('cover_letters');
        } catch (error) {
            console.error("Cover letter generation failed:", error);
            setMessage({ type: 'error', text: getApiErrorMessage(error) });
        } finally {
            setGeneratingLetter(false);
        }
    };

    const handleCompare = async (id) => {
        try {
            const data = await tailoredResumeService.compare(id);
            setCompareData(data);
            setIsDiffModalOpen(true);
        } catch (error) {
            console.error("Failed to fetch comparison diff:", error);
        }
    };

    const handleDeleteTailored = async (id) => {
        if (!window.confirm("Are you sure you want to delete this tailored resume version?")) return;
        try {
            await tailoredResumeService.delete(id);
            setTailoredResumes(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const handleDeleteCoverLetter = async (id) => {
        if (!window.confirm("Are you sure you want to delete this cover letter version?")) return;
        try {
            await coverLetterService.delete(id);
            setCoverLetters(prev => prev.filter(l => l.id !== id));
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    if (loading) {
        return <div className="space-y-6"><LoadingSkeleton variant="card" count={3} /></div>;
    }

    const currentTargetJob = jobs.find(j => String(j.id) === String(selectedJobId));

    return (
        <div className="space-y-8 animate-fade-in">
            <PageHeader
                badgeText="RESUME INTELLIGENCE STUDIO"
                title="Resume Hub & Application Generator"
                subtitle="Upload base CVs, run ATS readiness checks, generate versioned tailored resumes, and format multi-tone cover letters."
                action={
                    <Button
                        variant="primary"
                        icon={Sparkles}
                        onClick={() => navigate('/ats-portal')}
                        className="font-semibold shadow-xs"
                    >
                        ATS Portal
                    </Button>
                }
            />

            {/* ATS Health Recommendation & Compliance Banner */}
            <AtsRecommendationBanner
                healthReport={healthReport}
                onOpenStudio={() => navigate('/ats-portal')}
            />

            {/* Contextual Selected Job Target Banner with Direct Application Link */}
            {currentTargetJob && (
                <Card variant="flat" className="p-5 bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                        <div className="p-3 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-xl text-indigo-600 dark:text-indigo-400 shrink-0 shadow-xs">
                            <Target size={22} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block">Target Job Opportunity</span>
                                <Badge variant="indigo" size="sm">{currentTargetJob.remote_status}</Badge>
                                {currentTargetJob.salary_range && <Badge variant="slate" size="sm">{currentTargetJob.salary_range}</Badge>}
                            </div>
                            <h4 className="text-base font-bold text-slate-900 dark:text-white">
                                {currentTargetJob.title} <span className="text-slate-500 font-normal">at {currentTargetJob.company}</span>
                            </h4>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {currentTargetJob.application_url && (
                            <a
                                href={currentTargetJob.application_url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button variant="primary" size="sm" icon={ExternalLink} className="shadow-xs font-bold">
                                    Apply on Job Board
                                </Button>
                            </a>
                        )}
                        <Button
                            variant={trackedJobs[currentTargetJob.id] ? "success" : "secondary"}
                            size="sm"
                            icon={trackedJobs[currentTargetJob.id] ? CheckCircle : Plus}
                            onClick={() => handleTrackApplication(currentTargetJob)}
                            isLoading={trackingJobId === currentTargetJob.id}
                            disabled={trackedJobs[currentTargetJob.id]}
                        >
                            {trackedJobs[currentTargetJob.id] ? "Tracked in Pipeline" : "Track Application"}
                        </Button>
                    </div>
                </Card>
            )}

            {/* Next Steps: Apply with Generated Material Callout */}
            {latestTailoredRecord && (
                <Card variant="flat" className="p-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/60 rounded-xl text-emerald-700 dark:text-emerald-300 shrink-0">
                            <Sparkles size={22} />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">Application Ready • Next Step</span>
                            <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-100">
                                CV v{latestTailoredRecord.version} tailored for {latestTailoredRecord.job_title} at {latestTailoredRecord.company}
                            </h4>
                            <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                                Copy the tailored text below and submit directly via the job application portal.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            icon={copiedResumeId === latestTailoredRecord.id ? Check : Copy}
                            onClick={() => handleCopyResumeText(latestTailoredRecord.tailored_resume_text, latestTailoredRecord.id)}
                            className="bg-white dark:bg-slate-900 font-semibold"
                        >
                            {copiedResumeId === latestTailoredRecord.id ? "Copied to Clipboard!" : "Copy Tailored CV"}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            icon={Sparkles}
                            onClick={() => navigate(`/ats-portal?tailored_id=${latestTailoredRecord.id}`)}
                            className="bg-white dark:bg-slate-900 font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50"
                        >
                            Format in ATS Portal
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            icon={GitCompare}
                            onClick={() => handleCompare(latestTailoredRecord.id)}
                        >
                            Review Diff
                        </Button>
                        {latestTailoredRecord.application_url && (
                            <a
                                href={latestTailoredRecord.application_url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button variant="primary" size="sm" icon={ExternalLink} className="shadow-xs font-bold">
                                    Fill Out Application
                                </Button>
                            </a>
                        )}
                    </div>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Upload & Quick Tailor Generator */}
                <div className="lg:col-span-5 space-y-6">
                    <Card variant="flat" className="p-6 space-y-6">
                        <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900">
                            <Upload className="text-indigo-600" size={20} /> Upload Base CV
                        </h3>

                        <form onSubmit={handleUpload} className="space-y-4">
                            <div
                                onClick={() => document.getElementById('cv-upload-hub').click()}
                                className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all cursor-pointer group ${file ? 'border-emerald-500/50 bg-emerald-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'}`}
                            >
                                <input
                                    id="cv-upload-hub" type="file" className="hidden"
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx,.txt"
                                />
                                <div className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-xs">
                                    {file ? <Check className="text-emerald-600" size={24} /> : <FileText className="text-indigo-600" size={24} />}
                                </div>
                                <p className="text-sm font-bold text-slate-900 text-center">{file ? file.name : 'Select PDF, DOCX or TXT file'}</p>
                                <p className="text-xs text-slate-500 mt-1 text-center">Max limit 10MB</p>
                            </div>

                            {message.text && (
                                <div className={`p-4 rounded-xl flex items-center gap-3 animate-fade-in ${message.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-rose-50 border border-rose-200 text-rose-700'}`}>
                                    {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                                    <span className="text-xs font-medium">{message.text}</span>
                                </div>
                            )}

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full"
                                isLoading={uploading}
                                disabled={!file}
                            >
                                Upload Base Resume
                            </Button>
                        </form>
                    </Card>

                    {/* Studio Generators */}
                    <Card variant="flat" className="p-6 space-y-4 border-slate-200 bg-slate-50/50">
                        <h3 className="text-base font-bold flex items-center gap-2 text-indigo-700 uppercase tracking-wider">
                            <PenTool size={18} /> Studio Generators
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Target Job Listing</label>
                                <select
                                    className="input-field py-2.5 px-3 text-xs bg-white border-slate-300 text-slate-900 w-full"
                                    value={selectedJobId}
                                    onChange={(e) => setSelectedJobId(e.target.value)}
                                >
                                    <option value="">-- Select Target Job Listing --</option>
                                    {jobs.map(j => (
                                        <option key={j.id} value={j.id}>
                                            {j.title} ({j.company})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Cover Letter Tone Selector */}
                            <div>
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">Cover Letter Tone</label>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    {['Professional', 'Enthusiastic', 'Executive', 'Technical'].map(t => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setSelectedTone(t)}
                                            className={`py-2 px-3 rounded-xl border font-semibold transition-all text-center ${selectedTone === t ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    icon={Sparkles}
                                    onClick={handleGenerateTailored}
                                    isLoading={tailoring}
                                    disabled={!selectedJobId || !user?.profile?.resume_text}
                                >
                                    Tailor CV
                                </Button>

                                <Button
                                    variant="success"
                                    size="sm"
                                    icon={Mail}
                                    onClick={handleGenerateCoverLetter}
                                    isLoading={generatingLetter}
                                    disabled={!selectedJobId || !user?.profile?.resume_text}
                                >
                                    Cover Letter
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Workspace Tabs */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="flex border-b border-slate-200 gap-4 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('intelligence')}
                            className={`pb-3 font-semibold text-sm transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${activeTab === 'intelligence' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
                        >
                            <ShieldCheck size={18} /> ATS Health
                        </button>
                        <button
                            onClick={() => setActiveTab('templates')}
                            className={`pb-3 font-semibold text-sm transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${activeTab === 'templates' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
                        >
                            <Sparkles size={18} /> ATS Templates ({savedTemplates.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('tailored_history')}
                            className={`pb-3 font-semibold text-sm transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${activeTab === 'tailored_history' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
                        >
                            <History size={18} /> Tailored CVs ({tailoredResumes.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('cover_letters')}
                            className={`pb-3 font-semibold text-sm transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${activeTab === 'cover_letters' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
                        >
                            <Mail size={18} /> Cover Letters ({coverLetters.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('preview')}
                            className={`pb-3 font-semibold text-sm transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${activeTab === 'preview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
                        >
                            <FileText size={18} /> Parsed Text
                        </button>
                    </div>

                    {/* Tab 1: ATS Intelligence */}
                    {activeTab === 'intelligence' && (
                        healthLoading ? (
                            <LoadingSkeleton variant="card" count={2} />
                        ) : healthReport ? (
                            <div className="space-y-6 animate-fade-in">
                                <Card variant="flat" className="p-6 flex flex-col md:flex-row justify-between items-center gap-6 bg-white border-slate-200">
                                    <div className="space-y-1 text-center md:text-left">
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">ATS Readiness Health Score</span>
                                        <div className="flex items-baseline gap-3 justify-center md:justify-start">
                                            <span className="text-4xl font-extrabold text-slate-900">{healthReport.health_score}</span>
                                            <span className="text-slate-400 text-lg">/ 100</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center md:items-end gap-2">
                                        <Badge variant={healthReport.health_score >= 85 ? 'emerald' : healthReport.health_score >= 70 ? 'indigo' : 'amber'}>
                                            {healthReport.classification} Readiness
                                        </Badge>
                                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                                            healthReport.is_ats_compliant
                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                        }`}>
                                            ATS Risk: {healthReport.ats_risk_level || (healthReport.is_ats_compliant ? 'Low' : 'High')}
                                        </span>
                                    </div>
                                </Card>

                                <Card variant="flat" className="p-5 space-y-3">
                                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Health Factor Breakdown</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                        <HealthMetric label="Completeness" score={healthReport.breakdown.completeness} weight="35%" />
                                        <HealthMetric label="ATS Text Structure" score={healthReport.breakdown.ats_health} weight="30%" />
                                        <HealthMetric label="Contact Info Checks" score={healthReport.breakdown.contact_information} weight="15%" />
                                        <HealthMetric label="Technical Skills" score={healthReport.breakdown.skills} weight="20%" />
                                    </div>
                                </Card>

                                {healthReport.recommendations && healthReport.recommendations.length > 0 && (
                                    <Card variant="flat" className="p-5 space-y-3 border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-950/20">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                                                <AlertTriangle size={15} /> Formatting & ATS Parser Recommendations
                                            </h4>
                                            <Button
                                                size="sm"
                                                variant="primary"
                                                icon={Sparkles}
                                                onClick={() => navigate('/ats-portal')}
                                                className="text-xs"
                                            >
                                                Open ATS Portal
                                            </Button>
                                        </div>
                                        <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                                            {healthReport.recommendations.map((rec, idx) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                    <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                                                    <span>{rec}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </Card>
                                )}
                            </div>
                        ) : (
                            <EmptyState
                                icon={FileText}
                                title="No base resume uploaded"
                                description="Upload your PDF or TXT resume to trigger an automated 10-layer ATS health scan."
                            />
                        )
                    )}

                    {/* Tab 2: ATS Templates Studio & Saved Drafts */}
                    {activeTab === 'templates' && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        ATS Executive Template Collection
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Standardized single-column resumes formatted in Times New Roman 11pt, 1.5 line spaced with Canva design references.
                                    </p>
                                </div>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    icon={Plus}
                                    onClick={() => navigate('/ats-portal')}
                                >
                                    New ATS Template
                                </Button>
                            </div>

                            {savedTemplates.length === 0 ? (
                                <EmptyState
                                    icon={Sparkles}
                                    title="No saved ATS templates yet"
                                    description="Open the ATS Portal to format your resume with Times New Roman 11pt and 1.5 line spacing, import your Canva template, and save drafts."
                                    actionLabel="Launch ATS Portal"
                                    onAction={() => navigate('/ats-portal')}
                                />
                            ) : (
                                savedTemplates.map(tpl => (
                                    <Card key={tpl.id} variant="flat" className="p-5 space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <Badge variant="indigo" size="sm">Times New Roman 11pt</Badge>
                                                    <Badge variant="slate" size="sm">1.5 Spaced</Badge>
                                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                                                        {new Date(tpl.updated_at || tpl.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <h4 className="text-base font-bold text-slate-900 dark:text-white">{tpl.name}</h4>
                                                {tpl.canva_reference_url && (
                                                    <div className="mt-1 flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                                                        <Link2 size={13} />
                                                        <span>Canva Source: In-System Template</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    icon={Edit3}
                                                    onClick={() => navigate(`/ats-portal?template_id=${tpl.id}`)}
                                                >
                                                    Open in ATS Portal
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    icon={Trash2}
                                                    onClick={async () => {
                                                        if (window.confirm(`Delete template "${tpl.name}"?`)) {
                                                            await templateService.delete(tpl.id);
                                                            refreshTemplates();
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    )}

                    {/* Tab 3: Saved Tailored Resumes */}
                    {activeTab === 'tailored_history' && (
                        <div className="space-y-4 animate-fade-in">
                            {tailoredResumes.length === 0 ? (
                                <EmptyState
                                    icon={History}
                                    title="Your resume workspace is empty"
                                    description="Select a target job on the left panel to generate your first versioned tailored resume."
                                />
                            ) : (
                                tailoredResumes.map(item => {
                                    const matchingJob = jobs.find(j => j.id === item.job_id);
                                    const jobAppUrl = item.application_url || matchingJob?.application_url;
                                    return (
                                        <Card key={item.id} variant="flat" className="p-5 space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                        <Badge variant="indigo" size="sm">v{item.version}</Badge>
                                                        {item.match_score && (
                                                            <Badge variant={item.match_score > 70 ? "emerald" : "indigo"} size="sm">
                                                                {Math.round(item.match_score)}% Fit
                                                            </Badge>
                                                        )}
                                                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                                                            {new Date(item.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{item.job_title}</h4>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.company}</p>
                                                </div>
                                                {jobAppUrl && (
                                                    <a
                                                        href={jobAppUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Button variant="primary" size="sm" icon={ExternalLink} className="shadow-xs font-bold">
                                                            Apply on Job Site
                                                        </Button>
                                                    </a>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    icon={copiedResumeId === item.id ? Check : Copy}
                                                    onClick={() => handleCopyResumeText(item.tailored_resume_text, item.id)}
                                                    className="font-medium"
                                                >
                                                    {copiedResumeId === item.id ? "Copied!" : "Copy CV"}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    icon={Sparkles}
                                                    onClick={() => navigate(`/ats-portal?tailored_id=${item.id}`)}
                                                    className="font-medium text-indigo-600 hover:bg-indigo-50"
                                                    title="Format in ATS Portal (Times New Roman 11pt, 1.5 line spacing)"
                                                >
                                                    Format in ATS Portal
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    icon={GitCompare}
                                                    onClick={() => handleCompare(item.id)}
                                                >
                                                    Compare Diff
                                                </Button>
                                                <Button
                                                    variant={trackedJobs[item.job_id] ? "success" : "ghost"}
                                                    size="sm"
                                                    icon={trackedJobs[item.job_id] ? CheckCircle : Plus}
                                                    onClick={() => handleTrackApplication(matchingJob || { id: item.job_id, title: item.job_title, company: item.company, application_url: jobAppUrl }, item.match_score)}
                                                    isLoading={trackingJobId === item.job_id}
                                                    disabled={trackedJobs[item.job_id]}
                                                >
                                                    {trackedJobs[item.job_id] ? "Tracked" : "Track Application"}
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    icon={Trash2}
                                                    className="ml-auto"
                                                    onClick={() => handleDeleteTailored(item.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </Card>
                                    );
                                })
                            )}
                        </div>
                    )}

                    {/* Tab 4: Saved Cover Letters */}
                    {activeTab === 'cover_letters' && (
                        <div className="space-y-4 animate-fade-in">
                            {coverLetters.length === 0 ? (
                                <EmptyState
                                    icon={Mail}
                                    title="No cover letters generated yet"
                                    description="Select a target job and tone on the left panel to format your first targeted cover letter."
                                />
                            ) : (
                                coverLetters.map(letter => {
                                    const matchingJob = jobs.find(j => j.id === letter.job_id);
                                    const jobAppUrl = letter.application_url || matchingJob?.application_url;
                                    return (
                                        <Card key={letter.id} variant="flat" className="p-5 space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                        <Badge variant="indigo" size="sm">v{letter.version}</Badge>
                                                        <Badge variant="cyan" size="sm">{letter.tone} Tone</Badge>
                                                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                                                            {new Date(letter.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{letter.job_title}</h4>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{letter.company}</p>
                                                </div>
                                                {jobAppUrl && (
                                                    <a
                                                        href={jobAppUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Button variant="primary" size="sm" icon={ExternalLink} className="shadow-xs font-bold">
                                                            Apply on Job Site
                                                        </Button>
                                                    </a>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    icon={FileText}
                                                    onClick={() => { setActiveCoverLetter({ ...letter, application_url: jobAppUrl }); setIsLetterModalOpen(true); }}
                                                >
                                                    View & Copy
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    icon={Trash2}
                                                    className="ml-auto"
                                                    onClick={() => handleDeleteCoverLetter(letter.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </Card>
                                    );
                                })
                            )}
                        </div>
                    )}

                    {/* Tab 5: Text Preview */}
                    {activeTab === 'preview' && (
                        <Card variant="flat" className="flex flex-col overflow-hidden h-[550px]">
                            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                                    <FileText className="text-indigo-600" size={16} /> Extracted Plain Text Content
                                </h3>
                            </div>
                            <div className="flex-1 p-6 overflow-y-auto font-mono text-xs leading-relaxed text-slate-700 bg-slate-50/50 whitespace-pre-wrap">
                                {user?.profile?.resume_text || "No text content available."}
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            {/* Modals */}
            <ResumeDiffViewer
                isOpen={isDiffModalOpen}
                onClose={() => setIsDiffModalOpen(false)}
                compareData={compareData}
            />

            <CoverLetterViewer
                isOpen={isLetterModalOpen}
                onClose={() => setIsLetterModalOpen(false)}
                letterData={activeCoverLetter}
                onDelete={handleDeleteCoverLetter}
            />
        </div>
    );
}

function HealthMetric({ label, score, weight }) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-slate-700 font-medium">
                <span>{label} <span className="text-slate-400">({weight})</span></span>
                <span className="font-bold text-slate-900 font-mono">{score}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full ${score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${score}%` }}></div>
            </div>
        </div>
    );
}

export default ResumeHub;
