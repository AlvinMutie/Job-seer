import React, { useState, useEffect } from 'react';
import { 
    FileText, Save, Download, Copy, Check, Sparkles, 
    AlertCircle, CheckCircle2, RotateCcw, Layout, Eye, Edit3, X, Loader2, Link2, Trash2,
    Palette, Type, RefreshCw
} from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import { templateService } from '../services/api';

const ACCENT_PRESETS = [
    { name: 'Navy', hex: '#1e3a8a', bgClass: 'bg-blue-900' },
    { name: 'Slate', hex: '#1e293b', bgClass: 'bg-slate-800' },
    { name: 'Charcoal', hex: '#111827', bgClass: 'bg-gray-900' },
    { name: 'Emerald', hex: '#047857', bgClass: 'bg-emerald-700' },
    { name: 'Burgundy', hex: '#881337', bgClass: 'bg-rose-900' },
];

export default function ResumeTemplateStudio({ 
    initialRawText = '', 
    initialTemplate = null,
    onClose, 
    onSaved 
}) {
    const [templateName, setTemplateName] = useState(initialTemplate?.name || 'ATS Executive Resume');
    const [canvaUrl, setCanvaUrl] = useState(initialTemplate?.canva_reference_url || '');
    const [templateStyle, setTemplateStyle] = useState(initialTemplate?.template_style || 'executive_serif');
    const [accentColor, setAccentColor] = useState('#1e293b');
    
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

    const [activeTab, setActiveTab] = useState('preview'); // Default to live preview for immediate visual satisfaction
    const [isParsing, setIsParsing] = useState(false);
    const [isImportingCanva, setIsImportingCanva] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [copied, setCopied] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error', message: string }
    const [savedTemplates, setSavedTemplates] = useState([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState(initialTemplate?.id || null);

    // Initial load: parse raw text if supplied and not already structured
    useEffect(() => {
        if (initialTemplate && initialTemplate.content_json) {
            setResumeData(prev => ({ ...prev, ...initialTemplate.content_json }));
            setTemplateName(initialTemplate.name || 'ATS Executive Resume');
            setCanvaUrl(initialTemplate.canva_reference_url || '');
            setTemplateStyle(initialTemplate.template_style || 'executive_serif');
            setSelectedTemplateId(initialTemplate.id);
        } else if (initialRawText && !initialTemplate) {
            parseRawText(initialRawText);
        }
        fetchSavedTemplates();
    }, [initialRawText, initialTemplate]);

    const fetchSavedTemplates = async () => {
        try {
            const data = await templateService.list();
            setSavedTemplates(data || []);
        } catch (err) {
            console.error('Failed to load saved templates:', err);
        }
    };

    const parseRawText = async (text) => {
        if (!text || text.trim().length === 0) return;
        try {
            setIsParsing(true);
            const parsed = await templateService.formatStructure({ raw_text: text });
            if (parsed) {
                const contactParts = [];
                if (parsed.location) contactParts.append?.(parsed.location) || contactParts.push(parsed.location);
                if (parsed.phone) contactParts.push(parsed.phone);
                if (parsed.email) contactParts.push(parsed.email);
                if (parsed.linkedin) contactParts.push(parsed.linkedin);
                if (parsed.github) contactParts.push(parsed.github);

                setResumeData({
                    full_name: parsed.full_name || 'Your Full Name',
                    contact_info: contactParts.join(' | ') || 'Location | Phone | Email | LinkedIn',
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
    const handleImportCanvaTemplate = async () => {
        if (!canvaUrl || !canvaUrl.trim()) {
            setStatusMessage({ type: 'error', message: 'Please enter a Canva template link to import.' });
            return;
        }

        try {
            setIsImportingCanva(true);
            setStatusMessage(null);

            const result = await templateService.importCanva({
                canva_url: canvaUrl.trim(),
                raw_text: initialRawText || generatePlainText()
            });

            if (result) {
                if (result.content_json) {
                    setResumeData(result.content_json);
                }
                if (result.template_name) {
                    setTemplateName(`${result.template_name} (ATS Formatted)`);
                }
                if (result.template_style) {
                    setTemplateStyle(result.template_style);
                }
                if (result.design_theme?.accent_color) {
                    setAccentColor(result.design_theme.accent_color);
                }

                setStatusMessage({
                    type: 'success',
                    message: `Template successfully imported and formatted into the system with your CV text! Formatted in Times New Roman 11pt, 1.5 line spacing.`
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

    // Formats full resume into standardized plain text
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
            if (onSaved) onSaved(result);
            setTimeout(() => setStatusMessage(null), 4000);
        } catch (err) {
            console.error('Error saving template:', err);
            setStatusMessage({ type: 'error', message: err?.response?.data?.detail || 'Failed to save template.' });
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
        setStatusMessage({ type: 'success', message: `Loaded "${tpl.name}"` });
        setTimeout(() => setStatusMessage(null), 3000);
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/85 backdrop-blur-sm flex justify-center p-2 sm:p-4 md:p-6 print:p-0 print:bg-white print:static">
            <div className="bg-white dark:bg-slate-900 w-full max-w-6xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[95vh] print:max-h-none print:border-none print:shadow-none">
                
                {/* Modal Header */}
                <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-50/75 dark:bg-slate-850/50 print:hidden">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                                    Canva Template Importer & ATS Studio
                                </h2>
                                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                    Times New Roman 11pt • 1.5 Spacing
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Import any Canva template into the system, auto-format with your CV, edit in-app, and download directly.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopyPlainText}
                            title="Copy clean text for job applications"
                        >
                            {copied ? <Check className="w-4 h-4 text-emerald-500 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
                            {copied ? 'Copied' : 'Copy Plaintext'}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownloadPdf}
                            title="Download formatted CV as PDF directly from the system"
                            className="border-indigo-500/30 text-indigo-700 dark:text-indigo-300 font-semibold"
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
                            {selectedTemplateId ? 'Update Template' : 'Save Template'}
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
                {statusMessage && (
                    <div className={`px-5 py-2.5 text-sm flex items-center gap-2 border-b print:hidden ${
                        statusMessage.type === 'success' 
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' 
                            : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800'
                    }`}>
                        {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
                        <span>{statusMessage.message}</span>
                    </div>
                )}

                {/* In-System Canva Importer Bar (No Canva redirection!) */}
                <div className="p-4 bg-gradient-to-r from-amber-500/10 via-indigo-500/5 to-purple-500/10 border-b border-amber-500/20 print:hidden">
                    <div className="flex flex-col lg:flex-row lg:items-end gap-3 justify-between">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                                <Link2 className="w-3.5 h-3.5 text-indigo-600" />
                                Paste Canva Template Link to Import into System
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    size="sm"
                                    value={canvaUrl}
                                    onChange={(e) => setCanvaUrl(e.target.value)}
                                    placeholder="e.g. https://www.canva.com/templates/EAF...-minimalist-resume/"
                                    className="flex-1"
                                />
                                <Button
                                    size="sm"
                                    variant="primary"
                                    onClick={handleImportCanvaTemplate}
                                    disabled={isImportingCanva || !canvaUrl.trim()}
                                    className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                                >
                                    {isImportingCanva ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                                            Importing Template...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 mr-1.5" />
                                            Import & Format CV
                                        </>
                                    )}
                                </Button>
                            </div>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                                The system reads the Canva template layout, translates it into an in-app ATS standard, and maps your CV text directly without redirecting you to Canva.
                            </span>
                        </div>

                        {/* Theme Style & Accent Colors */}
                        <div className="flex items-center gap-3 pt-2 lg:pt-0">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                                    Accent Color
                                </label>
                                <div className="flex items-center gap-1.5">
                                    {ACCENT_PRESETS.map(preset => (
                                        <button
                                            key={preset.hex}
                                            onClick={() => setAccentColor(preset.hex)}
                                            className={`w-6 h-6 rounded-full border-2 transition-all ${preset.bgClass} ${
                                                accentColor === preset.hex ? 'border-indigo-600 scale-110 shadow-sm' : 'border-white dark:border-slate-800 hover:opacity-80'
                                            }`}
                                            title={preset.name}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="w-44">
                                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                                    Layout Style
                                </label>
                                <select
                                    value={templateStyle}
                                    onChange={(e) => setTemplateStyle(e.target.value)}
                                    className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1.5 text-slate-900 dark:text-white font-medium"
                                >
                                    <option value="executive_serif">Executive Times New Roman</option>
                                    <option value="modern_minimalist">Minimalist Modern (11pt)</option>
                                    <option value="tech_linear">Tech Linear Standard</option>
                                    <option value="academic_classic">Academic Classic</option>
                                    <option value="modern_clean">Modern Tailored</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sub-Navigation & Saved Templates Quick Switcher */}
                <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-white dark:bg-slate-900 text-xs print:hidden">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setActiveTab('preview')}
                            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                                activeTab === 'preview'
                                    ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 font-bold'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                        >
                            <Eye className="w-3.5 h-3.5" />
                            Live In-System Sheet Preview & Inline Edit
                        </button>
                        <button
                            onClick={() => setActiveTab('editor')}
                            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                                activeTab === 'editor'
                                    ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 font-bold'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                        >
                            <Edit3 className="w-3.5 h-3.5" />
                            Structured Field Editor
                        </button>
                    </div>

                    {/* Saved Templates Switcher */}
                    {savedTemplates.length > 0 && (
                        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-md">
                            <span className="text-slate-400 font-medium shrink-0">Saved Drafts:</span>
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
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/80 dark:bg-slate-950/60 print:p-0 print:bg-white">
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
                        /* Document Preview: Pure Times New Roman, 11pt, 1.5 line spacing sheet with direct inline editing */
                        <div className="flex flex-col items-center">
                            <div className="mb-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 print:hidden">
                                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span>Direct In-App Editor: Click on any text block on the sheet below to edit live.</span>
                            </div>

                            <div 
                                id="ats-resume-printable-sheet"
                                className="bg-white text-black p-8 sm:p-12 md:p-16 max-w-3xl w-full shadow-xl rounded-sm border border-slate-300 print:shadow-none print:border-none print:m-0 print:p-8 transition-all"
                                style={{
                                    fontFamily: '"Times New Roman", Times, serif',
                                    fontSize: '11pt',
                                    lineHeight: '1.5',
                                    color: '#111827'
                                }}
                            >
                                {/* Candidate Header */}
                                <div 
                                    className="text-center pb-4 mb-4 border-b-2"
                                    style={{ borderColor: accentColor }}
                                >
                                    <h1 
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => handleFieldChange('full_name', e.currentTarget.textContent)}
                                        className="font-bold tracking-tight uppercase cursor-text hover:bg-amber-50/50 p-1 rounded transition-colors" 
                                        style={{ fontSize: '17pt', lineHeight: '1.2', color: accentColor }}
                                    >
                                        {resumeData.full_name || 'FULL NAME'}
                                    </h1>
                                    <div 
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => handleFieldChange('contact_info', e.currentTarget.textContent)}
                                        className="mt-1 text-gray-700 font-normal cursor-text hover:bg-amber-50/50 p-1 rounded transition-colors" 
                                        style={{ fontSize: '10pt' }}
                                    >
                                        {resumeData.contact_info}
                                    </div>
                                </div>

                                {/* Professional Summary */}
                                <div className="mb-5">
                                    <h2 
                                        className="font-bold uppercase tracking-wider text-xs border-b pb-0.5 mb-2" 
                                        style={{ fontSize: '11pt', borderColor: accentColor, color: accentColor }}
                                    >
                                        Professional Summary
                                    </h2>
                                    <div 
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => handleFieldChange('professional_summary', e.currentTarget.textContent)}
                                        className="text-justify whitespace-pre-line cursor-text hover:bg-amber-50/50 p-1 rounded transition-colors" 
                                        style={{ fontSize: '11pt', lineHeight: '1.5' }}
                                    >
                                        {resumeData.professional_summary}
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="mb-5">
                                    <h2 
                                        className="font-bold uppercase tracking-wider text-xs border-b pb-0.5 mb-2" 
                                        style={{ fontSize: '11pt', borderColor: accentColor, color: accentColor }}
                                    >
                                        Core Skills & Competencies
                                    </h2>
                                    <div 
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => handleFieldChange('skills', e.currentTarget.textContent)}
                                        className="whitespace-pre-line cursor-text hover:bg-amber-50/50 p-1 rounded transition-colors" 
                                        style={{ fontSize: '11pt', lineHeight: '1.5' }}
                                    >
                                        {resumeData.skills}
                                    </div>
                                </div>

                                {/* Experience */}
                                <div className="mb-5">
                                    <h2 
                                        className="font-bold uppercase tracking-wider text-xs border-b pb-0.5 mb-2" 
                                        style={{ fontSize: '11pt', borderColor: accentColor, color: accentColor }}
                                    >
                                        Professional Experience
                                    </h2>
                                    <div 
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => handleFieldChange('experience', e.currentTarget.textContent)}
                                        className="whitespace-pre-line cursor-text hover:bg-amber-50/50 p-1 rounded transition-colors" 
                                        style={{ fontSize: '11pt', lineHeight: '1.5' }}
                                    >
                                        {resumeData.experience}
                                    </div>
                                </div>

                                {/* Education */}
                                <div className="mb-5">
                                    <h2 
                                        className="font-bold uppercase tracking-wider text-xs border-b pb-0.5 mb-2" 
                                        style={{ fontSize: '11pt', borderColor: accentColor, color: accentColor }}
                                    >
                                        Education
                                    </h2>
                                    <div 
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => handleFieldChange('education', e.currentTarget.textContent)}
                                        className="whitespace-pre-line cursor-text hover:bg-amber-50/50 p-1 rounded transition-colors" 
                                        style={{ fontSize: '11pt', lineHeight: '1.5' }}
                                    >
                                        {resumeData.education}
                                    </div>
                                </div>

                                {/* Projects */}
                                {resumeData.projects && (
                                    <div className="mb-4">
                                        <h2 
                                            className="font-bold uppercase tracking-wider text-xs border-b pb-0.5 mb-2" 
                                            style={{ fontSize: '11pt', borderColor: accentColor, color: accentColor }}
                                        >
                                            Key Projects & Accomplishments
                                        </h2>
                                        <div 
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleFieldChange('projects', e.currentTarget.textContent)}
                                            className="whitespace-pre-line cursor-text hover:bg-amber-50/50 p-1 rounded transition-colors" 
                                            style={{ fontSize: '11pt', lineHeight: '1.5' }}
                                        >
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
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> ATS Score: 100% Parsable
                        </span>
                        <span>•</span>
                        <span>Single-column standard</span>
                        <span>•</span>
                        <span>Times New Roman (11pt / 1.5 line height)</span>
                        <span>•</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-medium">Zero Canva Redirection</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {activeTab === 'editor' ? (
                            <Button size="sm" variant="outline" onClick={() => setActiveTab('preview')}>
                                <Eye className="w-4 h-4 mr-1.5" />
                                View & Edit Sheet
                            </Button>
                        ) : (
                            <Button size="sm" variant="outline" onClick={() => setActiveTab('editor')}>
                                <Edit3 className="w-4 h-4 mr-1.5" />
                                Section Form Editor
                            </Button>
                        )}
                        <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={handleDownloadPdf}
                            className="border-indigo-500/30 text-indigo-700 dark:text-indigo-300 font-semibold"
                        >
                            <Download className="w-4 h-4 mr-1.5" />
                            Download CV (PDF)
                        </Button>
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
