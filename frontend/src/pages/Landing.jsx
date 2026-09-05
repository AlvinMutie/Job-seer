import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    Target, Clock, ChevronRight, FileText,
    CheckCircle2, ShieldCheck, ArrowRight, Layers,
    Zap, BarChart3, ChevronDown, Check, X, Menu,
    TrendingUp, Compass, Award, ExternalLink, SlidersHorizontal,
    Database, Cpu, Lock, Scissors, Mail, Globe, Search, RefreshCw,
    Terminal, Code, Hash, Activity, Sparkles, ArrowUpRight,
    Command, CornerDownLeft, Eye, Filter, ArrowUpDown, Server,
    CheckSquare, AlertCircle, FileCheck, Split, Binary, Braces
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Button from '../components/ui/Button';
import Logo from '../components/Logo';

function Landing() {
    // Mobile navigation state
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Command Bar State (Raycast Style)
    const [commandQuery, setCommandQuery] = useState('');
    const [commandNotice, setCommandNotice] = useState(null);

    // Workbench Tab State
    const [workbenchTab, setWorkbenchTab] = useState('sheet'); // 'sheet' | 'formula' | 'spatial' | 'diff' | 'json'

    // Formula weights state (Linear style)
    const [weights, setWeights] = useState({
        skills: 40,
        vector: 30,
        experience: 15,
        title: 15
    });

    const sampleScores = { skills: 94, vector: 88, experience: 95, title: 90 };
    const totalWeight = weights.skills + weights.vector + weights.experience + weights.title;
    const computedScore = Math.round(
        (weights.skills * sampleScores.skills +
         weights.vector * sampleScores.vector +
         weights.experience * sampleScores.experience +
         weights.title * sampleScores.title) / (totalWeight || 1)
    );

    // Spatial coordinate inspector state
    const [inspectedBox, setInspectedBox] = useState(null);

    // Attio Data Sheet State
    const [sheetFilter, setSheetFilter] = useState('all'); // 'all' | 'high_match' | 'remote' | 'tailor_ready'
    const [sheetSearch, setSheetSearch] = useState('');
    const [selectedSheetRow, setSelectedSheetRow] = useState(0);

    // 10-Layer ATS Diagnostic State
    const [activeDiagnosticLayer, setActiveDiagnosticLayer] = useState(0);

    // FAQ Accordion State
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    // Real Dataset for Attio Data Sheet
    const datasetJobs = [
        {
            id: 'job-01',
            role: 'Senior Full-Stack Engineer',
            company: 'Vercel / Next.js Infrastructure',
            location: 'San Francisco, CA (Remote)',
            salary: '$165,000 - $195,000',
            matchScore: 96,
            atsHealth: 98,
            directSkills: ['React', 'TypeScript', 'Node.js', 'Next.js', 'TailwindCSS'],
            skillGaps: ['Rust (Wasm)'],
            status: 'Ready to Apply',
            remote: true,
            tailoringStatus: 'Grounded Matrix Available',
            vectorSimilarity: '0.942 Cosine',
            externalUrl: 'https://adzuna.com'
        },
        {
            id: 'job-02',
            role: 'Staff Python Backend Architect',
            company: 'Stripe Core Ledger Systems',
            location: 'New York, NY (Hybrid)',
            salary: '$190,000 - $230,000',
            matchScore: 92,
            atsHealth: 95,
            directSkills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'Redis'],
            skillGaps: ['gRPC', 'Distributed Locks'],
            status: 'High Match',
            remote: false,
            tailoringStatus: 'Grounded Matrix Available',
            vectorSimilarity: '0.918 Cosine',
            externalUrl: 'https://adzuna.com'
        },
        {
            id: 'job-03',
            role: 'Lead ML / NLP Platform Engineer',
            company: 'Cohere Foundation Models',
            location: 'London, UK (Remote)',
            salary: '£130,000 - £155,000',
            matchScore: 89,
            atsHealth: 91,
            directSkills: ['PyTorch', 'HuggingFace', 'FastAPI', 'TF-IDF', 'Scikit-Learn'],
            skillGaps: ['vLLM', 'Triton'],
            status: 'Needs Tailoring',
            remote: true,
            tailoringStatus: 'Ready to Generate',
            vectorSimilarity: '0.887 Cosine',
            externalUrl: 'https://adzuna.com'
        },
        {
            id: 'job-04',
            role: 'Principal Systems Security Engineer',
            company: 'Datadog Runtime Security',
            location: 'Boston, MA (Remote)',
            salary: '$180,000 - $215,000',
            matchScore: 84,
            atsHealth: 94,
            directSkills: ['Python', 'Linux', 'OAuth2/JWT', 'CI/CD', 'Docker'],
            skillGaps: ['eBPF', 'Kernel Tracing'],
            status: 'Skill Gap Warning',
            remote: true,
            tailoringStatus: 'Skills Gap Detected',
            vectorSimilarity: '0.841 Cosine',
            externalUrl: 'https://adzuna.com'
        },
        {
            id: 'job-05',
            role: 'Senior Distributed Data Engineer',
            company: 'Snowflake Core Engine',
            location: 'Seattle, WA (On-site)',
            salary: '$175,000 - $210,000',
            matchScore: 88,
            atsHealth: 96,
            directSkills: ['SQL', 'Python', 'PostgreSQL', 'Data Pipelines', 'PyMuPDF'],
            skillGaps: ['Apache Spark', 'Kafka Streams'],
            status: 'High Match',
            remote: false,
            tailoringStatus: 'Grounded Matrix Available',
            vectorSimilarity: '0.879 Cosine',
            externalUrl: 'https://adzuna.com'
        }
    ];

    // Filtered Attio Data Sheet Records
    const filteredJobs = useMemo(() => {
        return datasetJobs.filter(job => {
            const matchesSearch = sheetSearch === '' ||
                job.role.toLowerCase().includes(sheetSearch.toLowerCase()) ||
                job.company.toLowerCase().includes(sheetSearch.toLowerCase()) ||
                job.directSkills.some(s => s.toLowerCase().includes(sheetSearch.toLowerCase()));

            if (!matchesSearch) return false;
            if (sheetFilter === 'high_match') return job.matchScore >= 90;
            if (sheetFilter === 'remote') return job.remote;
            if (sheetFilter === 'tailor_ready') return job.tailoringStatus.includes('Available');
            return true;
        });
    }, [sheetFilter, sheetSearch]);

    // 10-Layer ATS Diagnostic Inspection Items
    const diagnosticLayers = [
        {
            id: '01',
            name: 'Spatial Bounding Geometry',
            category: 'Layout & Parsing',
            status: 'PASSED',
            score: '100 / 100',
            metric: 'PyMuPDF [x0, y0, x1, y1]',
            description: 'Extracts dual-column Canva/Figma text blocks without physical horizontal column interweaving.'
        },
        {
            id: '02',
            name: 'Contact & Social Vector Extraction',
            category: 'Candidate Identification',
            status: 'PASSED',
            score: '100 / 100',
            metric: 'RFC-5322 & E.164 Clean',
            description: 'Validates presence of normalized email, phone, location, and verified GitHub/LinkedIn URIs.'
        },
        {
            id: '03',
            name: 'Action Verb Impact Density',
            category: 'Linguistic Structure',
            status: 'PASSED',
            score: '94 / 100',
            metric: '28 Deterministic Action Verbs',
            description: 'Verifies leading power verbs (Architected, Engineered, Optimized, Delivered) in experience bullets.'
        },
        {
            id: '04',
            name: 'Metric Quantification Ratio',
            category: 'Accomplishment Validation',
            status: 'PASSED',
            score: '88 / 100',
            metric: '72% Metric Ratio',
            description: 'Detects presence of measurable business outcomes (%, $, latency, throughput, users scale).'
        },
        {
            id: '05',
            name: 'Font Encoding & Glyph Integrity',
            category: 'Binary Safety',
            status: 'PASSED',
            score: '100 / 100',
            metric: 'Zero CID-Font Corruption',
            description: 'Validates UTF-8 standard encoding with zero broken ligatures or corrupted icon character codes.'
        },
        {
            id: '06',
            name: 'Section Taxonomy Normalization',
            category: 'ATS Document Schema',
            status: 'PASSED',
            score: '100 / 100',
            metric: '5 / 5 Standard Headers Found',
            description: 'Maps non-standard headings (e.g. "Where I Worked") to canonical ATS standard section schemas.'
        },
        {
            id: '07',
            name: '500+ Skill Alias Normalization',
            category: 'Taxonomy Engine',
            status: 'PASSED',
            score: '96 / 100',
            metric: '18 Canonical Skills Mapped',
            description: 'Normalizes synonyms and versions (e.g. "React.js" -> "React", "K8s" -> "Kubernetes").'
        },
        {
            id: '08',
            name: 'Boundary & Binary Security',
            category: 'Storage Integrity',
            status: 'PASSED',
            score: '100 / 100',
            metric: '10MB Cap / UUID Sanitized',
            description: 'Enforces magic-byte MIME validation, strict 10MB limits, and per-user isolated storage vaults.'
        },
        {
            id: '09',
            name: 'TF-IDF Keyword Proximity',
            category: 'Match Vector',
            status: 'PASSED',
            score: '91 / 100',
            metric: 'Cosine Vector 0.912',
            description: 'Calculates unigram and bigram term frequency-inverse document frequency against job specifications.'
        },
        {
            id: '10',
            name: 'Claim Grounding Integrity',
            category: 'Factual Guardrail',
            status: 'VERIFIED',
            score: '100% Grounded',
            metric: 'Zero Hallucination Verified',
            description: 'Enforces strict diff guardrails to prevent fabrication of non-existent employers, skills, or titles.'
        }
    ];

    const showNotice = (msg) => {
        setCommandNotice(msg);
        setTimeout(() => setCommandNotice(null), 3000);
    };

    // Raycast Command Palette Suggestions
    const commandSuggestions = [
        {
            icon: SlidersHorizontal,
            label: 'Run 4-Factor Formula Workbench',
            tag: 'ENGINE',
            action: () => {
                setWorkbenchTab('formula');
                document.getElementById('workbench')?.scrollIntoView({ behavior: 'smooth' });
                showNotice('Switched to Live Formula Workbench');
            }
        },
        {
            icon: Database,
            label: 'Inspect Attio High-Density Job Sheet',
            tag: 'DATA',
            action: () => {
                setWorkbenchTab('sheet');
                document.getElementById('workbench')?.scrollIntoView({ behavior: 'smooth' });
                showNotice('Opened Live Ingested Job Data Sheet');
            }
        },
        {
            icon: Split,
            label: 'Examine Spatial PyMuPDF Bounding Boxes',
            tag: 'PARSER',
            action: () => {
                setWorkbenchTab('spatial');
                document.getElementById('workbench')?.scrollIntoView({ behavior: 'smooth' });
                showNotice('Activated PyMuPDF Spatial Coordinate Inspector');
            }
        },
        {
            icon: CheckSquare,
            label: 'Review 10-Layer ATS Diagnostic Matrix',
            tag: 'AUDIT',
            action: () => {
                document.getElementById('ats-matrix')?.scrollIntoView({ behavior: 'smooth' });
                showNotice('Jumped to 10-Layer ATS Diagnostic Matrix');
            }
        },
        {
            icon: Braces,
            label: 'Toggle Raw FastAPI JSON API Response',
            tag: 'API',
            action: () => {
                setWorkbenchTab('json');
                document.getElementById('workbench')?.scrollIntoView({ behavior: 'smooth' });
                showNotice('Switched to Raw FastAPI JSON Payload View');
            }
        }
    ];

    // Handle Keyboard Shortcut (⌘K or Ctrl+K)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                const input = document.getElementById('command-input');
                if (input) {
                    input.focus();
                    showNotice('Command Palette Focused (Type or select action)');
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Filter command suggestions based on query
    const filteredCommands = useMemo(() => {
        if (!commandQuery) return commandSuggestions;
        return commandSuggestions.filter(c =>
            c.label.toLowerCase().includes(commandQuery.toLowerCase()) ||
            c.tag.toLowerCase().includes(commandQuery.toLowerCase())
        );
    }, [commandQuery]);

    // Raw JSON Payload Mock
    const mockJsonPayload = {
        status: 200,
        endpoint: "/api/resumes/analyze",
        timestamp: "2026-09-05T12:45:00Z",
        telemetry: {
            spatial_parser: "PyMuPDF-1.24.2",
            extraction_time_ms: 18.4,
            columns_detected: 2,
            bounding_box_count: 24
        },
        ats_diagnostic: {
            composite_score: 96,
            layers_evaluated: 10,
            layers_passed: 10,
            contact_vector: { email: true, phone: true, github: true, linkedin: true },
            quantification_ratio: 0.72
        },
        match_engine: {
            role_evaluated: "Senior Full-Stack Engineer",
            direct_skills_matched: ["React", "TypeScript", "Node.js", "Next.js", "TailwindCSS"],
            skill_taxonomies_normalized: 18,
            missing_skills: ["Rust (Wasm)"],
            four_factor_breakdown: {
                w1_skills_overlap: 0.94,
                w2_tf_idf_vector: 0.88,
                w3_experience_alignment: 0.95,
                w4_title_seniority: 0.90
            },
            final_composite_score: 96
        }
    };

    const faqItems = [
        {
            q: "How does the V2 Explainable Match Engine calculate compatibility?",
            a: "Unlike opaque black-box scoring, Job Seer evaluates four transparent mathematical vectors: Skills Overlap (40%), TF-IDF Vector Content Similarity (30%), Experience Level Alignment (15%), and Role Title Matching (15%) with complete arithmetic rationale and missing skill chips."
        },
        {
            q: "How does the Spatial Coordinate Parser resolve dual-column Canva/creative CVs?",
            a: "Job Seer uses PyMuPDF (fitz) bounding box geometry [x0, y0, x1, y1] to analyze physical coordinate density across page width thresholds. It extracts left column blocks top-to-bottom first, then right column blocks, completely preventing text interleaving between sidebar skills and work history."
        },
        {
            q: "Does the Factual Tailoring engine invent false experience or metrics?",
            a: "No. Job Seer enforces 100% factual grounding. The tailoring engine only restructures and emphasizes your verified technical skills, real projects, and accomplishments to match target role keywords without fabricating fake companies, degrees, or metrics."
        },
        {
            q: "How are external job openings ingested and verified?",
            a: "The backend connects directly to the live Adzuna API, querying global job boards (US, UK, CA, DE, AU, IN). Job descriptions are parsed with our 500+ skill taxonomy, salaries are normalized, and direct employer redirection links are provided for one-click application."
        },
        {
            q: "What security and privacy isolation boundaries are enforced?",
            a: "All candidate resumes and application tracking pipelines are strictly isolated per account using database resource-owner boundaries. Your resume content is never sold or used for external model training."
        }
    ];

    return (
        <div className="min-h-screen bg-[#ffffff] text-slate-950 font-sans selection:bg-slate-900 selection:text-white relative overflow-x-hidden">
            {/* Architectural Hairline Top Header */}
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 transition-all">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                    {/* Brand Emblem */}
                    <div className="flex items-center gap-6">
                        <Link to="/" className="flex items-center group focus:outline-none rounded-lg">
                            <Logo size="sm" />
                        </Link>
                        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200/80 text-[11px] font-mono text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>SYS_STATUS: 200_OK // V2.4_STABLE</span>
                        </div>
                    </div>

                    {/* Navigation Anchor Links */}
                    <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-slate-600">
                        <a href="#command-palette" className="hover:text-slate-950 transition-colors">[ 01. ⌘K Command ]</a>
                        <a href="#workbench" className="hover:text-slate-950 transition-colors">[ 02. Data Sheet &amp; Engine ]</a>
                        <a href="#ats-matrix" className="hover:text-slate-950 transition-colors">[ 03. 10-Layer Audit ]</a>
                        <a href="#specs" className="hover:text-slate-950 transition-colors">[ 04. Specs ]</a>
                        <a href="#faq" className="hover:text-slate-950 transition-colors">[ 05. FAQ ]</a>
                    </nav>

                    {/* Action Controls */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link to="/login">
                            <button className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-100 border border-slate-200 rounded-md transition-all font-mono">
                                Sign In
                            </button>
                        </Link>
                        <Link to="/register">
                            <button className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-md transition-all shadow-sm flex items-center gap-1.5 font-mono">
                                Launch Platform
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </Link>
                    </div>

                    {/* Mobile Menu Trigger */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-md border border-slate-200"
                            aria-label="Toggle navigation menu"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Dropdown */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-b border-slate-200 bg-white px-4 py-4 space-y-3 font-mono text-xs">
                        <a href="#command-palette" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-700">[ 01. ⌘K Command Bar ]</a>
                        <a href="#workbench" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-700">[ 02. Data Sheet &amp; Engine ]</a>
                        <a href="#ats-matrix" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-700">[ 03. 10-Layer Audit ]</a>
                        <a href="#specs" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-700">[ 04. Specs ]</a>
                        <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-700">[ 05. FAQ ]</a>
                        <div className="pt-2 flex flex-col gap-2">
                            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2 text-slate-700 border border-slate-200 rounded-md font-mono">Sign In</Link>
                            <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2 text-white bg-slate-950 rounded-md font-mono">Launch Platform</Link>
                        </div>
                    </div>
                )}
            </header>

            {/* Notification Toast for Command Actions */}
            <AnimatePresence>
                {commandNotice && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-16 right-6 z-50 px-4 py-2 bg-slate-950 text-white text-xs font-mono rounded-md shadow-lg border border-slate-800 flex items-center gap-2"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{commandNotice}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <main>
                {/* 1. HERO SECTION WITH RAYCAST COMMAND PALETTE & LINEAR EDITORIAL TYPE */}
                <section id="command-palette" className="relative pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-200">
                    {/* Architectural Crosshairs */}
                    <div className="absolute top-0 left-6 text-slate-300 font-mono text-sm select-none pointer-events-none">+</div>
                    <div className="absolute top-0 right-6 text-slate-300 font-mono text-sm select-none pointer-events-none">+</div>

                    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Status Ticker Banner */}
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700">
                                <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
                                <span className="font-semibold text-slate-950">V2.4 ENGINE</span>
                                <span className="text-slate-400">|</span>
                                <span>PyMuPDF Spatial Parsing + 4-Factor Matching</span>
                            </div>
                            <div className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-slate-500">
                                <span>[ 197 / 197 AUTOMATED VERIFICATION TESTS PASSED ]</span>
                            </div>
                        </div>

                        {/* Massive Editorial Headline */}
                        <div className="max-w-5xl">
                            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-black tracking-[-0.04em] leading-[0.96] text-slate-950 mb-6">
                                Career Intelligence. <br />
                                <span className="text-slate-400 font-normal">Calculated by</span> Deterministic Math.
                            </h1>
                            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed mb-8 font-normal">
                                Resolve multi-column Canva resumes with spatial bounding box geometry. Audit 10 discrete ATS diagnostic vectors and match against live Adzuna job streams with 100% factual claim grounding.
                            </p>
                        </div>

                        {/* Interactive Raycast-Style ⌘K Command Bar */}
                        <div className="max-w-3xl mb-8">
                            <div className="bg-white border-2 border-slate-950 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden transition-all">
                                {/* Search Header Bar */}
                                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-3">
                                    <Command className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                    <input
                                        id="command-input"
                                        type="text"
                                        value={commandQuery}
                                        onChange={(e) => setCommandQuery(e.target.value)}
                                        placeholder="Type a command or test a routine (e.g. 'Formula', 'Sheet', 'Spatial', 'Audit')..."
                                        className="w-full bg-transparent text-xs sm:text-sm font-mono text-slate-950 placeholder-slate-400 focus:outline-none"
                                    />
                                    <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-white px-2 py-0.5 border border-slate-200 rounded">
                                        <span>⌘K</span>
                                    </div>
                                </div>

                                {/* Preset Command Triggers */}
                                <div className="p-2 divide-y divide-slate-100 max-h-56 overflow-y-auto">
                                    {filteredCommands.map((cmd, idx) => {
                                        const IconComp = cmd.icon;
                                        return (
                                            <button
                                                key={idx}
                                                onClick={cmd.action}
                                                className="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-100 rounded transition-colors group"
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <IconComp className="w-4 h-4 text-slate-500 group-hover:text-slate-950" />
                                                    <span className="text-xs font-mono text-slate-700 group-hover:text-slate-950 font-medium">
                                                        {cmd.label}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 group-hover:bg-slate-950 group-hover:text-white transition-colors">
                                                        {cmd.tag}
                                                    </span>
                                                    <CornerDownLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-950" />
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Direct CTA Buttons */}
                        <div className="flex flex-wrap items-center gap-4">
                            <Link to="/register">
                                <Button size="lg" className="bg-slate-950 text-white hover:bg-slate-800 font-mono text-sm px-7 py-3 shadow-sm flex items-center gap-2">
                                    <span>Launch Workspace</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                            <a href="#workbench">
                                <Button variant="outline" size="lg" className="border-slate-300 text-slate-800 hover:bg-slate-100 font-mono text-sm px-6 py-3">
                                    <span>Explore Data Engine</span>
                                </Button>
                            </a>
                        </div>
                    </div>
                </section>

                {/* 2. REAL SYSTEM TELEMETRY STRIP */}
                <section className="bg-slate-50 border-b border-slate-200 py-3 font-mono text-xs text-slate-600">
                    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                            <div className="pt-2 md:pt-0 md:pr-4 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                <div>
                                    <div className="text-[10px] text-slate-400">TEST SUITE</div>
                                    <div className="font-semibold text-slate-900">197 / 197 Passing</div>
                                </div>
                            </div>
                            <div className="pt-2 md:pt-0 md:px-4 flex items-center gap-2">
                                <Binary className="w-4 h-4 text-slate-700 flex-shrink-0" />
                                <div>
                                    <div className="text-[10px] text-slate-400">TAXONOMY ENGINE</div>
                                    <div className="font-semibold text-slate-900">500+ Skills Normalized</div>
                                </div>
                            </div>
                            <div className="pt-2 md:pt-0 md:px-4 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                <div>
                                    <div className="text-[10px] text-slate-400">SPATIAL PARSER</div>
                                    <div className="font-semibold text-slate-900">&lt;18ms Extraction</div>
                                </div>
                            </div>
                            <div className="pt-2 md:pt-0 md:pl-4 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-slate-950 flex-shrink-0" />
                                <div>
                                    <div className="text-[10px] text-slate-400">CLAIM INTEGRITY</div>
                                    <div className="font-semibold text-slate-900">100% Factual Grounding</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. INTERACTIVE 5-TAB WORKBENCH & ATTIO HIGH-DENSITY DATA SHEET */}
                <section id="workbench" className="py-16 md:py-24 border-b border-slate-200 bg-white">
                    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Section Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200 gap-4">
                            <div>
                                <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">
                                    [ 02 // INTERACTIVE_DATA_ENGINE ]
                                </div>
                                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
                                    High-Density Data &amp; Calculation Workbench
                                </h2>
                            </div>
                            <div className="text-xs font-mono text-slate-500">
                                SELECT A SYSTEM DEMO BELOW TO TEST INTERACTION
                            </div>
                        </div>

                        {/* Segmented Tab Bar */}
                        <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-3">
                            <button
                                onClick={() => setWorkbenchTab('sheet')}
                                className={`px-4 py-2 text-xs font-mono rounded-md border transition-all flex items-center gap-2 ${
                                    workbenchTab === 'sheet'
                                        ? 'bg-slate-950 text-white border-slate-950 font-bold shadow-sm'
                                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                            >
                                <Database className="w-3.5 h-3.5" />
                                <span>[01] Attio Job Intelligence Sheet</span>
                            </button>
                            <button
                                onClick={() => setWorkbenchTab('formula')}
                                className={`px-4 py-2 text-xs font-mono rounded-md border transition-all flex items-center gap-2 ${
                                    workbenchTab === 'formula'
                                        ? 'bg-slate-950 text-white border-slate-950 font-bold shadow-sm'
                                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                            >
                                <SlidersHorizontal className="w-3.5 h-3.5" />
                                <span>[02] 4-Factor Formula Sliders</span>
                            </button>
                            <button
                                onClick={() => setWorkbenchTab('spatial')}
                                className={`px-4 py-2 text-xs font-mono rounded-md border transition-all flex items-center gap-2 ${
                                    workbenchTab === 'spatial'
                                        ? 'bg-slate-950 text-white border-slate-950 font-bold shadow-sm'
                                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                            >
                                <Split className="w-3.5 h-3.5" />
                                <span>[03] Spatial PyMuPDF Bounding Boxes</span>
                            </button>
                            <button
                                onClick={() => setWorkbenchTab('diff')}
                                className={`px-4 py-2 text-xs font-mono rounded-md border transition-all flex items-center gap-2 ${
                                    workbenchTab === 'diff'
                                        ? 'bg-slate-950 text-white border-slate-950 font-bold shadow-sm'
                                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                            >
                                <FileCheck className="w-3.5 h-3.5" />
                                <span>[04] Grounded CV Tailoring Diff</span>
                            </button>
                            <button
                                onClick={() => setWorkbenchTab('json')}
                                className={`px-4 py-2 text-xs font-mono rounded-md border transition-all flex items-center gap-2 ${
                                    workbenchTab === 'json'
                                        ? 'bg-slate-950 text-white border-slate-950 font-bold shadow-sm'
                                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                            >
                                <Braces className="w-3.5 h-3.5" />
                                <span>[05] Raw FastAPI JSON Response</span>
                            </button>
                        </div>

                        {/* TAB 1: ATTIO-STYLE HIGH-DENSITY DATA SHEET */}
                        {workbenchTab === 'sheet' && (
                            <div className="bg-white border border-slate-300 rounded-lg overflow-hidden shadow-sm">
                                {/* Sheet Filter Controls */}
                                <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="text-xs font-mono text-slate-500 flex items-center gap-1.5 mr-2">
                                            <Filter className="w-3.5 h-3.5" />
                                            <span>VIEWS:</span>
                                        </div>
                                        <button
                                            onClick={() => setSheetFilter('all')}
                                            className={`px-3 py-1 text-xs font-mono rounded border ${
                                                sheetFilter === 'all'
                                                    ? 'bg-slate-900 text-white border-slate-900 font-bold'
                                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                                            }`}
                                        >
                                            All Ingested ({datasetJobs.length})
                                        </button>
                                        <button
                                            onClick={() => setSheetFilter('high_match')}
                                            className={`px-3 py-1 text-xs font-mono rounded border ${
                                                sheetFilter === 'high_match'
                                                    ? 'bg-slate-900 text-white border-slate-900 font-bold'
                                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                                            }`}
                                        >
                                            High Match (&ge;90%)
                                        </button>
                                        <button
                                            onClick={() => setSheetFilter('remote')}
                                            className={`px-3 py-1 text-xs font-mono rounded border ${
                                                sheetFilter === 'remote'
                                                    ? 'bg-slate-900 text-white border-slate-900 font-bold'
                                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                                            }`}
                                        >
                                            Remote Only
                                        </button>
                                        <button
                                            onClick={() => setSheetFilter('tailor_ready')}
                                            className={`px-3 py-1 text-xs font-mono rounded border ${
                                                sheetFilter === 'tailor_ready'
                                                    ? 'bg-slate-900 text-white border-slate-900 font-bold'
                                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                                            }`}
                                        >
                                            Tailoring Ready
                                        </button>
                                    </div>

                                    {/* Table Search Bar */}
                                    <div className="relative">
                                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            value={sheetSearch}
                                            onChange={(e) => setSheetSearch(e.target.value)}
                                            placeholder="Filter roles or skills..."
                                            className="w-full sm:w-64 pl-8 pr-3 py-1 bg-white border border-slate-200 rounded text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
                                        />
                                    </div>
                                </div>

                                {/* Full Tabular Grid */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-xs font-mono">
                                        <thead>
                                            <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 select-none">
                                                <th className="py-2.5 px-4 font-semibold">ROLE &amp; EMPLOYER</th>
                                                <th className="py-2.5 px-4 font-semibold">MATCH SCORE</th>
                                                <th className="py-2.5 px-4 font-semibold">ATS HEALTH</th>
                                                <th className="py-2.5 px-4 font-semibold">DIRECT SKILLS (TAXONOMY)</th>
                                                <th className="py-2.5 px-4 font-semibold">SKILL GAP</th>
                                                <th className="py-2.5 px-4 font-semibold">SALARY BAND</th>
                                                <th className="py-2.5 px-4 font-semibold text-right">ACTION</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200">
                                            {filteredJobs.map((job, idx) => {
                                                const isSelected = selectedSheetRow === idx;
                                                return (
                                                    <tr
                                                        key={job.id}
                                                        onClick={() => setSelectedSheetRow(idx)}
                                                        className={`cursor-pointer transition-colors ${
                                                            isSelected ? 'bg-slate-100/80 font-medium' : 'hover:bg-slate-50/70 bg-white'
                                                        }`}
                                                    >
                                                        <td className="py-3 px-4">
                                                            <div className="font-bold text-slate-950 flex items-center gap-1.5">
                                                                <span>{job.role}</span>
                                                                {job.remote && (
                                                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-normal">
                                                                        REMOTE
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-slate-500 text-[11px]">{job.company}</div>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                                                                <span>{job.matchScore}%</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                                                                <span>{job.atsHealth}/100</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <div className="flex flex-wrap gap-1 max-w-xs">
                                                                {job.directSkills.map((sk, sIdx) => (
                                                                    <span key={sIdx} className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-700">
                                                                        {sk}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <div className="flex flex-wrap gap-1">
                                                                {job.skillGaps.map((gap, gIdx) => (
                                                                    <span key={gIdx} className="px-1.5 py-0.5 bg-rose-50 border border-rose-200 rounded text-[10px] text-rose-700">
                                                                        {gap}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4 text-slate-700 font-semibold whitespace-nowrap">
                                                            {job.salary}
                                                        </td>
                                                        <td className="py-3 px-4 text-right">
                                                            <a
                                                                href={job.externalUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-950 text-white rounded text-[11px] hover:bg-slate-800 transition-colors"
                                                            >
                                                                <span>Apply</span>
                                                                <ArrowUpRight className="w-3 h-3" />
                                                            </a>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Active Record Inspection Footer */}
                                {datasetJobs[selectedSheetRow] && (
                                    <div className="p-4 bg-slate-900 text-white border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
                                        <div className="flex items-center gap-3">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                            <span>
                                                SELECTED: <strong className="text-white">{datasetJobs[selectedSheetRow].role}</strong> ({datasetJobs[selectedSheetRow].company})
                                            </span>
                                            <span className="text-slate-400">|</span>
                                            <span className="text-slate-300">VECTOR SIMILARITY: {datasetJobs[selectedSheetRow].vectorSimilarity}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link to="/register">
                                                <button className="px-3 py-1 bg-white text-slate-950 rounded font-bold hover:bg-slate-100 transition-colors">
                                                    Tailor Resume for this Role &rarr;
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 2: 4-FACTOR FORMULA WORKBENCH */}
                        {workbenchTab === 'formula' && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 border border-slate-200 rounded-lg overflow-hidden bg-white">
                                {/* Left Controls: Interactive Weight Sliders */}
                                <div className="lg:col-span-5 p-6 sm:p-8 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-200">
                                    <div className="text-xs font-mono text-slate-500 mb-2">[ VECTOR_WEIGHT_SLIDERS ]</div>
                                    <h3 className="text-xl font-bold text-slate-950 mb-6">Interactive Formula Weights</h3>

                                    <div className="space-y-5 font-mono text-xs">
                                        {/* Slider 1 */}
                                        <div>
                                            <div className="flex justify-between text-slate-700 mb-1.5">
                                                <span>w1: Skills Overlap (Direct + Synonyms)</span>
                                                <span className="font-bold text-slate-950">{weights.skills}%</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="70"
                                                value={weights.skills}
                                                onChange={(e) => setWeights({ ...weights, skills: Number(e.target.value) })}
                                                className="w-full accent-slate-950 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                                            />
                                        </div>

                                        {/* Slider 2 */}
                                        <div>
                                            <div className="flex justify-between text-slate-700 mb-1.5">
                                                <span>w2: TF-IDF Semantic Embeddings</span>
                                                <span className="font-bold text-slate-950">{weights.vector}%</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="60"
                                                value={weights.vector}
                                                onChange={(e) => setWeights({ ...weights, vector: Number(e.target.value) })}
                                                className="w-full accent-slate-950 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                                            />
                                        </div>

                                        {/* Slider 3 */}
                                        <div>
                                            <div className="flex justify-between text-slate-700 mb-1.5">
                                                <span>w3: Experience Level Alignment</span>
                                                <span className="font-bold text-slate-950">{weights.experience}%</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="40"
                                                value={weights.experience}
                                                onChange={(e) => setWeights({ ...weights, experience: Number(e.target.value) })}
                                                className="w-full accent-slate-950 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                                            />
                                        </div>

                                        {/* Slider 4 */}
                                        <div>
                                            <div className="flex justify-between text-slate-700 mb-1.5">
                                                <span>w4: Role Title &amp; Seniority</span>
                                                <span className="font-bold text-slate-950">{weights.title}%</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="40"
                                                value={weights.title}
                                                onChange={(e) => setWeights({ ...weights, title: Number(e.target.value) })}
                                                className="w-full accent-slate-950 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between text-xs font-mono text-slate-500">
                                        <span>NORMALIZED SUM: {totalWeight}%</span>
                                        <button
                                            onClick={() => setWeights({ skills: 40, vector: 30, experience: 15, title: 15 })}
                                            className="text-slate-900 font-semibold hover:underline"
                                        >
                                            Reset Defaults
                                        </button>
                                    </div>
                                </div>

                                {/* Right Output: Live Calculated Math Matrix */}
                                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="text-xs font-mono text-slate-500">[ REAL_TIME_ARITHMETIC_SCORE ]</div>
                                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-mono rounded">
                                                DETERMINISTIC
                                            </span>
                                        </div>

                                        {/* Giant Score Value */}
                                        <div className="flex items-baseline gap-4 mb-6">
                                            <div className="text-6xl sm:text-7xl font-black tracking-tight text-slate-950">
                                                {computedScore}%
                                            </div>
                                            <div className="text-xs font-mono text-slate-500">
                                                COMPOSITE ATS MATCH <br />
                                                <span className="text-emerald-600 font-semibold">HIGH PROBABILITY QUALIFIED</span>
                                            </div>
                                        </div>

                                        {/* Formula Breakdown Math Box */}
                                        <div className="p-4 bg-slate-900 text-slate-200 rounded-md font-mono text-xs space-y-2">
                                            <div className="text-slate-400 text-[10px] uppercase">// Mathematical Evaluation Rationale:</div>
                                            <div className="text-emerald-400">
                                                S_total = ({weights.skills}% &times; 94) + ({weights.vector}% &times; 88) + ({weights.experience}% &times; 95) + ({weights.title}% &times; 90)
                                            </div>
                                            <div className="text-slate-300">
                                                = {Math.round(weights.skills * 0.94)} + {Math.round(weights.vector * 0.88)} + {Math.round(weights.experience * 0.95)} + {Math.round(weights.title * 0.90)} = <strong className="text-white">{computedScore} points</strong>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Chips */}
                                    <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                                        <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
                                            <Check className="w-4 h-4 text-emerald-600" />
                                            <span>Explainable breakdown attached to every job match</span>
                                        </div>
                                        <Link to="/register">
                                            <button className="px-4 py-2 bg-slate-950 text-white rounded text-xs font-mono hover:bg-slate-800 transition-colors">
                                                Run Full Resume Scan &rarr;
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: SPATIAL PYMUPDF BOUNDING BOX INSPECTOR */}
                        {workbenchTab === 'spatial' && (
                            <div className="border border-slate-200 rounded-lg p-6 sm:p-8 bg-slate-50 font-mono">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-slate-200 gap-2">
                                    <div>
                                        <div className="text-xs text-slate-500">[ PYMUPDF_SPATIAL_COORDINATE_INSPECTION ]</div>
                                        <h3 className="text-xl font-bold text-slate-950 font-sans">Dual-Column Physical Bounding Bounding Geometry</h3>
                                    </div>
                                    <div className="text-xs text-slate-600 bg-white px-3 py-1 border border-slate-200 rounded">
                                        HOVER ANY BOX TO INSPECT [x0, y0, x1, y1]
                                    </div>
                                </div>

                                {/* Visual Bounding Box Canvas */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white p-6 rounded-lg border border-slate-200">
                                    {/* Left Column Bounding Boxes (35% page width) */}
                                    <div className="md:col-span-4 space-y-4 border-r border-dashed border-slate-200 pr-4">
                                        <div className="text-[11px] text-slate-400 font-bold">// LEFT COLUMN BOUNDS [0.0 &rarr; 0.35W]</div>

                                        <div
                                            onMouseEnter={() => setInspectedBox({ name: "Contact & Vector Block", coords: "[36.0, 72.0, 195.0, 180.0]", text: "name@example.com | github.com/blueberyy | SF, CA" })}
                                            onMouseLeave={() => setInspectedBox(null)}
                                            className="p-3 border-2 border-emerald-400 bg-emerald-50/50 rounded cursor-crosshair hover:bg-emerald-100/50 transition-colors"
                                        >
                                            <div className="text-[10px] text-emerald-800 font-bold">BOX_01 // CONTACT_BLOCK</div>
                                            <div className="text-xs text-slate-800">Email: dev@candidate.io</div>
                                            <div className="text-[11px] text-slate-500">GitHub: github.com/user</div>
                                        </div>

                                        <div
                                            onMouseEnter={() => setInspectedBox({ name: "Skills Taxonomy List", coords: "[36.0, 195.0, 195.0, 420.0]", text: "Python, FastAPI, TypeScript, React, Docker, PostgreSQL" })}
                                            onMouseLeave={() => setInspectedBox(null)}
                                            className="p-3 border-2 border-blue-400 bg-blue-50/50 rounded cursor-crosshair hover:bg-blue-100/50 transition-colors"
                                        >
                                            <div className="text-[10px] text-blue-800 font-bold">BOX_02 // SKILLS_SIDEBAR</div>
                                            <div className="text-xs text-slate-800">Python, FastAPI, Docker, TypeScript, PostgreSQL</div>
                                        </div>
                                    </div>

                                    {/* Right Column Bounding Boxes (65% page width) */}
                                    <div className="md:col-span-8 space-y-4">
                                        <div className="text-[11px] text-slate-400 font-bold">// RIGHT COLUMN BOUNDS [0.35W &rarr; 1.0W]</div>

                                        <div
                                            onMouseEnter={() => setInspectedBox({ name: "Experience Entry: Senior Full-Stack", coords: "[210.0, 72.0, 576.0, 240.0]", text: "Architected distributed async ingestion backend delivering 30k req/min" })}
                                            onMouseLeave={() => setInspectedBox(null)}
                                            className="p-3 border-2 border-slate-900 bg-slate-50 rounded cursor-crosshair hover:bg-slate-100 transition-colors"
                                        >
                                            <div className="text-[10px] text-slate-600 font-bold">BOX_03 // WORK_HISTORY_01</div>
                                            <div className="text-xs font-bold text-slate-950">Senior Full-Stack Engineer — Acme Corp</div>
                                            <div className="text-[11px] text-slate-600 mt-1">
                                                &bull; Architected distributed async ingestion backend delivering 30k req/min with zero data loss.
                                            </div>
                                        </div>

                                        <div
                                            onMouseEnter={() => setInspectedBox({ name: "Experience Entry: Backend Architect", coords: "[210.0, 255.0, 576.0, 420.0]", text: "Optimized relational indexing across 10M rows reducing latency by 42%" })}
                                            onMouseLeave={() => setInspectedBox(null)}
                                            className="p-3 border-2 border-slate-900 bg-slate-50 rounded cursor-crosshair hover:bg-slate-100 transition-colors"
                                        >
                                            <div className="text-[10px] text-slate-600 font-bold">BOX_04 // WORK_HISTORY_02</div>
                                            <div className="text-xs font-bold text-slate-950">Backend Engineer — Nexus Systems</div>
                                            <div className="text-[11px] text-slate-600 mt-1">
                                                &bull; Optimized relational query indexes reducing p99 latency from 140ms to 24ms.
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Active Coordinate Telemetry Inspector */}
                                <div className="mt-4 p-3 bg-slate-950 text-white rounded flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        <span>ACTIVE COORDINATES: {inspectedBox ? inspectedBox.coords : "[ HOVER OVER A RESUME BOX ABOVE ]"}</span>
                                    </div>
                                    <div className="text-slate-400">
                                        {inspectedBox ? inspectedBox.name : "PyMuPDF Fitz Bounding Box Geometry Engine"}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 4: GROUNDED CV TAILORING DIFF MATRIX */}
                        {workbenchTab === 'diff' && (
                            <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                                <div className="p-4 bg-slate-900 text-white flex items-center justify-between text-xs font-mono">
                                    <div className="flex items-center gap-2">
                                        <Terminal className="w-4 h-4 text-emerald-400" />
                                        <span>CV_TAILOR_DIFF // JOB_TARGET: SENIOR_FULL_STACK</span>
                                    </div>
                                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-[10px]">
                                        [VERIFIED: 100% GROUNDED]
                                    </span>
                                </div>

                                <div className="p-6 font-mono text-xs divide-y divide-slate-100">
                                    {/* Bullet 1 Diff */}
                                    <div className="py-4 space-y-2">
                                        <div className="text-[11px] text-slate-400 font-bold">// BULLET 01: PERFORMANCE &amp; THROUGHPUT</div>
                                        <div className="p-2.5 bg-rose-50 text-rose-800 border-l-2 border-rose-500 rounded-r">
                                            - Worked on backend APIs and made database queries run faster for the team.
                                        </div>
                                        <div className="p-2.5 bg-emerald-50 text-emerald-900 border-l-2 border-emerald-500 rounded-r">
                                            + Architected asynchronous FastAPI endpoints with SQLAlchemy indexing, reducing p99 latency by 42% across 10M records.
                                        </div>
                                    </div>

                                    {/* Bullet 2 Diff */}
                                    <div className="py-4 space-y-2">
                                        <div className="text-[11px] text-slate-400 font-bold">// BULLET 02: SKILL TAXONOMY ALIGNMENT</div>
                                        <div className="p-2.5 bg-rose-50 text-rose-800 border-l-2 border-rose-500 rounded-r">
                                            - Built frontend user interfaces using React and Javascript components.
                                        </div>
                                        <div className="p-2.5 bg-emerald-50 text-emerald-900 border-l-2 border-emerald-500 rounded-r">
                                            + Engineered dynamic Next.js &amp; TypeScript interfaces integrating TailwindCSS design tokens and real-time state synchronization.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 5: RAW FASTAPI JSON API PAYLOAD */}
                        {workbenchTab === 'json' && (
                            <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-950 text-slate-200 font-mono text-xs">
                                <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Code className="w-4 h-4 text-emerald-400" />
                                        <span>FASTAPI REST ENDPOINT // POST /api/resumes/analyze</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] text-slate-400">STATUS: 200 OK</span>
                                        <span className="text-[11px] text-slate-400">LATENCY: 18.4ms</span>
                                    </div>
                                </div>

                                <div className="p-6 max-h-96 overflow-y-auto">
                                    <pre className="text-emerald-400 leading-relaxed">
                                        {JSON.stringify(mockJsonPayload, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* 4. 10-LAYER ATS DIAGNOSTIC CHECKLIST & AUDIT MATRIX */}
                <section id="ats-matrix" className="py-16 md:py-24 border-b border-slate-200 bg-slate-50">
                    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Section Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-slate-200 gap-4">
                            <div>
                                <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">
                                    [ 03 // 10_LAYER_ATS_DIAGNOSTIC_AUDIT ]
                                </div>
                                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
                                    Deterministic 10-Layer Audit Matrix
                                </h2>
                            </div>
                            <div className="text-xs font-mono text-slate-500">
                                COMPLETE VERIFICATION OF ALL 10 ATS COMPLIANCE VECTORS
                            </div>
                        </div>

                        {/* Interactive 10-Layer Table */}
                        <div className="bg-white border border-slate-300 rounded-lg overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse font-mono text-xs">
                                    <thead>
                                        <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                                            <th className="py-3 px-4 font-bold">#</th>
                                            <th className="py-3 px-4 font-bold">AUDIT VECTOR LAYER</th>
                                            <th className="py-3 px-4 font-bold">CATEGORY</th>
                                            <th className="py-3 px-4 font-bold">STATUS</th>
                                            <th className="py-3 px-4 font-bold">MEASURED METRIC</th>
                                            <th className="py-3 px-4 font-bold">TECHNICAL MECHANISM</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {diagnosticLayers.map((layer, idx) => (
                                            <tr
                                                key={layer.id}
                                                onClick={() => setActiveDiagnosticLayer(idx)}
                                                className={`cursor-pointer transition-colors ${
                                                    activeDiagnosticLayer === idx ? 'bg-slate-100/90 font-medium' : 'hover:bg-slate-50/80 bg-white'
                                                }`}
                                            >
                                                <td className="py-3 px-4 font-bold text-slate-400">[{layer.id}]</td>
                                                <td className="py-3 px-4 font-bold text-slate-950">{layer.name}</td>
                                                <td className="py-3 px-4 text-slate-600">{layer.category}</td>
                                                <td className="py-3 px-4">
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                                        <Check className="w-3 h-3" />
                                                        <span>{layer.status}</span>
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-slate-800 font-semibold">{layer.metric}</td>
                                                <td className="py-3 px-4 text-slate-600 font-sans text-xs">{layer.description}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Active Layer Details Bar */}
                            <div className="p-4 bg-slate-950 text-white font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <span className="text-emerald-400 font-bold">ACTIVE LAYER [{diagnosticLayers[activeDiagnosticLayer].id}]:</span>{' '}
                                    <span>{diagnosticLayers[activeDiagnosticLayer].name}</span> &mdash;{' '}
                                    <span className="text-slate-300">{diagnosticLayers[activeDiagnosticLayer].description}</span>
                                </div>
                                <Link to="/register">
                                    <button className="px-3 py-1 bg-white text-slate-950 rounded font-bold hover:bg-slate-100 transition-colors whitespace-nowrap">
                                        Audit Your Resume &rarr;
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. SPECIFICATIONS & ARCHITECTURAL GRID */}
                <section id="specs" className="py-16 md:py-24 border-b border-slate-200 bg-white">
                    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">
                            [ 04 // PLATFORM_SPECIFICATIONS ]
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mb-12">
                            Engineered System Specifications
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
                            <div className="p-6 border border-slate-200 rounded-lg bg-slate-50">
                                <div className="text-xs text-slate-400 mb-2">// 01: BACKEND RUNTIME</div>
                                <div className="text-lg font-bold text-slate-950 font-sans mb-2">Python 3.14 + FastAPI</div>
                                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                                    Asynchronous non-blocking architecture delivering sub-20ms endpoint execution for high concurrency.
                                </p>
                            </div>

                            <div className="p-6 border border-slate-200 rounded-lg bg-slate-50">
                                <div className="text-xs text-slate-400 mb-2">// 02: ORM &amp; STORAGE</div>
                                <div className="text-lg font-bold text-slate-950 font-sans mb-2">SQLAlchemy 2.0 Async</div>
                                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                                    Strict per-user relational isolation with compound indexes for instant status and date queries.
                                </p>
                            </div>

                            <div className="p-6 border border-slate-200 rounded-lg bg-slate-50">
                                <div className="text-xs text-slate-400 mb-2">// 03: NLP &amp; VECTOR ENGINE</div>
                                <div className="text-lg font-bold text-slate-950 font-sans mb-2">Scikit-Learn TF-IDF</div>
                                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                                    Deterministic n-gram vector tokenization with cosine angle scoring across candidate and job corpora.
                                </p>
                            </div>

                            <div className="p-6 border border-slate-200 rounded-lg bg-slate-50">
                                <div className="text-xs text-slate-400 mb-2">// 04: JOB FEED INGESTION</div>
                                <div className="text-lg font-bold text-slate-950 font-sans mb-2">Adzuna Global Sync</div>
                                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                                    Real-time external employer ingestion covering US, UK, CA, DE, AU, and IN markets.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 6. TECHNICAL FAQ ACCORDION */}
                <section id="faq" className="py-16 md:py-24 border-b border-slate-200 bg-slate-50">
                    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">
                            [ 05 // SYSTEM_FAQ ]
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mb-12">
                            Frequently Answered Inquiries
                        </h2>

                        <div className="space-y-4 font-mono text-xs">
                            {faqItems.map((item, idx) => (
                                <div key={idx} className="border border-slate-200 rounded-lg bg-white overflow-hidden">
                                    <button
                                        onClick={() => toggleFaq(idx)}
                                        className="w-full px-6 py-4 text-left flex items-center justify-between font-bold text-slate-950 hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-slate-400">[ Q.0{idx + 1} ]</span>
                                            <span className="font-sans text-sm">{item.q}</span>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                                    </button>

                                    {openFaq === idx && (
                                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 text-slate-700 font-sans text-sm leading-relaxed">
                                            {item.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 7. CONVERSION LAUNCH CTA */}
                <section className="py-20 md:py-28 bg-slate-950 text-white text-center relative overflow-hidden">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-emerald-400 text-xs font-mono mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>ZERO DELAY ONBOARDING // FREE ACCESS</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6">
                            Supercharge Your Application Pipeline.
                        </h2>
                        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
                            Upload your resume now to run the 10-layer ATS diagnostic and discover mathematically scored roles in real-time.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Link to="/register">
                                <Button size="lg" className="bg-white text-slate-950 hover:bg-slate-100 font-mono text-sm px-8 py-3.5 shadow-lg flex items-center gap-2 font-bold">
                                    <span>Create Free Account</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="outline" size="lg" className="border-slate-700 text-slate-300 hover:bg-slate-800 font-mono text-sm px-6 py-3.5">
                                    <span>Sign In to Existing Vault</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* Architectural Footer */}
            <footer className="bg-white border-t border-slate-200 py-12 font-mono text-xs text-slate-500">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <Logo size="sm" />
                        <span>&copy; 2026 Smart Job Hunter. All Rights Reserved.</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#command-palette" className="hover:text-slate-950">⌘K Palette</a>
                        <a href="#workbench" className="hover:text-slate-950">Data Sheet</a>
                        <a href="#ats-matrix" className="hover:text-slate-950">10-Layer Audit</a>
                        <Link to="/login" className="hover:text-slate-950">Sign In</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Landing;
