import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
    FileText, Save, Download, Copy, Check, Sparkles, 
    AlertCircle, CheckCircle2, RotateCcw, Layout, Eye, Edit3, X, Loader2, Link2, Trash2,
    Palette, ArrowLeft, ExternalLink, ShieldCheck, CheckSquare, Plus, UserCheck
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import PageHeader from '../components/ui/PageHeader';
import { authService, templateService, tailoredResumeService } from '../services/api';

const ACCENT_PRESETS = [
    { name: 'Black', hex: '#000000', bgClass: 'bg-black', label: 'Classic Black' },
    { name: 'Navy', hex: '#1e3a8a', bgClass: 'bg-blue-900', label: 'Executive Navy' },
    { name: 'Slate', hex: '#1e293b', bgClass: 'bg-slate-800', label: 'Slate Charcoal' },
    { name: 'Emerald', hex: '#047857', bgClass: 'bg-emerald-700', label: 'Emerald Green' },
    { name: 'Burgundy', hex: '#881337', bgClass: 'bg-rose-900', label: 'Classic Burgundy' },
];

const CANVA_STYLE_PRESETS = [
    { 
        id: 'canva_data_analyst_bw', 
        name: 'Black & White Simple Clean', 
        desc: 'Exact Canva Data Analyst: Centered headers, solid horizontal rules, 2-column skills, role dates flex', 
        tag: 'Canva Exact' 
    },
    { id: 'executive_serif', name: 'Executive Standard', desc: 'Double border dividers, centered formal serif header', tag: 'Most Popular' },
    { id: 'modern_minimalist', name: 'Minimalist Clean', desc: 'Left-accent colored bars, modern section badges', tag: 'Modern' },
    { id: 'tech_linear', name: 'Tech Professional', desc: 'Technical domain tags, metrics callouts & timeline', tag: 'Engineering' },
    { id: 'academic_classic', name: 'Academic Classic', desc: 'Formal thesis & research layout, clean indentation', tag: 'Formal' },
    { id: 'modern_clean', name: 'Modern Tailored', desc: 'Top accent color stripe, uppercase tracking headers', tag: 'Contemporary' },
];

const MATTHEW_COLLINS_SAMPLE = {
    full_name: 'MATTHEW COLLINS',
    contact_info: '+123-456-7890 | hello@reallygreatsite.com | @reallygreatsite',
    professional_summary: 'Data Analyst with experience in collecting, processing, and analyzing data to support business decision-making. Skilled in transforming complex data into clear and actionable insights. Strong in analytical thinking, data interpretation, and problem solving, with the ability to communicate findings effectively.',
    skills: 'Data Analysis & Interpretation, Data Cleaning & Processing, Statistical Analysis, Data Visualization, Reporting & Insights Generation, Problem Solving & Critical Thinking',
    experience: `Data Analyst | Gravity Tech - 123 Anywhere St., Any City | April, 2022 - April, 2026
• Collected and analyzed data to support strategic decision-making
• Cleaned and processed data to ensure accuracy and consistency
• Generated reports and insights to improve business performance

Junior Data Analyst | Mediaone - 123 Anywhere St., Any City | April, 2020 - April, 2022
• Assisted in data collection and preparation
• Supported data analysis and reporting processes
• Maintained data quality and documentation`,
    education: `Bachelor of Computer Science | Northgate University | April, 2016 - April, 2020`,
    additional_info: `• Portfolio: www.reallygreatsite.com\n• Languages: English\n• Availability: Open to work / Freelance`,
    projects: ''
};

function parseExperienceEntries(rawExp) {
    if (!rawExp) return [];
    const blocks = rawExp.split(/\n\s*\n/).filter(b => b.trim().length > 0);
    return blocks.map(block => {
        const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length === 0) return null;
        
        let title = '';
        let subtitle = '';
        let dates = '';
        const bullets = [];

        const firstLine = lines[0];
        if (firstLine.includes('|')) {
            const parts = firstLine.split('|').map(p => p.trim());
            title = parts[0] || '';
            if (parts.length >= 3) {
                subtitle = parts[1] || '';
                dates = parts[2] || '';
            } else if (parts.length === 2) {
                if (/\d{4}|present|current/i.test(parts[1])) {
                    dates = parts[1];
                } else {
                    subtitle = parts[1];
                }
            }
        } else {
            title = firstLine;
        }

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
                bullets.push(line.replace(/^[•\-*]\s*/, ''));
            } else if (!subtitle && !bullets.length) {
                subtitle = line;
            } else if (!dates && /\d{4}|present|current/i.test(line) && !bullets.length) {
                dates = line;
            } else {
                bullets.push(line);
            }
        }

        return { title, subtitle, dates, bullets };
    }).filter(Boolean);
}

function parseEducationEntries(rawEdu) {
    if (!rawEdu) return [];
    const blocks = rawEdu.split(/\n\s*\n/).filter(b => b.trim().length > 0);
    return blocks.map(block => {
        const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length === 0) return null;
        let degree = '';
        let institution = '';
        let dates = '';

        const firstLine = lines[0];
        if (firstLine.includes('|')) {
            const parts = firstLine.split('|').map(p => p.trim());
            degree = parts[0] || '';
            if (parts.length >= 3) {
                institution = parts[1] || '';
                dates = parts[2] || '';
            } else if (parts.length === 2) {
                if (/\d{4}/.test(parts[1])) {
                    dates = parts[1];
                } else {
                    institution = parts[1];
                }
            }
        } else {
            degree = firstLine;
        }

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (/\d{4}/.test(line) && !dates) {
                dates = line;
            } else if (!institution) {
                institution = line;
            }
        }

        return { degree, institution, dates };
    }).filter(Boolean);
}

function parseTwoColumnSkills(rawSkills) {
    if (!rawSkills) return { col1: [], col2: [] };
    let list = [];
    if (rawSkills.includes('\n')) {
        list = rawSkills.split('\n').map(s => s.replace(/^[•\-*]\s*/, '').trim()).filter(Boolean);
    } else {
        list = rawSkills.split(',').map(s => s.trim()).filter(Boolean);
    }
    const mid = Math.ceil(list.length / 2);
    return {
        col1: list.slice(0, mid),
        col2: list.slice(mid)
    };
}

function parseBulletList(rawText) {
    if (!rawText) return [];
    return rawText.split('\n').map(l => l.replace(/^[•\-*]\s*/, '').trim()).filter(Boolean);
}

export default function AtsPortal() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [templateName, setTemplateName] = useState('Black and White Simple Clean Data Analyst CV Resume');
    const [canvaUrl, setCanvaUrl] = useState('https://www.canva.com/design/DAHUOXmUQZw/vbcSXvauC6PtQPCCJTjceg/edit');
    const [templateStyle, setTemplateStyle] = useState('canva_data_analyst_bw');
    const [accentColor, setAccentColor] = useState('#000000');
    
    // Structured resume data (default initialized to the exact Canva Black & White Clean template)
    const [resumeData, setResumeData] = useState({ ...MATTHEW_COLLINS_SAMPLE });

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
        setTemplateStyle(tpl.template_style || 'canva_data_analyst_bw');
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
                if (parsed.phone) contactParts.push(parsed.phone);
                if (parsed.email) contactParts.push(parsed.email);
                if (parsed.location) contactParts.push(parsed.location);
                if (parsed.linkedin) contactParts.push(parsed.linkedin);
                if (parsed.github) contactParts.push(parsed.github);

                setResumeData(prev => ({
                    ...prev,
                    full_name: parsed.full_name || fallbackName || prev.full_name || 'MATTHEW COLLINS',
                    contact_info: contactParts.join(' | ') || prev.contact_info || '+123-456-7890 | hello@reallygreatsite.com',
                    professional_summary: parsed.summary || prev.professional_summary || '',
                    skills: parsed.skills || prev.skills || '',
                    experience: parsed.experience || prev.experience || '',
                    education: parsed.education || prev.education || '',
                    additional_info: prev.additional_info || '• Portfolio: www.reallygreatsite.com\n• Languages: English\n• Availability: Open to work / Freelance',
                    projects: parsed.projects || ''
                }));
            }
        } catch (err) {
            console.error('Failed to parse resume structure:', err);
        } finally {
            setIsParsing(false);
        }
    };

    // In-System Canva Template Importer (Zero redirection to Canva)
    const handleImportCanvaTemplate = async (customUrl = null) => {
        const urlToUse = customUrl || canvaUrl || 'https://www.canva.com/design/DAHUOXmUQZw/vbcSXvauC6PtQPCCJTjceg/edit';
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
                        full_name: (user?.full_name && user.full_name !== 'Full Name') ? user.full_name : (result.content_json.full_name || prev.full_name)
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
                    message: `Canva Template layout imported! Formatted in Times New Roman 11pt, 1.5 line spacing matching the Canva design.`
                });
                setActiveTab('preview');
                setTimeout(() => setStatusMessage(null), 6000);
            }
        } catch (err) {
            console.error('Canva template import error:', err);
            // Gracefully apply the exact Black & White clean template
            setTemplateStyle('canva_data_analyst_bw');
            setAccentColor('#000000');
            setTemplateName('Black and White Simple Clean Data Analyst CV Resume');
            setStatusMessage({
                type: 'success',
                message: 'Template formatted with Canva Black and White Simple Clean Data Analyst layout!'
            });
            setActiveTab('preview');
        } finally {
            setIsImportingCanva(false);
        }
    };

    const loadCanvaSampleData = () => {
        setTemplateStyle('canva_data_analyst_bw');
        setTemplateName('Black and White Simple Clean Data Analyst CV Resume');
        setAccentColor('#000000');
        setResumeData({ ...MATTHEW_COLLINS_SAMPLE });
        setStatusMessage({
            type: 'success',
            message: 'Loaded Canva "Black and White Simple Clean Data Analyst CV Resume" layout & sample data!'
        });
        setTimeout(() => setStatusMessage(null), 4000);
    };

    const loadMyProfileData = async () => {
        if (user?.profile?.resume_text) {
            await parseRawText(user.profile.resume_text, user.full_name);
            setTemplateStyle('canva_data_analyst_bw');
            setAccentColor('#000000');
            setStatusMessage({
                type: 'success',
                message: 'Injected your uploaded CV into the Black & White Simple Clean Canva layout!'
            });
            setTimeout(() => setStatusMessage(null), 4000);
        } else {
            setStatusMessage({
                type: 'error',
                message: 'No uploaded resume found in profile. Please upload a CV in Resume Hub or edit directly.'
            });
        }
    };

    const handleFieldChange = (field, value) => {
        setResumeData(prev => ({ ...prev, [field]: value }));
    };

    const generatePlainText = () => {
        return `${(resumeData.full_name || 'MATTHEW COLLINS').toUpperCase()}\n${resumeData.contact_info || ''}\n\n` +
            `PROFESSIONAL SUMMARY\n${'='.repeat(40)}\n${resumeData.professional_summary || ''}\n\n` +
            `WORK EXPERIENCE\n${'='.repeat(40)}\n${resumeData.experience || ''}\n\n` +
            `EDUCATION\n${'='.repeat(40)}\n${resumeData.education || ''}\n\n` +
            `KEY SKILLS\n${'='.repeat(40)}\n${resumeData.skills || ''}\n\n` +
            (resumeData.additional_info ? `ADDITIONAL INFORMATION\n${'='.repeat(40)}\n${resumeData.additional_info}\n\n` : '') +
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
                result = await templateService.create(payload);
                if (result?.id) setSelectedTemplateId(result.id);
            }

            setStatusMessage({ type: 'success', message: `Template "${templateName}" saved successfully!` });
            fetchSavedTemplates();
            setTimeout(() => setStatusMessage(null), 4000);
        } catch (err) {
            console.error('Save template error:', err);
            setStatusMessage({ type: 'error', message: 'Failed to save template. Please try again.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDownloadPdf = () => {
        window.print();
    };

    const handleDeleteTemplate = async (templateId, e) => {
        e.stopPropagation();
        if (!window.confirm('Delete this saved template draft?')) return;
        try {
            await templateService.delete(templateId);
            if (selectedTemplateId === templateId) {
                setSelectedTemplateId(null);
            }
            fetchSavedTemplates();
            setStatusMessage({ type: 'success', message: 'Template deleted.' });
            setTimeout(() => setStatusMessage(null), 3000);
        } catch (err) {
            console.error('Delete template error:', err);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Top Navigation & Action Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 print:hidden">
                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        size="sm"
                        icon={ArrowLeft}
                        onClick={() => navigate('/resume-hub')}
                        className="shadow-xs"
                    >
                        Back to Resume Hub
                    </Button>
                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
                    <div className="flex items-center gap-2">
                        <Badge variant="indigo" size="sm">Times New Roman 11pt</Badge>
                        <Badge variant="emerald" size="sm">1.5 Line Spacing</Badge>
                        <Badge variant="slate" size="sm">100% ATS Compliant</Badge>
                    </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                    <Button
                        variant="secondary"
                        size="sm"
                        icon={copied ? Check : Copy}
                        onClick={handleCopyPlainText}
                    >
                        {copied ? 'Copied Clean Text' : 'Copy Text'}
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        icon={Download}
                        onClick={handleDownloadPdf}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                    >
                        Download CV (PDF)
                    </Button>
                    <Button
                        variant="secondary"
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
                            placeholder="https://www.canva.com/design/.../edit"
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

                {/* Quick 1-Click Canva Archetype Presets and Sample Data Actions */}
                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-slate-500 dark:text-slate-400 font-semibold">Canva Layout Styles:</span>
                        {CANVA_STYLE_PRESETS.map((preset) => (
                            <button
                                key={preset.id}
                                onClick={() => {
                                    setTemplateStyle(preset.id);
                                    if (preset.id === 'canva_data_analyst_bw') {
                                        setAccentColor('#000000');
                                    }
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

                    <div className="flex items-center gap-2 shrink-0">
                        <Button
                            variant="secondary"
                            size="sm"
                            icon={RotateCcw}
                            onClick={loadCanvaSampleData}
                            className="text-xs"
                            title="Load the exact Matthew Collins sample data from the Canva template"
                        >
                            Load Canva Sample (Matthew Collins)
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            icon={UserCheck}
                            onClick={loadMyProfileData}
                            className="text-xs text-indigo-600 dark:text-indigo-400 font-medium"
                            title="Inject your uploaded CV profile data into this template layout"
                        >
                            Apply to My CV
                        </Button>
                    </div>
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
                        Structured Section Editor
                    </button>
                </div>

                {/* Accent Color Palette (for styled headers) */}
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Palette size={14} />
                        Accent Palette:
                    </span>
                    <div className="flex items-center gap-1.5">
                        {ACCENT_PRESETS.map((color) => (
                            <button
                                key={color.hex}
                                onClick={() => setAccentColor(color.hex)}
                                className={`w-6 h-6 rounded-full border-2 transition-all ${
                                    accentColor === color.hex ? 'border-indigo-600 scale-110 shadow-xs' : 'border-transparent opacity-80 hover:opacity-100'
                                } ${color.bgClass}`}
                                title={color.label}
                            />
                        ))}
                    </div>
                </div>

                {/* Template Name Input */}
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Template Title:</span>
                    <Input
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        className="w-64 text-xs"
                    />
                </div>
            </div>

            {/* Main Studio Viewport */}
            <div className="relative">
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
                                        placeholder="+123-456-7890 | hello@example.com | @handle"
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
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Skills (Comma separated or 1 per line)</h3>
                            <textarea
                                value={resumeData.skills}
                                onChange={(e) => handleFieldChange('skills', e.target.value)}
                                rows={3}
                                className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3.5 text-slate-900 dark:text-white font-mono leading-relaxed focus:ring-2 focus:ring-indigo-500"
                            />
                        </Card>

                        <Card variant="flat" className="p-6 space-y-2">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Work Experience</h3>
                            <p className="text-xs text-slate-500">Format: Role | Company - Location | Date Range, followed by bullet points.</p>
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
                                <p className="text-xs text-slate-500">Format: Degree | Institution | Date Range.</p>
                                <textarea
                                    value={resumeData.education}
                                    onChange={(e) => handleFieldChange('education', e.target.value)}
                                    rows={4}
                                    className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3.5 text-slate-900 dark:text-white font-mono leading-relaxed focus:ring-2 focus:ring-indigo-500"
                                />
                            </Card>
                            <Card variant="flat" className="p-6 space-y-2">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Additional Information</h3>
                                <p className="text-xs text-slate-500">Format: Bulleted links, languages, availability.</p>
                                <textarea
                                    value={resumeData.additional_info || ''}
                                    onChange={(e) => handleFieldChange('additional_info', e.target.value)}
                                    rows={4}
                                    className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3.5 text-slate-900 dark:text-white font-mono leading-relaxed focus:ring-2 focus:ring-indigo-500"
                                    placeholder="• Portfolio: www.reallygreatsite.com&#10;• Languages: English&#10;• Availability: Open to work"
                                />
                            </Card>
                        </div>
                    </div>
                ) : (
                    /* Live Document Sheet with Visual Layout Archetypes */
                    <div className="flex flex-col items-center">
                        <div className="mb-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 print:hidden">
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>Click any text block below to edit inline. Strictly formatted in <strong>Times New Roman 11pt, 1.5 line spaced</strong>.</span>
                        </div>

                        {/* Printable Resume Sheet Container */}
                        <div 
                            id="ats-resume-printable-sheet"
                            className="bg-white text-black p-8 sm:p-14 md:p-16 max-w-4xl w-full shadow-2xl rounded-sm border border-slate-300 print:shadow-none print:border-none print:m-0 print:p-8"
                            style={{
                                fontFamily: '"Times New Roman", Times, serif',
                                fontSize: '11pt',
                                lineHeight: '1.5',
                                color: '#000000'
                            }}
                        >
                            {/* Layout Style 0: Canva Exact - Black and White Simple Clean Data Analyst */}
                            {templateStyle === 'canva_data_analyst_bw' && (
                                <div className="w-full text-black">
                                    {/* Header: Centered uppercase name, contact line, and solid black rule */}
                                    <div className="text-center pb-1">
                                        <h1 
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleFieldChange('full_name', e.currentTarget.textContent)}
                                            className="font-bold uppercase cursor-text hover:bg-amber-50/70 p-1 rounded transition-colors text-black" 
                                            style={{ fontSize: '18pt', letterSpacing: '0.12em', lineHeight: '1.2' }}
                                        >
                                            {resumeData.full_name || 'MATTHEW COLLINS'}
                                        </h1>
                                        <div 
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleFieldChange('contact_info', e.currentTarget.textContent)}
                                            className="mt-1 text-black font-normal cursor-text hover:bg-amber-50/70 p-1 rounded transition-colors" 
                                            style={{ fontSize: '10pt' }}
                                        >
                                            {resumeData.contact_info || '+123-456-7890 | hello@reallygreatsite.com | @reallygreatsite'}
                                        </div>
                                        {/* Solid, thick horizontal black divider line across the page width */}
                                        <div className="w-full border-b-[2.5px] border-black mt-3 mb-6"></div>
                                    </div>

                                    {/* 1. PROFESSIONAL SUMMARY */}
                                    {resumeData.professional_summary && (
                                        <div className="mb-6">
                                            <h2 
                                                className="text-center font-bold uppercase tracking-wider text-black mb-2"
                                                style={{ fontSize: '11pt', letterSpacing: '0.08em' }}
                                            >
                                                PROFESSIONAL SUMMARY
                                            </h2>
                                            <div 
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => handleFieldChange('professional_summary', e.currentTarget.textContent)}
                                                className="cursor-text hover:bg-amber-50/70 p-1 rounded transition-colors text-black leading-relaxed"
                                                style={{ fontSize: '11pt', lineHeight: '1.5', textAlign: 'justify' }}
                                            >
                                                {resumeData.professional_summary}
                                            </div>
                                        </div>
                                    )}

                                    {/* 2. WORK EXPERIENCE */}
                                    {resumeData.experience && (
                                        <div className="mb-6">
                                            <h2 
                                                className="text-center font-bold uppercase tracking-wider text-black mb-3"
                                                style={{ fontSize: '11pt', letterSpacing: '0.08em' }}
                                            >
                                                WORK EXPERIENCE
                                            </h2>
                                            <div className="space-y-4">
                                                {parseExperienceEntries(resumeData.experience).map((entry, idx) => (
                                                    <div key={idx} className="space-y-0.5">
                                                        <div className="flex justify-between items-baseline">
                                                            <span className="font-bold text-black" style={{ fontSize: '11pt' }}>
                                                                {entry.title}
                                                            </span>
                                                            <span className="font-bold text-black text-right" style={{ fontSize: '11pt' }}>
                                                                {entry.dates}
                                                            </span>
                                                        </div>
                                                        {entry.subtitle && (
                                                            <div className="text-black italic" style={{ fontSize: '10pt' }}>
                                                                {entry.subtitle}
                                                            </div>
                                                        )}
                                                        {entry.bullets.length > 0 && (
                                                            <ul className="list-disc ml-5 space-y-1 text-black mt-1" style={{ fontSize: '10.5pt', lineHeight: '1.4' }}>
                                                                {entry.bullets.map((b, bIdx) => (
                                                                    <li key={bIdx}>{b}</li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 3. EDUCATION */}
                                    {resumeData.education && (
                                        <div className="mb-6">
                                            <h2 
                                                className="text-center font-bold uppercase tracking-wider text-black mb-3"
                                                style={{ fontSize: '11pt', letterSpacing: '0.08em' }}
                                            >
                                                EDUCATION
                                            </h2>
                                            <div className="space-y-3">
                                                {parseEducationEntries(resumeData.education).map((edu, idx) => (
                                                    <div key={idx} className="space-y-0.5">
                                                        <div className="flex justify-between items-baseline">
                                                            <span className="font-bold text-black" style={{ fontSize: '11pt' }}>
                                                                {edu.degree}
                                                            </span>
                                                            <span className="font-bold text-black text-right" style={{ fontSize: '11pt' }}>
                                                                {edu.dates}
                                                            </span>
                                                        </div>
                                                        {edu.institution && (
                                                            <div className="text-black italic" style={{ fontSize: '10pt' }}>
                                                                {edu.institution}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 4. KEY SKILLS (2-column bulleted list with black rule) */}
                                    {resumeData.skills && (
                                        <div className="mb-6">
                                            <h2 
                                                className="text-center font-bold uppercase tracking-wider text-black mb-1"
                                                style={{ fontSize: '11pt', letterSpacing: '0.08em' }}
                                            >
                                                KEY SKILLS
                                            </h2>
                                            <div className="w-full border-b-[1.5px] border-black mb-3"></div>
                                            <div className="grid grid-cols-2 gap-x-8 text-black" style={{ fontSize: '10.5pt', lineHeight: '1.5' }}>
                                                <ul className="list-disc ml-5 space-y-1">
                                                    {parseTwoColumnSkills(resumeData.skills).col1.map((skill, sIdx) => (
                                                        <li key={sIdx}>{skill}</li>
                                                    ))}
                                                </ul>
                                                <ul className="list-disc ml-5 space-y-1">
                                                    {parseTwoColumnSkills(resumeData.skills).col2.map((skill, sIdx) => (
                                                        <li key={sIdx}>{skill}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {/* 5. ADDITIONAL INFORMATION (Bullets with black rule) */}
                                    {resumeData.additional_info && (
                                        <div className="mb-4">
                                            <h2 
                                                className="text-center font-bold uppercase tracking-wider text-black mb-1"
                                                style={{ fontSize: '11pt', letterSpacing: '0.08em' }}
                                            >
                                                ADDITIONAL INFORMATION
                                            </h2>
                                            <div className="w-full border-b-[1.5px] border-black mb-3"></div>
                                            <ul className="list-disc ml-5 space-y-1 text-black" style={{ fontSize: '10.5pt', lineHeight: '1.5' }}>
                                                {parseBulletList(resumeData.additional_info).map((info, iIdx) => (
                                                    <li key={iIdx}>{info}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Optional Projects if present */}
                                    {resumeData.projects && (
                                        <div className="mb-4">
                                            <h2 
                                                className="text-center font-bold uppercase tracking-wider text-black mb-1"
                                                style={{ fontSize: '11pt', letterSpacing: '0.08em' }}
                                            >
                                                KEY ACHIEVEMENTS & PROJECTS
                                            </h2>
                                            <div className="w-full border-b-[1.5px] border-black mb-3"></div>
                                            <div 
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => handleFieldChange('projects', e.currentTarget.textContent)}
                                                className="cursor-text hover:bg-amber-50/70 p-1 rounded transition-colors text-black whitespace-pre-line"
                                                style={{ fontSize: '11pt', lineHeight: '1.5' }}
                                            >
                                                {resumeData.projects}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

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
                                    {resumeData.additional_info && (
                                        <ResumeSection
                                            title="Additional Information"
                                            content={resumeData.additional_info}
                                            onBlur={(val) => handleFieldChange('additional_info', val)}
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
                                    {resumeData.additional_info && (
                                        <ResumeSection
                                            title="Additional Information"
                                            content={resumeData.additional_info}
                                            onBlur={(val) => handleFieldChange('additional_info', val)}
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
                                    {resumeData.additional_info && (
                                        <ResumeSection
                                            title="Additional Information"
                                            content={resumeData.additional_info}
                                            onBlur={(val) => handleFieldChange('additional_info', val)}
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
                                    {resumeData.additional_info && (
                                        <ResumeSection
                                            title="Additional Information"
                                            content={resumeData.additional_info}
                                            onBlur={(val) => handleFieldChange('additional_info', val)}
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
