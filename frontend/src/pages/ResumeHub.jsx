import React, { useState, useEffect } from 'react';
import { Upload, FileText, Check, AlertCircle, Loader2, Sparkles, Activity, ShieldCheck, CheckCircle2, AlertTriangle, Layers, Mail, Cpu, GitCompare, History, Trash2, Plus, ArrowRight, PenTool } from 'lucide-react';
import { authService, jobService, tailoredResumeService, coverLetterService, getApiErrorMessage } from '../services/api';
import ResumeDiffViewer from '../components/ResumeDiffViewer';
import CoverLetterViewer from '../components/CoverLetterViewer';

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
    const [activeTab, setActiveTab] = useState('intelligence'); // 'intelligence' | 'tailored_history' | 'cover_letters' | 'preview'

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
        return <div className="flex items-center justify-center min-h-[400px] text-slate-500">Loading Resume Hub...</div>;
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Activity className="text-indigo-400" size={32} /> Resume Intelligence & Studio
                </h1>
                <p className="text-slate-400">Manage CVs, run ATS readiness checks, generate persistent tailored resumes, and format multi-tone cover letters.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Upload & Quick Tailor / Cover Letter Generators */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="glass-card p-6 space-y-6">
                        <h3 className="text-xl font-semibold flex items-center gap-2 text-white">
                            <Upload className="text-indigo-400" size={20} /> Upload Base CV
                        </h3>

                        <form onSubmit={handleUpload} className="space-y-4">
                            <div
                                onClick={() => document.getElementById('cv-upload-hub').click()}
                                className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all cursor-pointer group ${file ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/20'}`}
                            >
                                <input
                                    id="cv-upload-hub" type="file" className="hidden"
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx,.txt"
                                />
                                <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                                    {file ? <Check className="text-emerald-500" size={24} /> : <FileText className="text-indigo-500" size={24} />}
                                </div>
                                <p className="text-sm font-medium text-white text-center">{file ? file.name : 'Select PDF, DOCX or TXT file'}</p>
                                <p className="text-xs text-slate-500 mt-1 text-center">Max limit 10MB</p>
                            </div>

                            {message.text && (
                                <div className={`p-4 rounded-xl flex items-center gap-3 animate-fade-in ${message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                                    {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                                    <span className="text-xs font-medium">{message.text}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={!file || uploading}
                                className={`btn-primary w-full py-3 text-sm font-bold ${(!file || uploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {uploading ? <><Loader2 className="animate-spin mr-2" size={16} /> Uploading...</> : 'Upload Base Resume'}
                            </button>
                        </form>
                    </div>

                    {/* Generate Tailored Resume & Cover Letter Generator Card (P3-04 & P3-05) */}
                    <div className="glass-card p-6 space-y-4 border-indigo-500/20 bg-indigo-500/5">
                        <h3 className="text-lg font-semibold flex items-center gap-2 text-indigo-400">
                            <PenTool size={20} /> Studio Generators
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Target Job</label>
                                <select
                                    className="input-field py-2.5 px-3 text-xs bg-slate-900 border-slate-700 text-slate-200 w-full"
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

                            {/* Tone Selector for Cover Letters */}
                            <div>
                                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Cover Letter Tone</label>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    {['Professional', 'Enthusiastic', 'Executive', 'Technical'].map(t => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setSelectedTone(t)}
                                            className={`py-2 px-3 rounded-lg border font-semibold transition-colors text-center ${selectedTone === t ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button
                                    onClick={handleGenerateTailored}
                                    disabled={!selectedJobId || tailoring || !user?.profile?.resume_text}
                                    className={`btn-primary py-2.5 px-3 text-xs font-bold flex items-center justify-center gap-1.5 ${(!selectedJobId || tailoring || !user?.profile?.resume_text) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {tailoring ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />} Tailor CV
                                </button>
                                <button
                                    onClick={handleGenerateCoverLetter}
                                    disabled={!selectedJobId || generatingLetter || !user?.profile?.resume_text}
                                    className={`px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-lg ${(!selectedJobId || generatingLetter || !user?.profile?.resume_text) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {generatingLetter ? <Loader2 className="animate-spin" size={14} /> : <Mail size={14} />} Cover Letter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Tabbed View */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="flex border-b border-slate-800 gap-4 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('intelligence')}
                            className={`pb-3 font-semibold text-sm transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${activeTab === 'intelligence' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                        >
                            <ShieldCheck size={18} /> ATS Health
                        </button>
                        <button
                            onClick={() => setActiveTab('tailored_history')}
                            className={`pb-3 font-semibold text-sm transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${activeTab === 'tailored_history' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                        >
                            <History size={18} /> Tailored CVs ({tailoredResumes.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('cover_letters')}
                            className={`pb-3 font-semibold text-sm transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${activeTab === 'cover_letters' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                        >
                            <Mail size={18} /> Cover Letters ({coverLetters.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('preview')}
                            className={`pb-3 font-semibold text-sm transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${activeTab === 'preview' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                        >
                            <FileText size={18} /> Parsed Text
                        </button>
                    </div>

                    {/* Tab 1: ATS Intelligence */}
                    {activeTab === 'intelligence' && (
                        healthLoading ? (
                            <div className="glass-card p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
                                <Loader2 className="animate-spin text-indigo-500" size={32} />
                                <span>Running ATS readiness health checks...</span>
                            </div>
                        ) : healthReport ? (
                            <div className="space-y-6 animate-fade-in">
                                <div className="glass-card p-6 flex flex-col md:flex-row justify-between items-center gap-6 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border-indigo-500/20">
                                    <div className="space-y-1 text-center md:text-left">
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">ATS Health Score</span>
                                        <div className="flex items-baseline gap-3 justify-center md:justify-start">
                                            <span className="text-4xl font-extrabold text-white">{healthReport.health_score}</span>
                                            <span className="text-slate-500 text-lg">/ 100</span>
                                        </div>
                                    </div>
                                    <div className={`px-5 py-2 rounded-2xl border font-bold text-sm ${
                                        healthReport.health_score >= 85 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                                        healthReport.health_score >= 70 ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' :
                                        'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                    }`}>
                                        {healthReport.classification} Readiness
                                    </div>
                                </div>

                                <div className="glass-card p-5 space-y-3">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Health Factor Breakdown</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                        <HealthMetric label="Completeness" score={healthReport.breakdown.completeness} weight="35%" />
                                        <HealthMetric label="ATS Text Structure" score={healthReport.breakdown.ats_health} weight="30%" />
                                        <HealthMetric label="Contact Info Checks" score={healthReport.breakdown.contact_information} weight="15%" />
                                        <HealthMetric label="Technical Skills" score={healthReport.breakdown.skills} weight="20%" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="glass-card p-12 text-center text-slate-500 space-y-3">
                                <FileText className="mx-auto text-slate-600" size={40} />
                                <h3 className="text-lg font-bold text-slate-300">No Resume Uploaded</h3>
                                <p className="text-sm text-slate-500">Upload a PDF or TXT resume to run an automated ATS health check.</p>
                            </div>
                        )
                    )}

                    {/* Tab 2: Saved Tailored Resumes (P3-04) */}
                    {activeTab === 'tailored_history' && (
                        <div className="space-y-4 animate-fade-in">
                            {tailoredResumes.length === 0 ? (
                                <div className="glass-card p-12 text-center text-slate-500 space-y-3">
                                    <History className="mx-auto text-slate-600" size={40} />
                                    <h3 className="text-lg font-bold text-slate-300">No Tailored Versions Saved</h3>
                                    <p className="text-sm text-slate-500">Select a target job on the left panel to generate your first versioned tailored resume.</p>
                                </div>
                            ) : (
                                tailoredResumes.map(item => (
                                    <div key={item.id} className="glass-card p-5 space-y-4 hover:border-indigo-500/30 transition-all">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="badge badge-indigo">v{item.version}</span>
                                                    <span className="text-xs text-slate-500 font-mono">
                                                        {new Date(item.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <h4 className="text-base font-bold text-white">{item.job_title}</h4>
                                                <p className="text-xs text-slate-400">{item.company}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 border-t border-slate-800/80 pt-3">
                                            <button
                                                onClick={() => handleCompare(item.id)}
                                                className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold hover:bg-indigo-600/30 transition-colors flex items-center gap-1.5"
                                            >
                                                <GitCompare size={14} /> Compare Diff
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTailored(item.id)}
                                                className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold hover:bg-red-500/20 transition-colors flex items-center gap-1.5 ml-auto"
                                            >
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Tab 3: Saved Cover Letters (P3-05) */}
                    {activeTab === 'cover_letters' && (
                        <div className="space-y-4 animate-fade-in">
                            {coverLetters.length === 0 ? (
                                <div className="glass-card p-12 text-center text-slate-500 space-y-3">
                                    <Mail className="mx-auto text-slate-600" size={40} />
                                    <h3 className="text-lg font-bold text-slate-300">No Cover Letters Generated</h3>
                                    <p className="text-sm text-slate-500">Select a target job and tone to generate your first job-tailored cover letter.</p>
                                </div>
                            ) : (
                                coverLetters.map(letter => (
                                    <div key={letter.id} className="glass-card p-5 space-y-4 hover:border-indigo-500/30 transition-all">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="badge badge-indigo">v{letter.version}</span>
                                                    <span className="badge border border-indigo-500/30 text-indigo-400 bg-indigo-500/10 text-xs font-semibold">
                                                        {letter.tone} Tone
                                                    </span>
                                                    <span className="text-xs text-slate-500 font-mono">
                                                        {new Date(letter.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <h4 className="text-base font-bold text-white">{letter.job_title}</h4>
                                                <p className="text-xs text-slate-400">{letter.company}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 border-t border-slate-800/80 pt-3">
                                            <button
                                                onClick={() => { setActiveCoverLetter(letter); setIsLetterModalOpen(true); }}
                                                className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-600/30 transition-colors flex items-center gap-1.5"
                                            >
                                                <FileText size={14} /> View & Copy
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCoverLetter(letter.id)}
                                                className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold hover:bg-red-500/20 transition-colors flex items-center gap-1.5 ml-auto"
                                            >
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Tab 4: Text Preview */}
                    {activeTab === 'preview' && (
                        <div className="glass-card flex flex-col overflow-hidden h-[550px]">
                            <div className="p-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/30">
                                <h3 className="font-semibold text-sm flex items-center gap-2">
                                    <FileText className="text-indigo-400" size={16} /> Extracted Plain Text
                                </h3>
                            </div>
                            <div className="flex-1 p-6 overflow-y-auto font-mono text-xs leading-relaxed text-slate-400 bg-slate-900/50 whitespace-pre-wrap">
                                {user?.profile?.resume_text || "No text content available."}
                            </div>
                        </div>
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
            <div className="flex justify-between text-slate-300">
                <span>{label} <span className="text-slate-500">({weight})</span></span>
                <span className="font-bold text-white">{score}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full ${score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${score}%` }}></div>
            </div>
        </div>
    );
}

export default ResumeHub;
