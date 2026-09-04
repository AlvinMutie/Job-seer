import React, { useState, useEffect } from 'react';
import { Upload, FileText, Check, AlertCircle, Loader2, Sparkles, Activity, ShieldCheck, CheckCircle2, AlertTriangle, Layers, Mail, Cpu, GitCompare, History, Trash2, Plus, ArrowRight, PenTool, Target } from 'lucide-react';
import { authService, jobService, tailoredResumeService, coverLetterService, getApiErrorMessage } from '../services/api';
import ResumeDiffViewer from '../components/ResumeDiffViewer';
import CoverLetterViewer from '../components/CoverLetterViewer';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';

function ResumeHub() {
    const [user, setUser] = useState(null);
    const [healthReport, setHealthReport] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [tailoredResumes, setTailoredResumes] = useState([]);
    const [coverLetters, setCoverLetters] = useState([]);
    
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

    // Modal States
    const [compareData, setCompareData] = useState(null);
    const [isDiffModalOpen, setIsDiffModalOpen] = useState(false);
    
    const [activeCoverLetter, setActiveCoverLetter] = useState(null);
    const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);

    const fetchAllData = async () => {
        try {
            const [userData, jobsData, tailoredData, letterData] = await Promise.all([
                authService.getMe(),
                jobService.getJobs({ limit: 50 }),
                tailoredResumeService.list().catch(() => []),
                coverLetterService.list().catch(() => [])
            ]);
            setUser(userData);
            setJobs(jobsData);
            setTailoredResumes(tailoredData);
            setCoverLetters(letterData);

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

    const handleGenerateTailored = async (e) => {
        e.preventDefault();
        if (!selectedJobId) return;

        setTailoring(true);
        setMessage({ type: '', text: '' });
        try {
            const record = await tailoredResumeService.generate(selectedJobId);
            setMessage({ type: 'success', text: `Tailored version v${record.version} for ${record.job_title} generated & saved!` });
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
            setMessage({ type: 'success', text: `${record.tone} Cover Letter v${record.version} for ${record.job_title} created & saved!` });
            const list = await coverLetterService.list();
            setCoverLetters(list);
            setActiveCoverLetter(record);
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
            />

            {/* Contextual Selected Job Target Banner */}
            {currentTargetJob && (
                <Card variant="flat" className="p-4 bg-indigo-50 border border-indigo-200 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white border border-indigo-200 rounded-xl text-indigo-600">
                            <Target size={20} />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">Target Opportunity Context Preserved</span>
                            <h4 className="text-sm font-bold text-slate-900">{currentTargetJob.title} — <span className="text-slate-600 font-normal">{currentTargetJob.company}</span></h4>
                        </div>
                    </div>
                    <Badge variant="indigo">{currentTargetJob.remote_status}</Badge>
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
                                    <Badge variant={healthReport.health_score >= 85 ? 'emerald' : healthReport.health_score >= 70 ? 'indigo' : 'amber'}>
                                        {healthReport.classification} Readiness
                                    </Badge>
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
                            </div>
                        ) : (
                            <EmptyState
                                icon={FileText}
                                title="No base resume uploaded"
                                description="Upload your PDF or TXT resume to trigger an automated 10-layer ATS health scan."
                            />
                        )
                    )}

                    {/* Tab 2: Saved Tailored Resumes */}
                    {activeTab === 'tailored_history' && (
                        <div className="space-y-4 animate-fade-in">
                            {tailoredResumes.length === 0 ? (
                                <EmptyState
                                    icon={History}
                                    title="Your resume workspace is empty"
                                    description="Select a target job on the left panel to generate your first versioned tailored resume."
                                />
                            ) : (
                                tailoredResumes.map(item => (
                                    <Card key={item.id} variant="flat" className="p-5 space-y-4 hover:border-slate-300 transition-all">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge variant="indigo" size="sm">v{item.version}</Badge>
                                                    <span className="text-xs text-slate-500 font-mono">
                                                        {new Date(item.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <h4 className="text-base font-bold text-slate-900">{item.job_title}</h4>
                                                <p className="text-xs text-slate-500">{item.company}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                icon={GitCompare}
                                                onClick={() => handleCompare(item.id)}
                                            >
                                                Compare Diff
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
                                ))
                            )}
                        </div>
                    )}

                    {/* Tab 3: Saved Cover Letters */}
                    {activeTab === 'cover_letters' && (
                        <div className="space-y-4 animate-fade-in">
                            {coverLetters.length === 0 ? (
                                <EmptyState
                                    icon={Mail}
                                    title="No cover letters generated yet"
                                    description="Select a target job and tone on the left panel to format your first targeted cover letter."
                                />
                            ) : (
                                coverLetters.map(letter => (
                                    <Card key={letter.id} variant="flat" className="p-5 space-y-4 hover:border-slate-300 transition-all">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge variant="indigo" size="sm">v{letter.version}</Badge>
                                                    <Badge variant="cyan" size="sm">{letter.tone} Tone</Badge>
                                                    <span className="text-xs text-slate-500 font-mono">
                                                        {new Date(letter.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <h4 className="text-base font-bold text-slate-900">{letter.job_title}</h4>
                                                <p className="text-xs text-slate-500">{letter.company}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                                            <Button
                                                variant="success"
                                                size="sm"
                                                icon={FileText}
                                                onClick={() => { setActiveCoverLetter(letter); setIsLetterModalOpen(true); }}
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
                                ))
                            )}
                        </div>
                    )}

                    {/* Tab 4: Text Preview */}
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
