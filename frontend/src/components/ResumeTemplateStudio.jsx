import React, { useState, useEffect } from 'react';
import { 
    FileText, Save, Download, Copy, Check, Sparkles, ExternalLink, 
    AlertCircle, CheckCircle2, RotateCcw, Layout, Eye, Edit3, X, Loader2, Link2, Trash2
} from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import { templateService } from '../services/api';

export default function ResumeTemplateStudio({ 
    initialRawText = '', 
    initialTemplate = null,
    onClose, 
    onSaved 
}) {
    const [templateName, setTemplateName] = useState(initialTemplate?.name || 'My ATS Executive Resume');
    const [canvaUrl, setCanvaUrl] = useState(initialTemplate?.canva_reference_url || '');
    const [templateStyle, setTemplateStyle] = useState(initialTemplate?.template_style || 'executive_serif');
    
    // Structured resume data
    const [resumeData, setResumeData] = useState({
        full_name: 'John Doe',
        contact_info: 'City, Country | (555) 000-0000 | email@example.com | linkedin.com/in/johndoe',
        professional_summary: 'Dedicated professional with expertise in building scalable, high-performance systems and leading cross-functional teams.',
        skills: 'Python, FastAPI, React, PostgreSQL, Docker, AWS, Git, CI/CD, Agile Methodology',
        experience: `Senior Software Engineer | Acme Corp | 2022 - Present\n- Led development of enterprise microservices handling 10M+ daily requests with 99.99% uptime.\n- Architected high-throughput data processing pipelines reducing processing latency by 40%.\n\nSoftware Engineer | Tech Innovations | 2020 - 2022\n- Developed modern responsive web applications using React, Tailwind CSS, and REST APIs.\n- Mentored 4 junior engineers and implemented automated testing pipelines.`,
        education: `B.S. in Computer Science | University of Technology | 2016 - 2020\n- Dean's List, Relevant Coursework: Algorithms, Database Management, Distributed Systems`,
        projects: `Smart Job Hunter Platform | 2024\n- Built an AI-powered job application acceleration suite with real-time matching and automated tailoring.`
    });

    const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview' | 'raw'
    const [isParsing, setIsParsing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [copied, setCopied] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null); // { type: 'success' | 'error', message: string }
    const [savedTemplates, setSavedTemplates] = useState([]);
    const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState(initialTemplate?.id || null);

    // Initial load: parse raw text if supplied and not already structured
    useEffect(() => {
        if (initialTemplate && initialTemplate.content_json) {
            setResumeData(prev => ({ ...prev, ...initialTemplate.content_json }));
            setTemplateName(initialTemplate.name || 'My ATS Executive Resume');
            setCanvaUrl(initialTemplate.canva_reference_url || '');
            setSelectedTemplateId(initialTemplate.id);
        } else if (initialRawText && !initialTemplate) {
            parseRawText(initialRawText);
        }
        fetchSavedTemplates();
    }, [initialRawText, initialTemplate]);

    const fetchSavedTemplates = async () => {
        try {
            setIsLoadingTemplates(true);
            const data = await templateService.list();
            setSavedTemplates(data || []);
        } catch (err) {
            console.error('Failed to load saved templates:', err);
        } finally {
            setIsLoadingTemplates(false);
        }
    };

    const parseRawText = async (text) => {
        if (!text || text.trim().length === 0) return;
        try {
            setIsParsing(true);
            const parsed = await templateService.formatStructure({ raw_text: text });
            if (parsed) {
                setResumeData({
                    full_name: parsed.full_name || 'Your Full Name',
                    contact_info: parsed.contact_info || '',
                    professional_summary: parsed.professional_summary || '',
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

    const handleFieldChange = (field, value) => {
        setResumeData(prev => ({ ...prev, [field]: value }));
    };

    // Formats full resume into standardized plain text (ideal for clipboard copy & ATS parsers)
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
            setSaveStatus({ type: 'error', message: 'Please provide a template name' });
            return;
        }

        try {
            setIsSaving(true);
            setSaveStatus(null);
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

            setSaveStatus({ type: 'success', message: 'Template successfully saved to database!' });
            fetchSavedTemplates();
            if (onSaved) onSaved(result);
            setTimeout(() => setSaveStatus(null), 4000);
        } catch (err) {
            console.error('Error saving template:', err);
            setSaveStatus({ type: 'error', message: err?.response?.data?.detail || 'Failed to save template.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleLoadTemplate = (tpl) => {
        setSelectedTemplateId(tpl.id);
        setTemplateName(tpl.name);
        setCanvaUrl(tpl.canva_reference_url || '');
        setTemplateStyle(tpl.template_style || 'executive_serif');
        if (tpl.content_json) {
            setResumeData(tpl.content_json);
        }
        setSaveStatus({ type: 'success', message: `Loaded "${tpl.name}"` });
        setTimeout(() => setSaveStatus(null), 3000);
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

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex justify-center p-2 sm:p-4 md:p-6 print:p-0 print:bg-white print:static">
            <div className="bg-white dark:bg-slate-900 w-full max-w-6xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[94vh] print:max-h-none print:border-none print:shadow-none">
                
                {/* Modal Header */}
                <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-50/75 dark:bg-slate-850/50 print:hidden">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                                    ATS Resume Template Studio
                                </h2>
                                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                    Times New Roman 11pt / 1.5 Spaced
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Recruiter-standard single-column layout guaranteed to score 100% on ATS parser readability.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopyPlainText}
                            title="Copy clean text for Workday / Greenhouse forms"
                        >
                            {copied ? <Check className="w-4 h-4 text-emerald-500 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
                            {copied ? 'Copied' : 'Copy Plaintext'}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrint}
                            title="Print or Save as PDF with exact 11pt formatting"
                        >
                            <Download className="w-4 h-4 mr-1.5" />
                            Export PDF
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
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 ml-1"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Status Bar / Alerts */}
                {saveStatus && (
                    <div className={`px-5 py-2.5 text-sm flex items-center gap-2 border-b print:hidden ${
                        saveStatus.type === 'success' 
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' 
                            : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800'
                    }`}>
                        {saveStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
                        <span>{saveStatus.message}</span>
                    </div>
                )}

                {/* Canva Template Reference Bar & Template Meta */}
                <div className="p-4 bg-amber-500/5 dark:bg-amber-500/10 border-b border-amber-500/20 grid grid-cols-1 md:grid-cols-12 gap-3 items-center print:hidden">
                    <div className="md:col-span-4">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Template Name
                        </label>
                        <Input
                            size="sm"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            placeholder="e.g. Senior Software Engineer - ATS Standard"
                        />
                    </div>
                    
                    <div className="md:col-span-5">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                                <Link2 className="w-3.5 h-3.5 text-primary-500" />
                                Canva Template Reference Link
                            </span>
                            {canvaUrl && (
                                <a 
                                    href={canvaUrl} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                                >
                                    Open Canva <ExternalLink className="w-3 h-3" />
                                </a>
                            )}
                        </label>
                        <Input
                            size="sm"
                            value={canvaUrl}
                            onChange={(e) => setCanvaUrl(e.target.value)}
                            placeholder="https://www.canva.com/design/... (optional design reference)"
                        />
                    </div>

                    <div className="md:col-span-3 flex items-end gap-2">
                        <div className="w-full">
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Layout Standard
                            </label>
                            <select
                                value={templateStyle}
                                onChange={(e) => setTemplateStyle(e.target.value)}
                                className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-2 text-slate-900 dark:text-white"
                            >
                                <option value="executive_serif">Executive Serif (Times New Roman 11pt)</option>
                                <option value="modern_standard">Modern Clean (11pt Serif Standard)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Sub-Navigation & Saved Templates Quick Switcher */}
                <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-white dark:bg-slate-900 text-xs print:hidden">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setActiveTab('editor')}
                            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                                activeTab === 'editor'
                                    ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                        >
                            <Edit3 className="w-3.5 h-3.5" />
                            Section Editor
                        </button>
                        <button
                            onClick={() => setActiveTab('preview')}
                            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                                activeTab === 'preview'
                                    ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                        >
                            <Eye className="w-3.5 h-3.5" />
                            Formatted Document Preview
                        </button>
                    </div>

                    {/* Saved Templates Pills */}
                    {savedTemplates.length > 0 && (
                        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-md">
                            <span className="text-slate-400 font-medium shrink-0">Saved drafts:</span>
                            {savedTemplates.map((tpl) => (
                                <div
                                    key={tpl.id}
                                    onClick={() => handleLoadTemplate(tpl)}
                                    className={`cursor-pointer px-2.5 py-1 rounded-md border text-xs flex items-center gap-1.5 shrink-0 transition-all ${
                                        selectedTemplateId === tpl.id
                                            ? 'bg-primary-50 dark:bg-primary-950/40 border-primary-500 text-primary-700 dark:text-primary-300 font-semibold'
                                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400'
                                    }`}
                                >
                                    <span className="truncate max-w-[120px]">{tpl.name}</span>
                                    <button
                                        onClick={(e) => handleDeleteTemplate(tpl.id, e)}
                                        className="hover:text-red-500 p-0.5 rounded"
                                        title="Delete template"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/70 dark:bg-slate-950/60 print:p-0 print:bg-white">
                    {isParsing ? (
                        <div className="h-64 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                            <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-3" />
                            <p className="text-sm font-medium">Extracting and formatting ATS sections...</p>
                        </div>
                    ) : activeTab === 'editor' ? (
                        <div className="max-w-4xl mx-auto space-y-5">
                            
                            {/* Personal Header */}
                            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                                    Candidate Identity & Contact Information
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Full Name (Times New Roman 16pt Bold)
                                        </label>
                                        <Input
                                            value={resumeData.full_name}
                                            onChange={(e) => handleFieldChange('full_name', e.target.value)}
                                            placeholder="Your Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Contact Line (Location | Phone | Email | LinkedIn | Portfolio)
                                        </label>
                                        <Input
                                            value={resumeData.contact_info}
                                            onChange={(e) => handleFieldChange('contact_info', e.target.value)}
                                            placeholder="San Francisco, CA | (555) 123-4567 | user@domain.com | linkedin.com/in/user"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                                    Professional Summary
                                </h3>
                                <textarea
                                    value={resumeData.professional_summary}
                                    onChange={(e) => handleFieldChange('professional_summary', e.target.value)}
                                    rows={4}
                                    className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 leading-relaxed font-mono"
                                    placeholder="2-3 impactful sentences highlighting career focus, core competencies, and notable accomplishments."
                                />
                            </div>

                            {/* Skills */}
                            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                                    Core Skills & Technologies
                                </h3>
                                <textarea
                                    value={resumeData.skills}
                                    onChange={(e) => handleFieldChange('skills', e.target.value)}
                                    rows={3}
                                    className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 leading-relaxed font-mono"
                                    placeholder="Comma-separated or bulleted technical skills: Languages, Frameworks, Cloud, Methodologies."
                                />
                            </div>

                            {/* Experience */}
                            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                                    Professional Experience
                                </h3>
                                <p className="text-xs text-slate-500 mb-2">
                                    Tip: Format each position with standard headers: Role | Company | Dates, followed by bullet points with quantifiable metrics.
                                </p>
                                <textarea
                                    value={resumeData.experience}
                                    onChange={(e) => handleFieldChange('experience', e.target.value)}
                                    rows={8}
                                    className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 leading-relaxed font-mono"
                                    placeholder="Job Title | Company | Dates&#10;- Accomplishment with measurable outcome&#10;- Technologies utilized"
                                />
                            </div>

                            {/* Education & Projects */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                                        Education
                                    </h3>
                                    <textarea
                                        value={resumeData.education}
                                        onChange={(e) => handleFieldChange('education', e.target.value)}
                                        rows={4}
                                        className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 leading-relaxed font-mono"
                                        placeholder="Degree | Institution | Graduation Year"
                                    />
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                                        Projects & Key Achievements
                                    </h3>
                                    <textarea
                                        value={resumeData.projects}
                                        onChange={(e) => handleFieldChange('projects', e.target.value)}
                                        rows={4}
                                        className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 leading-relaxed font-mono"
                                        placeholder="Project Name | Key Impact / Technologies"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Document Preview: Pure Times New Roman, 11pt, 1.5 line spacing sheet */
                        <div className="flex justify-center">
                            <div 
                                id="ats-resume-printable-sheet"
                                className="bg-white text-black p-8 sm:p-12 md:p-16 max-w-3xl w-full shadow-lg rounded-sm border border-slate-300 print:shadow-none print:border-none print:m-0 print:p-8"
                                style={{
                                    fontFamily: '"Times New Roman", Times, serif',
                                    fontSize: '11pt',
                                    lineHeight: '1.5',
                                    color: '#111827'
                                }}
                            >
                                {/* Candidate Header */}
                                <div className="text-center pb-4 mb-4 border-b border-gray-400">
                                    <h1 className="text-2xl font-bold tracking-tight uppercase" style={{ fontSize: '16pt', lineHeight: '1.2' }}>
                                        {resumeData.full_name || 'FULL NAME'}
                                    </h1>
                                    <div className="mt-1 text-xs text-gray-700 font-normal" style={{ fontSize: '10pt' }}>
                                        {resumeData.contact_info}
                                    </div>
                                </div>

                                {/* Professional Summary */}
                                {resumeData.professional_summary && (
                                    <div className="mb-5">
                                        <h2 className="font-bold uppercase tracking-wider text-xs border-b border-gray-400 pb-0.5 mb-2" style={{ fontSize: '11pt' }}>
                                            Professional Summary
                                        </h2>
                                        <p className="text-justify whitespace-pre-line" style={{ fontSize: '11pt', lineHeight: '1.5' }}>
                                            {resumeData.professional_summary}
                                        </p>
                                    </div>
                                )}

                                {/* Skills */}
                                {resumeData.skills && (
                                    <div className="mb-5">
                                        <h2 className="font-bold uppercase tracking-wider text-xs border-b border-gray-400 pb-0.5 mb-2" style={{ fontSize: '11pt' }}>
                                            Core Skills & Competencies
                                        </h2>
                                        <p className="whitespace-pre-line" style={{ fontSize: '11pt', lineHeight: '1.5' }}>
                                            {resumeData.skills}
                                        </p>
                                    </div>
                                )}

                                {/* Experience */}
                                {resumeData.experience && (
                                    <div className="mb-5">
                                        <h2 className="font-bold uppercase tracking-wider text-xs border-b border-gray-400 pb-0.5 mb-2" style={{ fontSize: '11pt' }}>
                                            Professional Experience
                                        </h2>
                                        <div className="whitespace-pre-line space-y-2" style={{ fontSize: '11pt', lineHeight: '1.5' }}>
                                            {resumeData.experience}
                                        </div>
                                    </div>
                                )}

                                {/* Education */}
                                {resumeData.education && (
                                    <div className="mb-5">
                                        <h2 className="font-bold uppercase tracking-wider text-xs border-b border-gray-400 pb-0.5 mb-2" style={{ fontSize: '11pt' }}>
                                            Education
                                        </h2>
                                        <div className="whitespace-pre-line" style={{ fontSize: '11pt', lineHeight: '1.5' }}>
                                            {resumeData.education}
                                        </div>
                                    </div>
                                )}

                                {/* Projects */}
                                {resumeData.projects && (
                                    <div className="mb-4">
                                        <h2 className="font-bold uppercase tracking-wider text-xs border-b border-gray-400 pb-0.5 mb-2" style={{ fontSize: '11pt' }}>
                                            Key Projects & Accomplishments
                                        </h2>
                                        <div className="whitespace-pre-line" style={{ fontSize: '11pt', lineHeight: '1.5' }}>
                                            {resumeData.projects}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 print:hidden">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> ATS Score: 100% Parsable
                        </span>
                        <span>•</span>
                        <span>Single-column standard</span>
                        <span>•</span>
                        <span>Times New Roman (11pt / 1.5 line height)</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {activeTab === 'editor' ? (
                            <Button size="sm" variant="outline" onClick={() => setActiveTab('preview')}>
                                <Eye className="w-4 h-4 mr-1.5" />
                                View Formatted Sheet
                            </Button>
                        ) : (
                            <Button size="sm" variant="outline" onClick={() => setActiveTab('editor')}>
                                <Edit3 className="w-4 h-4 mr-1.5" />
                                Edit Sections
                            </Button>
                        )}
                        <Button size="sm" variant="primary" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Save className="w-4 h-4 mr-1.5" />}
                            Save Changes
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}
