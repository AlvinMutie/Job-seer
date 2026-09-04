import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
    FileText, Save, Download, Copy, Check, Sparkles, 
    AlertCircle, CheckCircle2, RotateCcw, Layout, Eye, Edit3, X, Loader2, Link2, Trash2,
    Palette, ArrowLeft, ExternalLink, ShieldCheck, CheckSquare, Plus
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import PageHeader from '../components/ui/PageHeader';
import { authService, templateService, tailoredResumeService } from '../services/api';

const ACCENT_PRESETS = [
    { name: 'Navy', hex: '#1e3a8a', bgClass: 'bg-blue-900', label: 'Executive Navy' },
    { name: 'Slate', hex: '#1e293b', bgClass: 'bg-slate-800', label: 'Slate Charcoal' },
    { name: 'Charcoal', hex: '#111827', bgClass: 'bg-gray-900', label: 'Deep Black' },
    { name: 'Emerald', hex: '#047857', bgClass: 'bg-emerald-700', label: 'Emerald Green' },
    { name: 'Burgundy', hex: '#881337', bgClass: 'bg-rose-900', label: 'Classic Burgundy' },
];

const CANVA_STYLE_PRESETS = [
    { id: 'executive_serif', name: 'Executive Standard', desc: 'Double border dividers, centered formal serif header', tag: 'Most Popular' },
    { id: 'modern_minimalist', name: 'Minimalist Clean', desc: 'Left-accent colored bars, modern section badges', tag: 'Modern' },
    { id: 'tech_linear', name: 'Tech Professional', desc: 'Technical domain tags, metrics callouts & timeline', tag: 'Engineering' },
    { id: 'academic_classic', name: 'Academic Classic', desc: 'Formal thesis & research layout, clean indentation', tag: 'Formal' },
    { id: 'modern_clean', name: 'Modern Tailored', desc: 'Top accent color stripe, uppercase tracking headers', tag: 'Contemporary' },
];

export default function AtsPortal() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [templateName, setTemplateName] = useState('ATS Executive Resume');
    const [canvaUrl, setCanvaUrl] = useState('');
    const [templateStyle, setTemplateStyle] = useState('executive_serif');
    const [accentColor, setAccentColor] = useState('#1e3a8a');
    
    // Structured resume data
    const [resumeData, setResumeData] = useState({
        full_name: 'John Doe',
        contact_info: 'San Francisco, CA | (555) 123-4567 | candidate@example.com | linkedin.com/in/candidate',
        professional_summary: 'Dedicated professional with extensive experience building scalable, high-performance systems and leading cross-functional engineering teams to achieve measurable business outcomes.',
        skills: 'Python, FastAPI, React, TypeScript, PostgreSQL, Docker, AWS, Git, CI/CD, Microservices, Agile Methodology',
        experience: `Senior Software Engineer | CloudScale Inc. | 2022 - Present\n• Architected enterprise microservices handling 15M+ daily requests with 99.99% service availability.\n• Reduced backend data ingestion latency by 42% through optimized database indexing and query tuning.\n\nSoftware Engineer | Tech Innovations LLC | 2020 - 2022\n• Developed responsive customer-facing web applications using React, Tailwind CSS, and REST APIs.\n• Spearheaded automated CI/CD deployment pipelines, decreasing release cycle times by 35%.`,
        education: `B.S. in Computer Science | University of California, Berkeley | 2016 - 2020\n• Magna Cum Laude, Relevant Coursework: Distributed Systems, Database Architecture, Machine Learning`,
        projects: `Smart Job Hunter Platform | 2024\n• Built an AI-powered career search companion with automated ATS health diagnostics and real-time matching.`
    });

    const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'editor'
    const [isParsing, setIsParsing] = useState(false);
    const [isImportingCanva, setIsImportingCanva] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [copied, setCopied] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);
    const [savedTemplates, setSavedTemplates] = useState([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);

    // Initial data load & parameter handling
    useEffect(() => {
        const initialize = async () => {
            try {
                const [userData, templatesData] = await Promise.all([
                    authService.getMe().catch(() => null),
                    templateService.list().catch(() => [])
                ]);

                setUser(userData);
                setSavedTemplates(templatesData || []);

                const paramTemplateId = searchParams.get('template_id');
                const paramTailoredId = searchParams.get('tailored_id');

                if (paramTemplateId && templatesData) {
                    const target = templatesData.find(t => String(t.id) === String(paramTemplateId));
                    if (target) {
                        loadTemplateDirectly(target);
                        return;
                    }
                }

                if (paramTailoredId) {
                    try {
                        const tailoredRes = await tailoredResumeService.get(paramTailoredId);
                        if (tailoredRes && tailoredRes.tailored_resume_text) {
                            await parseRawText(tailoredRes.tailored_resume_text, userData?.full_name);
                            setTemplateName(`Tailored CV - ${tailoredRes.job_title} (${tailoredRes.company})`);
                            return;
                        }
                    } catch (tErr) {
                        console.error('Failed to load tailored CV:', tErr);
                    }
                }

                // If user has uploaded resume text, auto-populate it into the template
                if (userData?.profile?.resume_text) {
                    await parseRawText(userData.profile.resume_text, userData.full_name);
                } else if (userData?.full_name) {
                    setResumeData(prev => ({ ...prev, full_name: userData.full_name, contact_info: `${userData.email || 'user@example.com'} | (555) 000-0000` }));
                }
            } catch (err) {
                console.error('Initialization error:', err);
            }
        };

        initialize();
    }, [searchParams]);

    const loadTemplateDirectly = (tpl) => {
        setSelectedTemplateId(tpl.id);
        setTemplateName(tpl.name);
        setCanvaUrl(tpl.canva_reference_url || '');
        setTemplateStyle(tpl.template_style || 'executive_serif');
        if (tpl.content_json) {
            setResumeData(tpl.content_json);
        }
        setStatusMessage({ type: 'success', message: `Loaded template "${tpl.name}"` });
        setTimeout(() => setStatusMessage(null), 3000);
    };

    const fetchSavedTemplates = async () => {
        try {
            const data = await templateService.list();
            setSavedTemplates(data || []);
        } catch (err) {
            console.error('Failed to load saved templates:', err);
        }
    };

    const parseRawText = async (text, fallbackName = '') => {
        if (!text || text.trim().length === 0) return;
        try {
            setIsParsing(true);
            const parsed = await templateService.formatStructure({ raw_text: text });
            if (parsed) {
                const contactParts = [];
                if (parsed.location) contactParts.push(parsed.location);
                if (parsed.phone) contactParts.push(parsed.phone);
                if (parsed.email) contactParts.push(parsed.email);
                if (parsed.linkedin) contactParts.push(parsed.linkedin);
                if (parsed.github) contactParts.push(parsed.github);

                setResumeData({
                    full_name: parsed.full_name || fallbackName || 'Your Full Name',
                    contact_info: contactParts.join(' | ') || 'City, Country | (555) 000-0000 | email@example.com',
                    professional_summary: parsed.summary || '',
                    skills: parsed.skills || '',
                    experience: parsed.experience || '',
                    education: parsed.education || '',
                    projects: parsed.projects || ''
                });
            }
        } catch (err) {
            console.error('Failed to parse resume structure:', err);
        } finally {
            setIsParsing(false);
        }
    };

    // In-System Canva Template Importer (Zero redirection to Canva)
    const handleImportCanvaTemplate = async (customUrl = null) => {
        const urlToUse = customUrl || canvaUrl;
        if (!urlToUse || !urlToUse.trim()) {
            setStatusMessage({ type: 'error', message: 'Please enter or select a Canva template link to import.' });
            return;
        }

        try {
            setIsImportingCanva(true);
            setStatusMessage(null);

            const result = await templateService.importCanva({
                canva_url: urlToUse.trim(),
                raw_text: generatePlainText()
            });

            if (result) {
                if (result.content_json) {
                    setResumeData(prev => ({
                        ...prev,
                        ...result.content_json,
                        full_name: user?.full_name || result.content_json.full_name || prev.full_name
                    }));
                }
                if (result.template_name) {
                    setTemplateName(`${result.template_name} (In-System ATS)`);
                }
                if (result.template_style) {
                    setTemplateStyle(result.template_style);
                }
                if (result.design_theme?.accent_color) {
                    setAccentColor(result.design_theme.accent_color);
                }

                setStatusMessage({
                    type: 'success',
                    message: `Canva Template imported into system! Layout adapted to ${result.template_name} with your CV content in Times New Roman 11pt, 1.5 line spacing.`
                });
                setActiveTab('preview');
                setTimeout(() => setStatusMessage(null), 6000);
            }
        } catch (err) {
            console.error('Canva template import error:', err);
            setStatusMessage({
                type: 'error',
                message: err?.response?.data?.detail || 'Failed to import Canva template. Please verify the URL.'
            });
        } finally {
            setIsImportingCanva(false);
        }
    };

    const handleFieldChange = (field, value) => {
        setResumeData(prev => ({ ...prev, [field]: value }));
    };

    const generatePlainText = () => {
        return `${resumeData.full_name.toUpperCase()}\n${resumeData.contact_info}\n\n` +
            `PROFESSIONAL SUMMARY\n${'='.repeat(40)}\n${resumeData.professional_summary}\n\n` +
            `CORE SKILLS & TECHNOLOGIES\n${'='.repeat(40)}\n${resumeData.skills}\n\n` +
            `PROFESSIONAL EXPERIENCE\n${'='.repeat(40)}\n${resumeData.experience}\n\n` +
            `EDUCATION\n${'='.repeat(40)}\n${resumeData.education}\n\n` +
            (resumeData.projects ? `PROJECTS & ACHIEVEMENTS\n${'='.repeat(40)}\n${resumeData.projects}\n` : '');
    };

    const handleCopyPlainText = () => {
        const text = generatePlainText();
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const handleSave = async () => {
        if (!templateName.trim()) {
            setStatusMessage({ type: 'error', message: 'Please provide a template name' });
            return;
        }

        try {
            setIsSaving(true);
            setStatusMessage(null);
            const payload = {
                name: templateName,
                template_style: templateStyle,
                canva_reference_url: canvaUrl.trim() || null,
                content_json: resumeData,
                formatted_text: generatePlainText()
            };

            let result;
            if (selectedTemplateId) {
                result = await templateService.update(selectedTemplateId, payload);
            } else {
                result = await templateService.save(payload);
                setSelectedTemplateId(result.id);
            }

            setStatusMessage({ type: 'success', message: 'Template successfully saved to database!' });
            fetchSavedTemplates();
            setTimeout(() => setStatusMessage(null), 4000);
        } catch (err) {
            console.error('Error saving template:', err);
            setStatusMessage({ type: 'error', message: err?.response?.data?.detail || 'Failed to save template.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteTemplate = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm('Delete this saved resume template?')) return;
        try {
            await templateService.delete(id);
            if (selectedTemplateId === id) {
                setSelectedTemplateId(null);
            }
            fetchSavedTemplates();
        } catch (err) {
            console.error('Error deleting template:', err);
        }
    };

    const handleDownloadPdf = () => {
        window.print();
    };

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            {/* Top Navigation & Breadcrumb */}
            <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={ArrowLeft}
                        onClick={() => navigate('/resume-hub')}
                        className="text-slate-600 dark:text-slate-400"
                    >
                        Back to Resume Hub
                    </Button>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        ATS Portal & Canva Engine
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyPlainText}
                        title="Copy clean text for job applications"
                    >
                        {copied ? <Check className="w-4 h-4 text-emerald-500 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
                        {copied ? 'Copied' : 'Copy Clean Text'}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadPdf}
                        className="border-indigo-500/30 text-indigo-700 dark:text-indigo-300 font-bold"
                    >
                        <Download className="w-4 h-4 mr-1.5" />
                        Download CV (PDF)
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Save className="w-4 h-4 mr-1.5" />}
                        {selectedTemplateId ? 'Update Draft' : 'Save Template'}
                    </Button>
                </div>
            </div>

            {/* Page Header */}
            <PageHeader
                badgeText="STANDARDIZED RECRUITING SUITE"
                title="ATS Portal: In-System Template Studio"
                subtitle="Import any Canva resume template into the system, auto-format with your CV in Times New Roman 11pt, edit live in-app, and download directly."
                className="print:hidden"
            />

            {/* Notification Banner */}
            {statusMessage && (
                <div className={`p-4 rounded-xl text-sm flex items-center gap-3 border shadow-xs print:hidden animate-fade-in ${
                    statusMessage.type === 'success' 
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800' 
                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-800'
                }`}>
                    {statusMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                    <span className="font-medium">{statusMessage.message}</span>
                </div>
            )}

            {/* Canva Link Importer Bar (Zero Redirection to Canva) */}
            <Card variant="flat" className="p-5 border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-indigo-500/5 to-transparent dark:from-amber-950/30 dark:via-indigo-950/20 print:hidden space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                                In-System Importer
                            </span>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <Link2 className="w-4 h-4 text-indigo-600" />
                                Paste Canva Template Link
                            </h3>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                            The system downloads the Canva template layout, translates it into an in-app ATS standard, and maps your CV text directly without ever redirecting you to Canva.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 w-full lg:w-auto">
                        <Input
                            value={canvaUrl}
                            onChange={(e) => setCanvaUrl(e.target.value)}
                            placeholder="https://www.canva.com/templates/EAF...-minimalist-resume/"
                            className="w-full lg:w-96 text-xs"
                        />
                        <Button
                            variant="primary"
                            onClick={() => handleImportCanvaTemplate()}
                            disabled={isImportingCanva || !canvaUrl.trim()}
                            className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                        >
                            {isImportingCanva ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                                    Importing...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 mr-1.5" />
                                    Import & Format CV
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Quick 1-Click Canva Archetype Presets */}
                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">Or pick a Canva-inspired layout:</span>
                    {CANVA_STYLE_PRESETS.map((preset) => (
                        <button
                            key={preset.id}
                            onClick={() => {
                                setTemplateStyle(preset.id);
                                setTemplateName(`${preset.name} (ATS Standard)`);
                                setStatusMessage({ type: 'success', message: `Switched layout to ${preset.name}` });
                                setTimeout(() => setStatusMessage(null), 3000);
                            }}
                            className={`px-3 py-1.5 rounded-lg border font-medium transition-all flex items-center gap-1.5 ${
                                templateStyle === preset.id
                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs font-bold'
                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                            }`}
                        >
                            <span>{preset.name}</span>
                            <span className="text-[10px] opacity-75">({preset.tag})</span>
                        </button>
                    ))}
                </div>
            </Card>

            {/* Template Stylizer Controls Bar */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 print:hidden shadow-xs">
                {/* Mode Selector */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                            activeTab === 'preview'
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                    >
                        <Eye size={15} />
                        Live Sheet View & Inline Edit
                    </button>
                    <button
                        onClick={() => setActiveTab('editor')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                            activeTab === 'editor'
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                    >
                        <Edit3 size={15} />
                        Section Form Fields
                    </button>
                </div>

                {/* Typography & Accent Pickers */}
                <div className="flex items-center gap-4 flex-wrap">
                    {/* Typography Badge */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                        <span className="font-bold font-serif">Times New Roman</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-mono">11pt</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-mono">1.5 Spacing</span>
                    </div>

                    {/* Accent Colors */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-500 font-medium">Accent:</span>
                        {ACCENT_PRESETS.map(preset => (
                            <button
                                key={preset.hex}
                                onClick={() => setAccentColor(preset.hex)}
                                className={`w-6 h-6 rounded-full border-2 transition-all ${preset.bgClass} ${
                                    accentColor === preset.hex ? 'border-indigo-600 scale-125 shadow-sm' : 'border-white dark:border-slate-800 hover:opacity-80'
                                }`}
                                title={preset.label}
                            />
                        ))}
                    </div>

                    {/* Template Name Input */}
                    <div className="w-56">
                        <Input
                            size="sm"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            placeholder="Draft name"
                            className="text-xs"
                        />
                    </div>
                </div>
            </div>

            {/* Main Canvas Area */}
            <div>
                {isParsing ? (
                    <div className="h-96 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-3" />
                        <p className="text-sm font-semibold">Extracting and structuring your CV into the ATS template...</p>
                    </div>
                ) : activeTab === 'editor' ? (
                    /* Structured Section Editor */
                    <div className="max-w-4xl mx-auto space-y-6">
                        <Card variant="flat" className="p-6 space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Identity & Contact Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                                    <Input
                                        value={resumeData.full_name}
                                        onChange={(e) => handleFieldChange('full_name', e.target.value)}
                                        placeholder="Full Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Contact Line</label>
                                    <Input
                                        value={resumeData.contact_info}
                                        onChange={(e) => handleFieldChange('contact_info', e.target.value)}
                                        placeholder="City, Country | Phone | Email | LinkedIn"
                                    />
                                </div>
                            </div>
                        </Card>

                        <Card variant="flat" className="p-6 space-y-2">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Professional Summary</h3>
                            <textarea
                                value={resumeData.professional_summary}
                                onChange={(e) => handleFieldChange('professional_summary', e.target.value)}
                                rows={4}
                                className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3.5 text-slate-900 dark:text-white font-mono leading-relaxed focus:ring-2 focus:ring-indigo-500"
                            />
                        </Card>

                        <Card variant="flat" className="p-6 space-y-2">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Technical Skills</h3>
                            <textarea
                                value={resumeData.skills}
                                onChange={(e) => handleFieldChange('skills', e.target.value)}
                                rows={3}
                                className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3.5 text-slate-900 dark:text-white font-mono leading-relaxed focus:ring-2 focus:ring-indigo-500"
                            />
                        </Card>

                        <Card variant="flat" className="p-6 space-y-2">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Work Experience</h3>
                            <textarea
                                value={resumeData.experience}
                                onChange={(e) => handleFieldChange('experience', e.target.value)}
                                rows={8}
                                className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3.5 text-slate-900 dark:text-white font-mono leading-relaxed focus:ring-2 focus:ring-indigo-500"
                            />
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card variant="flat" className="p-6 space-y-2">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Education</h3>
                                <textarea
                                    value={resumeData.education}
                                    onChange={(e) => handleFieldChange('education', e.target.value)}
                                    rows={4}
                                    className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3.5 text-slate-900 dark:text-white font-mono leading-relaxed focus:ring-2 focus:ring-indigo-500"
                                />
                            </Card>
                            <Card variant="flat" className="p-6 space-y-2">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Projects & Achievements</h3>
                                <textarea
                                    value={resumeData.projects}
                                    onChange={(e) => handleFieldChange('projects', e.target.value)}
                                    rows={4}
                                    className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3.5 text-slate-900 dark:text-white font-mono leading-relaxed focus:ring-2 focus:ring-indigo-500"
                                />
                            </Card>
                        </div>
                    </div>
                ) : (
                    /* Live Document Sheet with Visual Layout Archetypes */
                    <div className="flex flex-col items-center">
                        <div className="mb-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 print:hidden">
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>Click any text block below to edit inline. All changes are formatted in <strong>Times New Roman 11pt, 1.5 line spaced</strong>.</span>
                        </div>

                        {/* Printable Resume Sheet Container */}
                        <div 
                            id="ats-resume-printable-sheet"
                            className="bg-white text-black p-8 sm:p-14 md:p-16 max-w-4xl w-full shadow-2xl rounded-sm border border-slate-300 print:shadow-none print:border-none print:m-0 print:p-8"
                            style={{
                                fontFamily: '"Times New Roman", Times, serif',
                                fontSize: '11pt',
                                lineHeight: '1.5',
                                color: '#111827'
                            }}
                        >
                            {/* Layout Style 1: Executive Standard (Double border, centered) */}
                            {templateStyle === 'executive_serif' && (
                                <>
                                    <div 
                                        className="text-center pb-4 mb-5 border-b-2"
                                        style={{ borderColor: accentColor }}
                                    >
                                        <h1 
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleFieldChange('full_name', e.currentTarget.textContent)}
                                            className="font-bold tracking-wider uppercase cursor-text hover:bg-amber-50/60 p-1 rounded transition-colors" 
                                            style={{ fontSize: '18pt', lineHeight: '1.2', color: accentColor }}
                                        >
                                            {resumeData.full_name || 'FULL NAME'}
                                        </h1>
                                        <div 
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleFieldChange('contact_info', e.currentTarget.textContent)}
                                            className="mt-1.5 text-gray-700 font-normal cursor-text hover:bg-amber-50/60 p-1 rounded transition-colors" 
                                            style={{ fontSize: '10pt' }}
                                        >
                                            {resumeData.contact_info}
                                        </div>
                                    </div>

                                    {/* Sections */}
                                    <ResumeSection
                                        title="Professional Summary"
                                        content={resumeData.professional_summary}
                                        onBlur={(val) => handleFieldChange('professional_summary', val)}
                                        accentColor={accentColor}
                                        styleType="classic"
                                    />
                                    <ResumeSection
                                        title="Core Skills & Technologies"
                                        content={resumeData.skills}
                                        onBlur={(val) => handleFieldChange('skills', val)}
                                        accentColor={accentColor}
                                        styleType="classic"
                                    />
                                    <ResumeSection
                                        title="Professional Experience"
                                        content={resumeData.experience}
                                        onBlur={(val) => handleFieldChange('experience', val)}
                                        accentColor={accentColor}
                                        styleType="classic"
                                    />
                                    <ResumeSection
                                        title="Education"
                                        content={resumeData.education}
                                        onBlur={(val) => handleFieldChange('education', val)}
                                        accentColor={accentColor}
                                        styleType="classic"
                                    />
                                    {resumeData.projects && (
                                        <ResumeSection
                                            title="Key Projects & Achievements"
                                            content={resumeData.projects}
                                            onBlur={(val) => handleFieldChange('projects', val)}
                                            accentColor={accentColor}
                                            styleType="classic"
                                        />
                                    )}
                                </>
                            )}

                            {/* Layout Style 2: Minimalist Clean (Left-accent borders, badges) */}
                            {templateStyle === 'modern_minimalist' && (
                                <>
                                    <div className="pb-4 mb-5 border-b border-gray-300 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                                        <div>
                                            <h1 
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => handleFieldChange('full_name', e.currentTarget.textContent)}
                                                className="font-bold tracking-tight uppercase cursor-text hover:bg-amber-50/60 p-1 rounded transition-colors" 
                                                style={{ fontSize: '18pt', lineHeight: '1.2', color: accentColor }}
                                            >
                                                {resumeData.full_name || 'FULL NAME'}
                                            </h1>
                                        </div>
                                        <div 
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleFieldChange('contact_info', e.currentTarget.textContent)}
                                            className="text-xs text-gray-700 font-normal cursor-text hover:bg-amber-50/60 p-1 rounded transition-colors text-right" 
                                            style={{ fontSize: '9.5pt' }}
                                        >
                                            {resumeData.contact_info}
                                        </div>
                                    </div>

                                    <ResumeSection
                                        title="Professional Summary"
                                        content={resumeData.professional_summary}
                                        onBlur={(val) => handleFieldChange('professional_summary', val)}
                                        accentColor={accentColor}
                                        styleType="bar"
                                    />
                                    <ResumeSection
                                        title="Core Skills & Technologies"
                                        content={resumeData.skills}
                                        onBlur={(val) => handleFieldChange('skills', val)}
                                        accentColor={accentColor}
                                        styleType="bar"
                                    />
                                    <ResumeSection
                                        title="Professional Experience"
                                        content={resumeData.experience}
                                        onBlur={(val) => handleFieldChange('experience', val)}
                                        accentColor={accentColor}
                                        styleType="bar"
                                    />
                                    <ResumeSection
                                        title="Education"
                                        content={resumeData.education}
                                        onBlur={(val) => handleFieldChange('education', val)}
                                        accentColor={accentColor}
                                        styleType="bar"
                                    />
                                    {resumeData.projects && (
                                        <ResumeSection
                                            title="Key Projects & Achievements"
                                            content={resumeData.projects}
                                            onBlur={(val) => handleFieldChange('projects', val)}
                                            accentColor={accentColor}
                                            styleType="bar"
                                        />
                                    )}
                                </>
                            )}

                            {/* Layout Style 3: Tech Professional (Clean boxes & timeline) */}
                            {templateStyle === 'tech_linear' && (
                                <>
                                    <div 
                                        className="p-4 mb-5 rounded border-l-4"
                                        style={{ borderColor: accentColor, backgroundColor: '#f8fafc' }}
                                    >
                                        <h1 
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleFieldChange('full_name', e.currentTarget.textContent)}
                                            className="font-bold tracking-tight uppercase cursor-text hover:bg-amber-50/60 p-1 rounded transition-colors" 
                                            style={{ fontSize: '18pt', lineHeight: '1.2', color: accentColor }}
                                        >
                                            {resumeData.full_name || 'FULL NAME'}
                                        </h1>
                                        <div 
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleFieldChange('contact_info', e.currentTarget.textContent)}
                                            className="mt-1 text-gray-700 font-normal cursor-text hover:bg-amber-50/60 p-1 rounded transition-colors" 
                                            style={{ fontSize: '10pt' }}
                                        >
                                            {resumeData.contact_info}
                                        </div>
                                    </div>

                                    <ResumeSection
                                        title="Technical Profile"
                                        content={resumeData.professional_summary}
                                        onBlur={(val) => handleFieldChange('professional_summary', val)}
                                        accentColor={accentColor}
                                        styleType="tech"
                                    />
                                    <ResumeSection
                                        title="Technical Stack & Expertise"
                                        content={resumeData.skills}
                                        onBlur={(val) => handleFieldChange('skills', val)}
                                        accentColor={accentColor}
                                        styleType="tech"
                                    />
                                    <ResumeSection
                                        title="Engineering Experience"
                                        content={resumeData.experience}
                                        onBlur={(val) => handleFieldChange('experience', val)}
                                        accentColor={accentColor}
                                        styleType="tech"
                                    />
                                    <ResumeSection
                                        title="Education & Credentials"
                                        content={resumeData.education}
                                        onBlur={(val) => handleFieldChange('education', val)}
                                        accentColor={accentColor}
                                        styleType="tech"
                                    />
                                    {resumeData.projects && (
                                        <ResumeSection
                                            title="Technical Projects"
                                            content={resumeData.projects}
                                            onBlur={(val) => handleFieldChange('projects', val)}
                                            accentColor={accentColor}
                                            styleType="tech"
                                        />
                                    )}
                                </>
                            )}

                            {/* Layout Style 4 & 5: Academic Classic or Modern Clean */}
                            {(templateStyle === 'academic_classic' || templateStyle === 'modern_clean') && (
                                <>
                                    {templateStyle === 'modern_clean' && (
                                        <div className="h-1.5 w-full mb-4 rounded-full" style={{ backgroundColor: accentColor }}></div>
                                    )}
                                    <div className="text-center pb-4 mb-4 border-b border-gray-400">
                                        <h1 
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleFieldChange('full_name', e.currentTarget.textContent)}
                                            className="font-bold uppercase tracking-wider cursor-text hover:bg-amber-50/60 p-1 rounded transition-colors" 
                                            style={{ fontSize: '17pt', lineHeight: '1.2', color: accentColor }}
                                        >
                                            {resumeData.full_name || 'FULL NAME'}
                                        </h1>
                                        <div 
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleFieldChange('contact_info', e.currentTarget.textContent)}
                                            className="mt-1 text-gray-700 font-normal cursor-text hover:bg-amber-50/60 p-1 rounded transition-colors" 
                                            style={{ fontSize: '10pt' }}
                                        >
                                            {resumeData.contact_info}
                                        </div>
                                    </div>

                                    <ResumeSection
                                        title="Professional Summary"
                                        content={resumeData.professional_summary}
                                        onBlur={(val) => handleFieldChange('professional_summary', val)}
                                        accentColor={accentColor}
                                        styleType="classic"
                                    />
                                    <ResumeSection
                                        title="Core Competencies"
                                        content={resumeData.skills}
                                        onBlur={(val) => handleFieldChange('skills', val)}
                                        accentColor={accentColor}
                                        styleType="classic"
                                    />
                                    <ResumeSection
                                        title="Professional Experience"
                                        content={resumeData.experience}
                                        onBlur={(val) => handleFieldChange('experience', val)}
                                        accentColor={accentColor}
                                        styleType="classic"
                                    />
                                    <ResumeSection
                                        title="Education"
                                        content={resumeData.education}
                                        onBlur={(val) => handleFieldChange('education', val)}
                                        accentColor={accentColor}
                                        styleType="classic"
                                    />
                                    {resumeData.projects && (
                                        <ResumeSection
                                            title="Key Achievements"
                                            content={resumeData.projects}
                                            onBlur={(val) => handleFieldChange('projects', val)}
                                            accentColor={accentColor}
                                            styleType="classic"
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Saved Templates Gallery Section */}
            {savedTemplates.length > 0 && (
                <Card variant="flat" className="p-6 space-y-4 print:hidden">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Your Saved ATS Templates ({savedTemplates.length})
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Click any draft below to load it into the editor or switch styles.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {savedTemplates.map((tpl) => (
                            <div
                                key={tpl.id}
                                onClick={() => loadTemplateDirectly(tpl)}
                                className={`cursor-pointer p-4 rounded-xl border transition-all ${
                                    selectedTemplateId === tpl.id
                                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-xs'
                                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-400'
                                }`}
                            >
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                        {tpl.name}
                                    </span>
                                    <button
                                        onClick={(e) => handleDeleteTemplate(tpl.id, e)}
                                        className="text-slate-400 hover:text-red-500 p-1 rounded"
                                        title="Delete draft"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                    <Badge variant="indigo" size="sm">{tpl.template_style}</Badge>
                                    <span>{new Date(tpl.updated_at || tpl.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}

function ResumeSection({ title, content, onBlur, accentColor, styleType = 'classic' }) {
    if (!content) return null;

    let headerStyle = {};
    let headerClass = "font-bold uppercase tracking-wider text-xs pb-0.5 mb-2";

    if (styleType === 'bar') {
        headerClass = "font-bold uppercase tracking-wider text-xs border-l-4 pl-2 mb-2";
        headerStyle = { borderColor: accentColor, color: accentColor, fontSize: '11pt' };
    } else if (styleType === 'tech') {
        headerClass = "font-bold uppercase tracking-wider text-xs border-b pb-0.5 mb-2 flex items-center gap-1.5";
        headerStyle = { borderColor: accentColor, color: accentColor, fontSize: '11pt' };
    } else {
        headerClass = "font-bold uppercase tracking-wider text-xs border-b pb-0.5 mb-2";
        headerStyle = { borderColor: accentColor, color: accentColor, fontSize: '11pt' };
    }

    return (
        <div className="mb-5">
            <h2 className={headerClass} style={headerStyle}>
                {title}
            </h2>
            <div 
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => onBlur(e.currentTarget.textContent)}
                className="whitespace-pre-line cursor-text hover:bg-amber-50/60 p-1 rounded transition-colors text-justify" 
                style={{ fontSize: '11pt', lineHeight: '1.5' }}
            >
                {content}
            </div>
        </div>
    );
}
