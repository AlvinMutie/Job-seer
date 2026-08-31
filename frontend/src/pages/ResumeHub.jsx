import React, { useState, useEffect } from 'react';
import { Upload, FileText, Check, AlertCircle, Loader2, Sparkles, Activity, ShieldCheck, CheckCircle2, AlertTriangle, Layers, Code, Mail, Phone, Globe, Cpu } from 'lucide-react';
import { authService, getApiErrorMessage } from '../services/api';

function ResumeHub() {
    const [user, setUser] = useState(null);
    const [healthReport, setHealthReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [healthLoading, setHealthLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [activeTab, setActiveTab] = useState('intelligence'); // 'intelligence' | 'preview'

    const fetchUserAndHealth = async () => {
        try {
            const userData = await authService.getMe();
            setUser(userData);

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
            console.error("Failed to fetch user profile:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserAndHealth();
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
            await fetchUserAndHealth();
        } catch (error) {
            console.error("Upload failed:", error);
            setMessage({ type: 'error', text: getApiErrorMessage(error) });
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-[400px] text-slate-500">Loading Resume Hub...</div>;
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Activity className="text-indigo-400" size={32} /> Resume Intelligence & ATS Hub
                </h1>
                <p className="text-slate-400">Manage your CV, run technical ATS health checks, and view domain skill categorization.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Upload Section */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="glass-card p-6">
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
                            <Upload className="text-indigo-400" size={20} /> Upload / Update CV
                        </h3>

                        <form onSubmit={handleUpload} className="space-y-6">
                            <div
                                onClick={() => document.getElementById('cv-upload-hub').click()}
                                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer group ${file ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/20'}`}
                            >
                                <input
                                    id="cv-upload-hub" type="file" className="hidden"
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx,.txt"
                                />
                                <div className="w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                                    {file ? <Check className="text-emerald-500" size={28} /> : <FileText className="text-indigo-500" size={28} />}
                                </div>
                                <p className="text-base font-medium text-white text-center">{file ? file.name : 'Select PDF, DOCX or TXT file'}</p>
                                <p className="text-xs text-slate-500 mt-1 text-center">Maximum size limit 10MB</p>
                            </div>

                            {message.text && (
                                <div className={`p-4 rounded-xl flex items-center gap-3 animate-fade-in ${message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                                    {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                                    <span className="text-sm font-medium">{message.text}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={!file || uploading}
                                className={`btn-primary w-full py-3.5 text-base font-bold ${(!file || uploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {uploading ? <><Loader2 className="animate-spin mr-2" size={18} /> Analyzing Resume...</> : 'Upload & Analyze Resume'}
                            </button>
                        </form>
                    </div>

                    <div className="glass-card p-6 border-indigo-500/20 bg-indigo-500/5 space-y-2">
                        <h4 className="font-semibold flex items-center gap-2 text-indigo-400">
                            <Sparkles size={18} /> ATS Parsing Security
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Resumes pass through our 10-layer security boundary (MIME validation, extension check, non-executable parsing). Personal information is processed in-memory for ATS health verification.
                        </p>
                    </div>
                </div>

                {/* Right Column: ATS Health & Intelligence Dashboard */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="flex border-b border-slate-800 gap-4">
                        <button
                            onClick={() => setActiveTab('intelligence')}
                            className={`pb-3 font-semibold text-sm transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'intelligence' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                        >
                            <ShieldCheck size={18} /> ATS Health Analysis
                        </button>
                        <button
                            onClick={() => setActiveTab('preview')}
                            className={`pb-3 font-semibold text-sm transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'preview' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                        >
                            <FileText size={18} /> Parsed Text Preview
                        </button>
                    </div>

                    {activeTab === 'intelligence' ? (
                        healthLoading ? (
                            <div className="glass-card p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
                                <Loader2 className="animate-spin text-indigo-500" size={32} />
                                <span>Running ATS readiness health checks...</span>
                            </div>
                        ) : healthReport ? (
                            <div className="space-y-6 animate-fade-in">
                                {/* Overall Health Score Card */}
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

                                {/* Factor Breakdown & Weights */}
                                <div className="glass-card p-6 space-y-4">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Health Factor Breakdown</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                        <HealthMetric label="Completeness" score={healthReport.breakdown.completeness} weight="35%" />
                                        <HealthMetric label="ATS Text Structure" score={healthReport.breakdown.ats_health} weight="30%" />
                                        <HealthMetric label="Contact Info Checks" score={healthReport.breakdown.contact_information} weight="15%" />
                                        <HealthMetric label="Technical Skills" score={healthReport.breakdown.skills} weight="20%" />
                                    </div>
                                </div>

                                {/* Detected Sections & Contact Checks Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Sections Detected */}
                                    <div className="glass-card p-5 space-y-3">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <Layers size={14} /> Resume Sections Detected
                                        </h4>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <SectionItem label="Summary" present={healthReport.sections_detected.includes('summary')} />
                                            <SectionItem label="Experience" present={healthReport.sections_detected.includes('experience')} />
                                            <SectionItem label="Skills" present={healthReport.sections_detected.includes('skills')} />
                                            <SectionItem label="Education" present={healthReport.sections_detected.includes('education')} />
                                            <SectionItem label="Projects" present={healthReport.sections_detected.includes('projects')} />
                                            <SectionItem label="Certifications" present={healthReport.sections_detected.includes('certifications')} />
                                        </div>
                                    </div>

                                    {/* Contact Information Checks */}
                                    <div className="glass-card p-5 space-y-3">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <Mail size={14} /> Contact Information Checks
                                        </h4>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <ContactCheckItem label="Email" present={healthReport.contact_checks.email} />
                                            <ContactCheckItem label="Phone" present={healthReport.contact_checks.phone} />
                                            <ContactCheckItem label="LinkedIn" present={healthReport.contact_checks.linkedin} />
                                            <ContactCheckItem label="GitHub" present={healthReport.contact_checks.github} />
                                            <ContactCheckItem label="Portfolio" present={healthReport.contact_checks.portfolio} />
                                        </div>
                                    </div>
                                </div>

                                {/* Technical Skill Categorization */}
                                <div className="glass-card p-5 space-y-3">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <Cpu size={14} /> Technical Skills Intelligence by Domain
                                    </h4>
                                    <div className="space-y-3 text-xs">
                                        <SkillDomainGroup title="Languages" skills={healthReport.skill_domains.programming_languages} />
                                        <SkillDomainGroup title="Frontend" skills={healthReport.skill_domains.frontend} />
                                        <SkillDomainGroup title="Backend & APIs" skills={healthReport.skill_domains.backend} />
                                        <SkillDomainGroup title="Databases" skills={healthReport.skill_domains.databases} />
                                        <SkillDomainGroup title="Cloud & DevOps" skills={healthReport.skill_domains.cloud_devops} />
                                        <SkillDomainGroup title="Data & AI" skills={healthReport.skill_domains.data_ai} />
                                        <SkillDomainGroup title="Other Tools" skills={healthReport.skill_domains.other} />
                                    </div>
                                </div>

                                {/* Actionable Recommendations */}
                                <div className="glass-card p-5 space-y-3">
                                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <AlertTriangle size={14} /> Actionable ATS Recommendations
                                    </h4>
                                    <ul className="space-y-2 text-xs text-slate-300">
                                        {healthReport.recommendations.map((rec, i) => (
                                            <li key={i} className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                                                <span className="text-amber-400 font-bold">•</span>
                                                <span>{rec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="glass-card p-12 text-center text-slate-500 space-y-3">
                                <FileText className="mx-auto text-slate-600" size={40} />
                                <h3 className="text-lg font-bold text-slate-300">No Resume Uploaded</h3>
                                <p className="text-sm text-slate-500">Upload a PDF or TXT resume to run an automated ATS health check.</p>
                            </div>
                        )
                    ) : (
                        /* Text Preview Tab */
                        <div className="glass-card flex flex-col overflow-hidden h-[550px]">
                            <div className="p-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/30">
                                <h3 className="font-semibold text-sm flex items-center gap-2">
                                    <FileText className="text-indigo-400" size={16} /> Extracted Plain Text
                                </h3>
                                {user?.profile?.has_resume && <span className="badge badge-indigo">Live Version</span>}
                            </div>
                            <div className="flex-1 p-6 overflow-y-auto font-mono text-xs leading-relaxed text-slate-400 bg-slate-900/50 whitespace-pre-wrap">
                                {user?.profile?.resume_text || "No text content available."}
                            </div>
                        </div>
                    )}
                </div>
            </div>
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

function SectionItem({ label, present }) {
    return (
        <div className={`flex items-center gap-2 p-2 rounded-lg border ${present ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300' : 'bg-slate-900/50 border-slate-800 text-slate-500'}`}>
            {present ? <CheckCircle2 size={14} className="text-emerald-400" /> : <AlertTriangle size={14} className="text-slate-600" />}
            <span className="font-medium">{label}</span>
        </div>
    );
}

function ContactCheckItem({ label, present }) {
    return (
        <div className={`flex items-center gap-2 p-2 rounded-lg border ${present ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300' : 'bg-red-500/5 border-red-500/10 text-red-400'}`}>
            {present ? <CheckCircle2 size={14} className="text-emerald-400" /> : <span className="text-red-500 font-bold">✕</span>}
            <span className="font-medium">{label}</span>
        </div>
    );
}

function SkillDomainGroup({ title, skills }) {
    if (!skills || skills.length === 0) return null;
    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-semibold w-32 flex-shrink-0">{title}:</span>
            <div className="flex flex-wrap gap-1.5 flex-1">
                {skills.map(s => (
                    <span key={s} className="px-2 py-0.5 bg-slate-800 text-indigo-300 rounded border border-slate-700">{s}</span>
                ))}
            </div>
        </div>
    );
}

export default ResumeHub;
